import { db, success, error, requireUser, computeScholarStats } from "@/lib/api/mock-db";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const target = db.users.find((u) => u.id === id);
  if (!target) return error("NOT_FOUND", "User not found", 404);

  if (target.role === "SCHOLAR") {
    const stats = computeScholarStats(target.id);
    const submissions = db.submissions.filter((s) => s.scholarId === target.id);
    const records = db.attendance.filter((a) => a.scholarId === target.id);
    const mentorAssignment = db.mentorAssignments.find((ma) => ma.scholarId === target.id);
    const mentor = mentorAssignment
      ? db.users.find((u) => u.id === mentorAssignment.mentorId)
      : null;

    return success({
      id: target.id,
      name: target.name,
      email: target.email,
      phone: target.phone,
      avatarUrl: target.avatarUrl,
      courseName: db.courses[0]?.name,
      programName: db.programs[0]?.name,
      mentor: mentor ? { id: mentor.id, name: mentor.name } : null,
      joinedAt: "2026-01-20T10:00:00Z",
      status: target.status,
      progress: {
        overall: stats.overall,
        assignmentPct: stats.assignmentPct,
        attendancePct: stats.attendancePct,
        assignmentWeight: db.orgSettings.assignmentWeight,
        attendanceWeight: db.orgSettings.attendanceWeight,
      },
      attendance: {
        present: records.filter((r) => r.attendance === "PRESENT").length,
        absent: records.filter((r) => r.attendance === "ABSENT").length,
        excused: records.filter((r) => r.attendance === "EXCUSED").length,
        rate: stats.attendancePct,
      },
      assignments: db.assignments
        .filter((a) => a.published)
        .map((a) => {
          const sub = submissions.find((s) => s.assignmentId === a.id);
          return {
            id: a.id,
            title: a.title,
            courseName: db.courses.find((c) => c.id === a.courseId)?.name,
            dueAt: a.dueAt,
            submittedAt: sub?.submittedAt,
            status: sub?.status ?? a.status,
            creditPct: sub?.creditPct,
          };
        }),
      meetings: db.meetings
        .filter((m) => !m.archived)
        .map((m) => {
          const rec = records.find((r) => r.meetingId === m.id);
          return {
            id: m.id,
            title: m.title,
            startsAt: m.startsAt,
            attendance: rec?.attendance,
          };
        }),
      auditTrail: db.auditLogs
        .filter((l) => l.entityId === target.id)
        .slice(0, 10),
    });
  }

  if (target.role === "MENTOR") {
    const scholars = db.mentorAssignments
      .filter((ma) => ma.mentorId === target.id)
      .map((ma) => {
        const s = db.users.find((u) => u.id === ma.scholarId);
        if (!s) return null;
        const st = computeScholarStats(s.id);
        return {
          id: s.id,
          name: s.name,
          email: s.email,
          avatarUrl: s.avatarUrl,
          courseName: db.courses[0]?.name,
          programName: db.programs[0]?.name,
          status: s.status,
          progress: { overall: st.overall, assignmentPct: st.assignmentPct, attendancePct: st.attendancePct },
          atRisk: st.atRisk,
          joinedAt: "2026-01-20T10:00:00Z",
        };
      })
      .filter(Boolean);

    const mentorAssignments = db.assignments.filter((a) => a.mentorId === target.id);

    return success({
      id: target.id,
      name: target.name,
      email: target.email,
      phone: target.phone,
      avatarUrl: target.avatarUrl,
      title: target.title,
      joinedAt: "2026-01-15T10:00:00Z",
      scholars,
      assignments: mentorAssignments.map((a) => {
        const subs = db.submissions.filter((s) => s.assignmentId === a.id);
        return {
          id: a.id,
          title: a.title,
          dueAt: a.dueAt,
          submittedCount: subs.length,
          totalCount: db.mentorAssignments.filter((ma) => ma.mentorId === target.id).length,
        };
      }),
      meetings: db.meetings
        .filter((m) => !m.archived && m.courseId === db.assignments.find((a) => a.mentorId === target.id)?.courseId)
        .map((m) => ({ id: m.id, title: m.title, startsAt: m.startsAt })),
    });
  }

  return success({ id: target.id, name: target.name, email: target.email, role: target.role });
}
