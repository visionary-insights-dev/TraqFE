import { db, success, error, requireUser, computeScholarStats, getSyllabus, getScholarTaskStatus } from "@/lib/api/mock-db";

const ACTIVITY_DESCRIPTIONS: Record<
  string,
  (actor: string, label?: string) => string
> = {
  SCHOLAR_JOINED: (actor, label) => `${label ?? "A scholar"} joined the program`,
  SCHOLAR_INVITED: (actor, label) => `${actor ?? "An admin"} invited ${label ?? "a new scholar"}`,
  MENTOR_PAIRED: (actor, label) => `${actor ?? "A mentor"} was paired with ${label ?? "a scholar"}`,
  ASSIGNMENT_PUBLISHED: (actor, label) => `${actor ?? "A mentor"} published ${label ?? "an assignment"}`,
  ASSIGNMENT_SUBMITTED: (actor, label) => `${label ?? "A scholar"} submitted an assignment`,
  ASSIGNMENT_VERIFIED: (actor, label) => `${actor ?? "A mentor"} verified ${label ?? "a submission"}`,
  MEETING_SCHEDULED: (actor, label) => `${actor ?? "A mentor"} scheduled ${label ?? "a meeting"}`,
  ATTENDANCE_UPDATED: (actor, label) => `Attendance was updated for ${label ?? "a meeting"}`,
  COURSE_ARCHIVED: (actor, label) => `${label ?? "A course"} was archived`,
  PROGRAM_ARCHIVED: (actor, label) => `${label ?? "A program"} was archived`,
  REPORT_GENERATED: (actor, label) => `${actor ?? "An admin"} generated ${label ?? "a report"}`,
  SETTINGS_UPDATED: (actor) => `${actor ?? "An admin"} updated organization settings`,
};

function activityItemFromAuditLog(
  log: (typeof db.auditLogs)[number]
): { id: string; type: string; actorName?: string; targetName?: string; description: string; at: string } {
  const actor = log.actorName ?? "Someone";
  const description = ACTIVITY_DESCRIPTIONS[log.eventType]
    ? ACTIVITY_DESCRIPTIONS[log.eventType](actor, log.entityLabel ?? log.detail)
    : log.detail ?? log.action;
  return {
    id: log.id,
    type: log.eventType,
    actorName: log.actorName,
    targetName: log.entityLabel,
    description,
    at: log.at,
  };
}

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

    const nextMeetingAttendeeCount = upcomingMeeting
      ? db.attendance.filter((r) => r.meetingId === upcomingMeeting.id).length
      : 0;

    const activeTasks = db.assignments
      .filter((a) => a.published)
      .map((a) => {
        const sub = subs.find((s) => s.assignmentId === a.id);
        return {
          id: a.id,
          title: a.title,
          courseName: db.courses.find((c) => c.id === a.courseId)?.name,
          dueAt: a.dueAt,
          status: getScholarTaskStatus(user.sub as string, a.id, sub?.status ?? a.status),
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
            attendeeCount: nextMeetingAttendeeCount,
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

  const recentActivity = [...db.auditLogs]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 10)
    .map(activityItemFromAuditLog);

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
