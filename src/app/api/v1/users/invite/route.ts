import { db, success, error, requireUser, mockId } from "@/lib/api/mock-db";

export async function POST(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.role) {
    return error("VALIDATION_ERROR", "Email and role are required");
  }

  const inv = {
    id: `inv-${mockId()}`,
    email: body.email,
    role: body.role,
    status: "SENT" as const,
    expiresAt: new Date(Date.now() + 48 * 3600_000).toISOString(),
    createdAt: new Date().toISOString(),
    invitedByName: db.users.find((u) => u.id === user.sub)?.name ?? "Admin",
    courseId: body.courseId,
  };
  db.invitations.push(inv);

  return success(inv);
}
