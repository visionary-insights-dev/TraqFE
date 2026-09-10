import { success, error, requireUser, mockId } from "@/lib/api/mock-db";

export async function POST(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const body = await request.json().catch(() => null);
  if (!body?.filename || !body?.contentType) {
    return error("VALIDATION_ERROR", "filename and contentType are required");
  }

  const fileKey = `uploads/${mockId()}/${body.filename}`;

  return success({
    uploadUrl: `https://storage.scholarlink.dev/upload?key=${fileKey}`,
    fileKey,
    publicUrl: `https://storage.scholarlink.dev/${fileKey}`,
  });
}
