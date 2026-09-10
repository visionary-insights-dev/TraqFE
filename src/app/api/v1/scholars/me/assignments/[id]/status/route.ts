import { db, success, error, requireUser, scholarStatusOverrides } from "@/lib/api/mock-db";
import { ASSIGNMENT_STATUSES, type AssignmentStatus } from "@/lib/types";

const EDITABLE: AssignmentStatus[] = ["NOT_STARTED", "IN_PROGRESS"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const assignment = db.assignments.find((a) => a.id === id && a.published);
  if (!assignment) return error("NOT_FOUND", "Assignment not found", 404);

  const scholarId = user.sub as string;
  const submission = db.submissions.find(
    (s) => s.assignmentId === id && s.scholarId === scholarId
  );

  const current = submission?.status ?? assignment.status;
  if (!EDITABLE.includes(current)) {
    return error(
      "STATUS_LOCKED",
      "Only assignments you haven't started or that are in progress can be updated",
      409
    );
  }

  const body = await request.json().catch(() => null);
  if (!body?.status || !ASSIGNMENT_STATUSES.includes(body.status) || !EDITABLE.includes(body.status)) {
    return error(
      "VALIDATION_ERROR",
      "Status must be NOT_STARTED or IN_PROGRESS"
    );
  }
  if (body.status === current) {
    return error("NO_CHANGE", "Status is already set to that value");
  }

  scholarStatusOverrides.set(`${scholarId}:${id}`, body.status);

  return success({
    id,
    status: body.status as AssignmentStatus,
  });
}