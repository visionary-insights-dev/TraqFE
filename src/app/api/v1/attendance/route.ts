import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const meetings = db.meetings.filter((m) => !m.archived);

  return success(
    meetings.map((m) => {
      const records = db.attendance.filter((a) => a.meetingId === m.id);
      const scholars = db.users.filter((u) => u.role === "SCHOLAR");
      const present = records.filter((r) => r.attendance === "PRESENT").length;
      const absent = records.filter((r) => r.attendance === "ABSENT").length;
      const excused = records.filter((r) => r.attendance === "EXCUSED").length;
      const total = scholars.length;
      const rate = total > 0 ? Math.round((present / total) * 100) : 0;

      return {
        meetingId: m.id,
        title: m.title,
        startsAt: m.startsAt,
        courseName: m.courseId
          ? db.courses.find((c) => c.id === m.courseId)?.name
          : undefined,
        total,
        present,
        absent,
        excused,
        rate,
      };
    })
  );
}
