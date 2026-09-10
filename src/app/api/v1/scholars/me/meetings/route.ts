import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const mentorAssignment = db.mentorAssignments.find((ma) => ma.scholarId === user.sub);
  const mentor = mentorAssignment
    ? db.users.find((u) => u.id === mentorAssignment.mentorId)
    : null;

  return success(
    db.meetings
      .filter((m) => !m.archived)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
      .map((m) => ({
        id: m.id,
        title: m.title,
        startsAt: m.startsAt,
        endsAt: m.endsAt ?? m.startsAt,
        courseName: db.courses.find((c) => c.id === m.courseId)?.name,
        attendeeCount: db.attendance.filter((r) => r.meetingId === m.id).length,
        mentor: mentor
          ? { id: mentor.id, name: mentor.name, avatarUrl: mentor.avatarUrl }
          : undefined,
      }))
  );
}