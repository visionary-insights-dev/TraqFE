import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const idx = db.courses.findIndex((c) => c.id === id);
  if (idx < 0) return error("NOT_FOUND", "Course not found", 404);

  const course = db.courses[idx];
  const program = course.programId ? db.programs.find((p) => p.id === course.programId) : null;

  return success({
    ...course,
    program: program ? { id: program.id, name: program.name } : null,
    scholarCount: db.users.filter((u) => u.role === "SCHOLAR").length,
    mentorName: undefined,
  });
}
