import { db, success, error, requireUser, computeScholarStats, getScholarTaskStatus } from "@/lib/api/mock-db";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  return success(
    db.courses.map((c) => {
      const stats = computeScholarStats(user.sub as string);
      const program = c.programId ? db.programs.find((p) => p.id === c.programId) : null;
      const mentorAssignment = db.assignments.find((a) => a.courseId === c.id);
      const mentor = mentorAssignment
        ? db.users.find((u) => u.id === mentorAssignment.mentorId)
        : null;

      const assignments = db.assignments.filter(
        (a) => a.courseId === c.id && a.published
      );
      const subs = db.submissions.filter(
        (s) => s.scholarId === user.sub && assignments.some((a) => a.id === s.assignmentId)
      );
      const completed = subs.filter((s) =>
        ["VERIFIED", "VERIFIED_LATE"].includes(s.status)
      ).length;

      return {
        id: c.id,
        name: c.name,
        program: program ? { id: program.id, name: program.name } : { id: "", name: "General" },
        mentor: mentor ? { id: mentor.id, name: mentor.name, avatarUrl: mentor.avatarUrl } : null,
        progress: {
          assignmentsCompleted: completed,
          assignmentsTotal: assignments.length || 1,
          assignmentPct: assignments.length > 0 ? Math.round((completed / assignments.length) * 100) : 0,
          attendancePct: stats.attendancePct,
          overall: stats.overall,
        },
        recentTasks: assignments.slice(-3).map((a) => {
          const sub = subs.find((s) => s.assignmentId === a.id);
          return {
            id: a.id,
            title: a.title,
            courseName: c.name,
            dueAt: a.dueAt,
            status: getScholarTaskStatus(user.sub as string, a.id, sub?.status ?? a.status),
          };
        }),
      };
    })
  );
}
