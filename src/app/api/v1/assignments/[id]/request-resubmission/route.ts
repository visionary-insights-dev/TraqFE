import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const sub = db.submissions.find((s) => s.id === id);
  if (!sub) return error("NOT_FOUND", "Submission not found", 404);

  const body = await request.json().catch(() => ({}));
  const now = new Date().toISOString();

  sub.status = "RESUBMISSION_REQUIRED";
  sub.verificationComment = body.comment;
  sub.verifiedBy = user.sub as string;
  sub.verifiedAt = now;
  sub.history.push({ status: "RESUBMISSION_REQUIRED", at: now, by: user.sub as string, note: body.comment });

  const assignment = db.assignments.find((a) => a.id === sub.assignmentId);
  const scholar = db.users.find((u) => u.id === sub.scholarId);

  return success({
    id: sub.id,
    assignmentId: sub.assignmentId,
    assignmentTitle: assignment?.title ?? "Unknown",
    scholarId: sub.scholarId,
    scholarName: scholar?.name ?? "Unknown",
    submittedAt: sub.submittedAt,
    status: sub.status,
    late: sub.late,
    creditPct: sub.creditPct,
    verificationComment: sub.verificationComment,
  });
}