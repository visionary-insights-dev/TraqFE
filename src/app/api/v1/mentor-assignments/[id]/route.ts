import { db, success, error, requireUser, computeScholarStats } from "@/lib/api/mock-db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const scholar = db.users.find((u) => u.id === id);
  if (!scholar) return error("NOT_FOUND", "Scholar not found", 404);

  const stats = computeScholarStats(scholar.id);

  return success({
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
  });
}
