import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; sId: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id, sId } = await params;
  const sub = db.submissions.find((s) => s.id === sId && s.assignmentId === id);
  if (!sub) return error("NOT_FOUND", "Submission not found", 404);

  const assignment = db.assignments.find((a) => a.id === id);
  const scholar = db.users.find((u) => u.id === sub.scholarId);

  return success({
    id: sub.id,
    assignmentId: sub.assignmentId,
    assignmentTitle: assignment?.title ?? "Unknown",
    scholarId: sub.scholarId,
    scholarName: scholar?.name ?? "Unknown",
    avatarUrl: scholar?.avatarUrl,
    courseName: assignment
      ? db.courses.find((c) => c.id === assignment.courseId)?.name
      : undefined,
    submittedAt: sub.submittedAt,
    submissionUrl: undefined,
    scholarComment: sub.comment,
    status: sub.status,
    late: sub.late,
    creditPct: sub.creditPct,
    verificationComment: sub.verificationComment,
    verifiedBy: sub.verifiedBy,
    verifiedAt: sub.verifiedAt,
    assignment: {
      id: assignment?.id ?? id,
      title: assignment?.title ?? "Unknown",
      dueAt: assignment?.dueAt ?? "",
    },
    history: sub.history,
  });
}
