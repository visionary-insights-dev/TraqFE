import { error, requireUser, mockId } from "@/lib/api/mock-db";

/**
 * In-memory file store for the mock backend. Bytes are held per server process
 * and served back on GET — there is no real persistent storage, which is fine
 * because this entire API is a mock used while the real platform is built.
 */
const uploadStore = new Map<
  string,
  { contentType: string; bytes: Uint8Array<ArrayBuffer> }
>();

interface StoredFile {
  key: string;
  contentType: string;
  bytes: Uint8Array<ArrayBuffer>;
}

function storeFile(keyFromQuery: string | null, contentType: string, bytes: Uint8Array<ArrayBuffer>): StoredFile {
  const key =
    keyFromQuery ?? `uploads/${mockId()}/${crypto.randomUUID().slice(0, 8)}`;
  uploadStore.set(key, { contentType, bytes });
  return { key, contentType, bytes };
}

export async function POST(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const formData = await request.formData().catch(() => null);
  if (!formData) return error("VALIDATION_ERROR", "Expected multipart form data");

  const raw = formData.get("file");
  if (!raw || typeof raw === "string") {
    return error("VALIDATION_ERROR", "A file is required");
  }

  const bytes = new Uint8Array(await raw.arrayBuffer());
  const stored = storeFile(null, raw.type || "application/octet-stream", bytes);

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        key: stored.key,
        url: `/api/v1/uploads?key=${encodeURIComponent(stored.key)}`,
      },
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

export async function PUT(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const contentType =
    request.headers.get("content-type") ?? "application/octet-stream";
  const bytes = new Uint8Array(await request.arrayBuffer());

  const stored = storeFile(key, contentType, bytes);

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        key: stored.key,
        url: `/api/v1/uploads?key=${encodeURIComponent(stored.key)}`,
      },
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

// GET is intentionally unauthenticated: uploaded files are referenced directly
// by <img>, <a download> and fetch() without the Bearer header, mirroring how a
// real CDN-backed object store behaves.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key) return error("VALIDATION_ERROR", "key query parameter is required");

  const entry = uploadStore.get(key);
  if (!entry) return error("NOT_FOUND", "File not found", 404);

  return new Response(entry.bytes, {
    headers: {
      "Content-Type": entry.contentType,
      "Content-Length": String(entry.bytes.length),
      "Cache-Control": "public, max-age=300",
    },
  });
}