import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const meeting = db.meetings.find((m) => m.id === id);
  if (!meeting) return error("NOT_FOUND", "Meeting not found", 404);

  const body = await request.json().catch(() => null);
  if (body?.title !== undefined) meeting.title = body.title;
  if (body?.startsAt !== undefined) meeting.startsAt = body.startsAt;
  if (body?.courseId !== undefined) meeting.courseId = body.courseId;

  return success({
    id: meeting.id,
    title: meeting.title,
    startsAt: meeting.startsAt,
    endsAt: meeting.endsAt,
    courseName: meeting.courseId
      ? db.courses.find((c) => c.id === meeting.courseId)?.name
      : undefined,
  });
}
