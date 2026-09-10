import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const assignment = db.assignments.find((a) => a.id === id);
  if (!assignment) return error("NOT_FOUND", "Assignment not found", 404);

  const body = await request.json().catch(() => null);
  if (!body?.message) {
    return error("VALIDATION_ERROR", "Message is required");
  }

  const requestId = `cr-${mockId()}`;

  db.auditLogs.push({
    id: `audit-${mockId()}`,
    entityType: "assignment",
    entityId: id,
    entityLabel: assignment.title,
    eventType: "CHANGE_REQUESTED",
    actorName: db.users.find((u) => u.id === user.sub)?.name,
    actorRole: user.role as "SUPER_ADMIN" | "MENTOR" | "SCHOLAR",
    action: "change request",
    detail: body.message,
    at: new Date().toISOString(),
  });

  return success({ id: requestId });
}

function mockId() {
  return crypto.randomUUID().slice(0, 8);
}
