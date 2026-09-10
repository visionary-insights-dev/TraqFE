import { db, success, error, requireUser, mockId } from "@/lib/api/mock-db";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const role = user.role as string;

  // Mentor or scholar: only return course summaries
  if (role === "MENTOR" || role === "SCHOLAR") {
    const courseIds = role === "MENTOR"
      ? [...new Set(db.assignments.filter((a) => a.mentorId === user.sub).map((a) => a.courseId))]
      : db.courses.map((c) => c.id);

    return success(
      courseIds.map((cid) => {
        const c = db.courses.find((cr) => cr.id === cid);
        return { id: cid, name: c?.name ?? "Unknown" };
      })
    );
  }

  // Admin: full course data
  return success(
    db.courses.map((c) => {
      const program = c.programId ? db.programs.find((p) => p.id === c.programId) : null;
      const scholarCount = db.users.filter((u) => u.role === "SCHOLAR").length;
      const mentorAssignment = db.assignments.find((a) => a.courseId === c.id);
      const mentor = mentorAssignment
        ? db.users.find((u) => u.id === mentorAssignment.mentorId)
        : null;
      return {
        id: c.id,
        name: c.name,
        code: c.code,
        program: program ? { id: program.id, name: program.name } : null,
        scholarCount,
        mentorName: mentor?.name,
        createdAt: c.createdAt,
      };
    })
  );
}

export async function POST(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const body = await request.json().catch(() => null);
  if (!body?.name) {
    return error("VALIDATION_ERROR", "Name is required");
  }

  const course = {
    id: `crs-${mockId()}`,
    name: body.name,
    code: body.code,
    programId: body.programId,
    createdAt: new Date().toISOString(),
  };
  db.courses.push(course);

  const program = course.programId ? db.programs.find((p) => p.id === course.programId) : null;

  return success({
    ...course,
    program: program ? { id: program.id, name: program.name } : null,
    scholarCount: 0,
    mentorName: undefined,
  });
}
