import { db, success, error, requireUser, recordAuditLog } from "@/lib/api/mock-db";
import { PEOPLE_STATUSES, type PeopleStatus } from "@/lib/types";
import type { UserRole } from "@/stores/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const target = db.users.find((u) => u.id === id);
  if (!target) return error("NOT_FOUND", "User not found", 404);
  if (target.role !== "SCHOLAR") {
    return error("INVALID_ROLE", "Only scholar accounts can be suspended or reactivated", 400);
  }

  const body = await request.json().catch(() => null);
  if (!body?.status || !PEOPLE_STATUSES.includes(body.status)) {
    return error("VALIDATION_ERROR", "A valid status is required");
  }
  const nextStatus = body.status as PeopleStatus;
  if (nextStatus === target.status) {
    return error("NO_CHANGE", `User is already ${target.status.toLowerCase()}`);
  }

  const previous = target.status;
  target.status = nextStatus;

  const author = db.users.find((u) => u.id === user.sub);
  recordAuditLog({
    entityType: "USER",
    entityId: target.id,
    entityLabel: target.name,
    eventType: "SCHOLAR_JOINED",
    actorName: author?.name ?? "System",
    actorRole: user.role as UserRole,
    action: nextStatus === "SUSPENDED" ? "scholar suspended" : "scholar reactivated",
    detail: `${target.name} ${nextStatus === "SUSPENDED" ? "suspended" : "reactivated"} (was ${previous.toLowerCase()})`,
  });

  const mentorAssignment = db.mentorAssignments.find((ma) => ma.scholarId === target.id);
  const mentor = mentorAssignment
    ? db.users.find((m) => m.id === mentorAssignment.mentorId)
    : null;

  return success({
    id: target.id,
    name: target.name,
    email: target.email,
    status: target.status,
    mentorName: mentor?.name,
  });
}