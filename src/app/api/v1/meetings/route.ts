import { db, success, error, requireUser, mockId } from "@/lib/api/mock-db";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  return success(
    db.meetings
      .filter((m) => !m.archived)
      .map((m) => ({
        id: m.id,
        title: m.title,
        startsAt: m.startsAt,
        endsAt: m.endsAt,
        courseName: db.courses.find((c) => c.id === m.courseId)?.name,
      }))
  );
}

export async function POST(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.startsAt) {
    return error("VALIDATION_ERROR", "Title and startsAt are required");
  }

  const meeting = {
    id: `mtg-${mockId()}`,
    title: body.title,
    startsAt: body.startsAt,
    endsAt: undefined as string | undefined,
    courseId: body.courseId,
    archived: false,
  };
  db.meetings.push(meeting);

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
