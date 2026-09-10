import { db, success, error, requireUser, computeScholarStats } from "@/lib/api/mock-db";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const role = user.role as string;

  if (role === "MENTOR") {
    const assignments = db.mentorAssignments.filter((ma) => ma.mentorId === user.sub);
    return success(
      assignments.map((ma) => {
        const scholar = db.users.find((u) => u.id === ma.scholarId);
        if (!scholar) return null;
        const stats = computeScholarStats(scholar.id);
        return {
          id: scholar.id,
          name: scholar.name,
          avatarUrl: scholar.avatarUrl,
          email: scholar.email,
          courseName: db.courses[0]?.name,
          progress: {
            overall: stats.overall,
            assignmentPct: stats.assignmentPct,
            attendancePct: stats.attendancePct,
          },
          atRisk: stats.atRisk,
        };
      }).filter(Boolean)
    );
  }

  // Admin: all mentor-scholar pairings
  return success(
    db.mentorAssignments.map((ma) => {
      const scholar = db.users.find((u) => u.id === ma.scholarId);
      const mentor = db.users.find((u) => u.id === ma.mentorId);
      return {
        id: `${ma.mentorId}-${ma.scholarId}`,
        scholarId: ma.scholarId,
        scholarName: scholar?.name,
        mentorId: ma.mentorId,
        mentorName: mentor?.name,
      };
    })
  );
}

export async function POST(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const body = await request.json().catch(() => null);
  if (!body?.scholarIds || !body?.mentorId) {
    return error("VALIDATION_ERROR", "scholarIds and mentorId are required");
  }

  const added: string[] = [];
  for (const scholarId of body.scholarIds as string[]) {
    const existing = db.mentorAssignments.find(
      (ma) => ma.scholarId === scholarId && ma.mentorId === body.mentorId
    );
    if (!existing) {
      db.mentorAssignments.push({ scholarId, mentorId: body.mentorId });
      added.push(scholarId);
    }
  }

  return success({ id: `ma-${added.length > 0 ? added[0] : "none"}` });
}
