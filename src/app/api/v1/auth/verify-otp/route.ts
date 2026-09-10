import { success, error, signToken } from "@/lib/api/mock-db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.otp) {
    return error("VALIDATION_ERROR", "Email and OTP are required");
  }
  if (body.otp !== "123456") {
    return error("INVALID_OTP", "Invalid OTP code", 401);
  }
  const resetToken = await signToken({ purpose: "password_reset", email: body.email }, "30m");
  return success({ resetToken });
}
