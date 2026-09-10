import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  return success(db.invitations);
}
