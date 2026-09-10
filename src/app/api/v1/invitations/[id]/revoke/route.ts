import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const inv = db.invitations.find((i) => i.id === id);
  if (!inv) return error("NOT_FOUND", "Invitation not found", 404);

  inv.status = "REVOKED";

  return success(inv);
}
