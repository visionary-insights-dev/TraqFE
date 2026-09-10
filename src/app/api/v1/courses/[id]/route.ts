import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const course = db.courses.find((c) => c.id === id);
  if (!course) return error("NOT_FOUND", "Course not found", 404);

  const body = await request.json().catch(() => null);
  if (body?.name !== undefined) course.name = body.name;
  if (body?.code !== undefined) course.code = body.code;
  if (body?.programId !== undefined) course.programId = body.programId;

  const program = course.programId ? db.programs.find((p) => p.id === course.programId) : null;

  return success({
    ...course,
    program: program ? { id: program.id, name: program.name } : null,
    scholarCount: db.users.filter((u) => u.role === "SCHOLAR").length,
    mentorName: undefined,
  });
}
