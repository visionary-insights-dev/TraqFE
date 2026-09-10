import { db, success, error, requireUser, mockId } from "@/lib/api/mock-db";
import type { AssignmentStatus } from "@/lib/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const assignment = db.assignments.find((a) => a.id === id);
  if (!assignment) return error("NOT_FOUND", "Assignment not found", 404);

  const existingSub = db.submissions.find(
    (s) => s.assignmentId === id && s.scholarId === user.sub
  );
  if (existingSub && ["PENDING_VERIFICATION", "VERIFIED", "VERIFIED_LATE"].includes(existingSub.status)) {
    return error("ALREADY_SUBMITTED", "You have already submitted this assignment", 409);
  }

  const now = new Date();
  const isLate = now > new Date(assignment.dueAt);
  const creditPct = isLate
    ? Math.max(0, 100 - db.orgSettings.lateSubmissionPenaltyPct)
    : 100;

  const sub = {
    id: `sub-${mockId()}`,
    assignmentId: id,
    scholarId: user.sub as string,
    submittedAt: now.toISOString(),
    status: "PENDING_VERIFICATION" as AssignmentStatus,
    late: isLate,
    creditPct,
    history: [
      { status: "PENDING_VERIFICATION" as const, at: now.toISOString() },
    ],
  };
  db.submissions.push(sub);

  return success({ submissionId: sub.id, status: sub.status });
}
