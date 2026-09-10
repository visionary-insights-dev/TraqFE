import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const role = user.role as string;
  const subs = db.submissions.filter((s) => s.status === "PENDING_VERIFICATION");

  let filtered = subs;
  if (role === "MENTOR") {
    const mentorCourseIds = db.assignments
      .filter((a) => a.mentorId === user.sub)
      .map((a) => a.courseId);
    filtered = subs.filter((s) => {
      const assignment = db.assignments.find((a) => a.id === s.assignmentId);
      return assignment && mentorCourseIds.includes(assignment.courseId);
    });
  }

  return success(
    filtered.map((s) => {
      const assignment = db.assignments.find((a) => a.id === s.assignmentId);
      const scholar = db.users.find((u) => u.id === s.scholarId);
      const isLate = new Date(s.submittedAt) > new Date(assignment?.dueAt ?? "");
      return {
        id: s.id,
        assignmentId: s.assignmentId,
        assignmentTitle: assignment?.title ?? "Unknown",
        scholarId: s.scholarId,
        scholarName: scholar?.name ?? "Unknown",
        courseName: assignment
          ? db.courses.find((c) => c.id === assignment.courseId)?.name
          : undefined,
        submittedAt: s.submittedAt,
        submissionUrl: undefined,
        status: s.status,
        late: isLate,
      };
    })
  );
}
