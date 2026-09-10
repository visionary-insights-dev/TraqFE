import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const program = db.programs.find((p) => p.id === id);
  if (!program) return error("NOT_FOUND", "Program not found", 404);

  program.status = "ARCHIVED";

  const courseCount = db.courses.filter((c) => c.programId === program.id).length;
  const scholarCount = db.users.filter((u) => u.role === "SCHOLAR").length;

  return success({ ...program, courseCount, scholarCount });
}
