import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const meeting = db.meetings.find((m) => m.id === id);
  if (!meeting) return error("NOT_FOUND", "Meeting not found", 404);

  const scholars = db.users.filter((u) => u.role === "SCHOLAR");
  const records = db.attendance.filter((a) => a.meetingId === id);

  return success({
    meetingId: meeting.id,
    title: meeting.title,
    startsAt: meeting.startsAt,
    courseName: meeting.courseId
      ? db.courses.find((c) => c.id === meeting.courseId)?.name
      : undefined,
    scholars: scholars.map((s) => {
      const rec = records.find((r) => r.scholarId === s.id);
      return {
        scholarId: s.id,
        name: s.name,
        email: s.email,
        attendance: (rec?.attendance ?? "ABSENT") as "PRESENT" | "ABSENT" | "EXCUSED",
      };
    }),
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const meeting = db.meetings.find((m) => m.id === id);
  if (!meeting) return error("NOT_FOUND", "Meeting not found", 404);

  const body = await request.json().catch(() => null);
  if (!body?.records || !Array.isArray(body.records)) {
    return error("VALIDATION_ERROR", "Records array is required");
  }

  const saved = body.records.map((r: { scholarId: string; attendance: string }) => {
    const existing = db.attendance.findIndex(
      (a) => a.meetingId === id && a.scholarId === r.scholarId
    );
    if (existing >= 0) {
      db.attendance[existing].attendance = r.attendance as "PRESENT" | "ABSENT" | "EXCUSED";
    } else {
      db.attendance.push({
        meetingId: id,
        scholarId: r.scholarId,
        attendance: r.attendance as "PRESENT" | "ABSENT" | "EXCUSED",
      });
    }
    return { scholarId: r.scholarId, attendance: r.attendance };
  });

  return success({ attendance: saved });
}
