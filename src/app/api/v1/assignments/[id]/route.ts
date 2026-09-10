import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const assignment = db.assignments.find((a) => a.id === id);
  if (!assignment) return error("NOT_FOUND", "Assignment not found", 404);

  const subs = db.submissions.filter((s) => s.assignmentId === id);
  const totalScholars = db.users.filter((u) => u.role === "SCHOLAR").length;
  const mentor = db.users.find((u) => u.id === assignment.mentorId);
  const program = db.programs.find((p) => p.id === assignment.programId);

  return success({
    id: assignment.id,
    title: assignment.title,
    description: assignment.description,
    dueAt: assignment.dueAt,
    status: assignment.status,
    courseId: assignment.courseId,
    programId: assignment.programId,
    programName: program?.name,
    courseName: db.courses.find((c) => c.id === assignment.courseId)?.name,
    mentor: mentor ? { id: mentor.id, name: mentor.name } : null,
    published: assignment.published,
    publishedAt: assignment.publishedAt,
    audience: assignment.audience,
    submissionStats: {
      submitted: subs.filter((s) => s.status !== "NOT_STARTED" && s.status !== "IN_PROGRESS").length,
      verified: subs.filter((s) => s.status === "VERIFIED" || s.status === "VERIFIED_LATE").length,
      pending: subs.filter((s) => s.status === "PENDING_VERIFICATION").length,
      resubmissionRequired: subs.filter((s) => s.status === "RESUBMISSION_REQUIRED").length,
      overdue: subs.filter((s) => s.status === "VERIFIED_LATE").length,
      total: totalScholars,
    },
    editWindowMinutes: db.orgSettings.assignmentEditWindowMinutes,
  });
}
