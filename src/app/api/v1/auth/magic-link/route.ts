import { success, error } from "@/lib/api/mock-db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.email) {
    return error("VALIDATION_ERROR", "Email is required");
  }
  return success(null);
}
