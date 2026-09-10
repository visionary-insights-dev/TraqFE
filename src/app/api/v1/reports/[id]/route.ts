import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const report = db.reports.find((r) => r.id === id);
  if (!report) return error("NOT_FOUND", "Report not found", 404);

  return success(report);
}
