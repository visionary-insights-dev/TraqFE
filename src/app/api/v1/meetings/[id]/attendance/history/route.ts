import { db, success, error, requireUser, mockId } from "@/lib/api/mock-db";
import type { AttendanceAction } from "@/lib/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const meeting = db.meetings.find((m) => m.id === id);
  if (!meeting) return error("NOT_FOUND", "Meeting not found", 404);

  const records = db.attendance.filter((a) => a.meetingId === id);

  const history = records.flatMap((rec) => {
    const scholar = db.users.find((u) => u.id === rec.scholarId);
    return [
      {
        id: `hist-${mockId()}`,
        meetingId: id,
        scholarName: scholar?.name,
        action: "MEETING_SETTLED" as AttendanceAction,
        changedTo: rec.attendance,
        changedBy: "System",
        at: meeting.startsAt,
        note: "Attendance auto-settled",
      },
    ];
  });

  return success(history);
}
