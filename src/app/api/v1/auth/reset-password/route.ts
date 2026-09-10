import { success, error, verifyToken } from "@/lib/api/mock-db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.resetToken || !body?.newPassword) {
    return error("VALIDATION_ERROR", "Reset token and new password are required");
  }
  const payload = await verifyToken(body.resetToken);
  if (!payload || payload.purpose !== "password_reset") {
    return error("INVALID_TOKEN", "Invalid or expired reset token", 401);
  }
  return success(null);
}
