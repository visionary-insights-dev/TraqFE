import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const job = db.importJobs.find((j) => j.id === id);
  if (!job) return error("NOT_FOUND", "Import job not found", 404);

  return success(job);
}
