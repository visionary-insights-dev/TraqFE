import { db, success, error, requireUser, mockId } from "@/lib/api/mock-db";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  return success(
    db.programs.map((p) => {
      const courseCount = db.courses.filter((c) => c.programId === p.id).length;
      const scholarCount = db.users.filter((u) => u.role === "SCHOLAR").length;
      return {
        ...p,
        courseCount,
        scholarCount,
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

  const program = {
    id: `prog-${mockId()}`,
    name: body.name,
    description: body.description,
    status: "ACTIVE" as const,
    startDate: body.startDate,
    endDate: body.endDate,
    createdAt: new Date().toISOString(),
  };
  db.programs.push(program);

  return success({
    ...program,
    courseCount: 0,
    scholarCount: 0,
  });
}
