import { success, error, requireUser, mockId } from "@/lib/api/mock-db";

export async function POST(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const body = await request.json().catch(() => null);
  if (!body?.filename || !body?.contentType) {
    return error("VALIDATION_ERROR", "filename and contentType are required");
  }

  const fileKey = `uploads/${mockId()}/${body.filename}`;
  const signedUrl = `/api/v1/uploads?key=${encodeURIComponent(fileKey)}`;
  // uploadUrl is relative to the API base so the axios client resolves it
  // against /api/v1. publicUrl is an absolute app path for <img>/<a> use.
  return success({
    uploadUrl: `/uploads?key=${encodeURIComponent(fileKey)}`,
    fileKey,
    publicUrl: signedUrl,
  });
}