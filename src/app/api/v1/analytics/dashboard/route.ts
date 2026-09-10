import { db, success, error, requireUser, computeScholarStats, getSyllabus } from "@/lib/api/mock-db";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const role = user.role as string;

  if (role === "SCHOLAR") {
    const stats = computeScholarStats(user.sub as string);
    const syllabus = getSyllabus();
    const subs = db.submissions.filter((s) => s.scholarId === user.sub);
    const mentorAssignment = db.mentorAssignments.find((ma) => ma.scholarId === user.sub);
    const mentor = mentorAssignment
      ? db.users.find((u) => u.id === mentorAssignment.mentorId)
      : null;

    const upcomingMeeting = db.meetings
      .filter((m) => !m.archived && new Date(m.startsAt) > new Date())
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())[0];

    const activeTasks = db.assignments
      .filter((a) => a.published)
      .map((a) => {
        const sub = subs.find((s) => s.assignmentId === a.id);
        return {
          id: a.id,
          title: a.title,
          courseName: db.courses.find((c) => c.id === a.courseId)?.name,
          dueAt: a.dueAt,
          status: sub?.status ?? a.status,
        };
      })
      .filter((t) => !["VERIFIED", "VERIFIED_LATE"].includes(t.status))
      .slice(0, 5);

    return success({
      progress: {
        overall: stats.overall,
        assignmentPct: stats.assignmentPct,
        attendancePct: stats.attendancePct,
        assignmentWeight: syllabus.assignmentWeight,
        attendanceWeight: syllabus.attendanceWeight,
      },
      attendance: {
        rate: stats.attendancePct,
        target: 80,
      },
      upcomingMeeting: upcomingMeeting
        ? {
            id: upcomingMeeting.id,
            title: upcomingMeeting.title,
            startsAt: upcomingMeeting.startsAt,
            endsAt: upcomingMeeting.endsAt ?? upcomingMeeting.startsAt,
            courseName: db.courses.find((c) => c.id === upcomingMeeting.courseId)?.name,
            mentor: mentor
              ? { id: mentor.id, name: mentor.name, avatarUrl: mentor.avatarUrl }
              : undefined,
          }
        : null,
      activeTasks,
      mentor: mentor
        ? { id: mentor.id, name: mentor.name, avatarUrl: mentor.avatarUrl }
        : null,
    });
  }

  // Admin / Mentor dashboard
  const scholars = db.users.filter((u) => u.role === "SCHOLAR");
  const scholarStats = scholars.map((s) => ({
    user: s,
    ...computeScholarStats(s.id),
  }));

  const totalAttendanceRate =
    scholarStats.reduce((sum, s) => sum + s.attendancePct, 0) / (scholarStats.length || 1);

  const totalAssignmentRate =
    scholarStats.reduce((sum, s) => sum + s.assignmentPct, 0) / (scholarStats.length || 1);

  const atRiskScholars = scholarStats
    .filter((s) => s.atRisk)
    .map((s) => {
      const mentorAssignment = db.mentorAssignments.find((ma) => ma.scholarId === s.user.id);
      const mentor = mentorAssignment
        ? db.users.find((u) => u.id === mentorAssignment.mentorId)
        : null;
      const overdueCount = s.overdueCount;
      const reasons: string[] = [];
      if (s.assignmentPct < db.orgSettings.atRisk.assignmentPct)
        reasons.push(`Low assignment completion (${s.assignmentPct}%)`);
      if (s.attendancePct < db.orgSettings.atRisk.attendancePct)
        reasons.push(`Low attendance rate (${s.attendancePct}%)`);
      if (overdueCount >= db.orgSettings.atRisk.overdueCount)
        reasons.push(`${overdueCount} overdue submissions`);
      return {
        id: s.user.id,
        name: s.user.name,
        email: s.user.email,
        courseName: db.courses[0]?.name,
        mentorName: mentor?.name,
        attendancePct: s.attendancePct,
        assignmentPct: s.assignmentPct,
        overdueCount,
        reason: reasons.join("; ") || "At risk",
      };
    });

  const recentActivity = db.auditLogs.slice(-10).reverse();

  return success({
    metrics: {
      scholars: scholars.length,
      mentors: db.users.filter((u) => u.role === "MENTOR").length,
      activePrograms: db.programs.filter((p) => p.status === "ACTIVE").length,
      activeCourses: db.courses.length,
      atRiskScholars: atRiskScholars.length,
      avgAttendanceRate: Math.round(totalAttendanceRate),
      assignmentCompletionRate: Math.round(totalAssignmentRate),
      pendingVerification: db.submissions.filter((s) => s.status === "PENDING_VERIFICATION").length,
    },
    atRiskScholars,
    recentActivity,
  });
}
