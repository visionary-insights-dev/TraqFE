import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const assignment = db.assignments.find((a) => a.id === id);
  if (!assignment) return error("NOT_FOUND", "Assignment not found", 404);

  assignment.published = true;
  assignment.publishedAt = new Date().toISOString();
  assignment.status = "IN_PROGRESS";

  const totalScholars = db.users.filter((u) => u.role === "SCHOLAR").length;
  const subs = db.submissions.filter((s) => s.assignmentId === id);

  return success({
    id: assignment.id,
    title: assignment.title,
    description: assignment.description,
    dueAt: assignment.dueAt,
    status: assignment.status,
    courseId: assignment.courseId,
    programId: assignment.programId,
    courseName: db.courses.find((c) => c.id === assignment.courseId)?.name,
    mentor: db.users.find((u) => u.id === assignment.mentorId)
      ? { id: assignment.mentorId, name: db.users.find((u) => u.id === assignment.mentorId)!.name }
      : null,
    published: assignment.published,
    publishedAt: assignment.publishedAt,
    audience: assignment.audience,
    submissionStats: {
      submitted: subs.length,
      verified: subs.filter((s) => s.status === "VERIFIED" || s.status === "VERIFIED_LATE").length,
      pending: subs.filter((s) => s.status === "PENDING_VERIFICATION").length,
      resubmissionRequired: subs.filter((s) => s.status === "RESUBMISSION_REQUIRED").length,
      overdue: 0,
      total: totalScholars,
    },
    editWindowMinutes: db.orgSettings.assignmentEditWindowMinutes,
  });
}
