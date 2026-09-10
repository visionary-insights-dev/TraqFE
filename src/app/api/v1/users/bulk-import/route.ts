import { db, success, error, requireUser, mockId } from "@/lib/api/mock-db";
import type { ImportStatus } from "@/lib/types";

export async function POST(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const body = await request.json().catch(() => null);
  if (!body?.fileName || !body?.rows) {
    return error("VALIDATION_ERROR", "fileName and rows are required");
  }

  const job = {
    id: `job-${mockId()}`,
    fileName: body.fileName,
    status: "PROCESSING" as ImportStatus,
    totalRows: body.rows.length,
    imported: 0,
    failed: 0,
    errors: [] as Array<{ row: number; email: string; message: string }>,
    createdAt: new Date().toISOString(),
  };
  db.importJobs.push(job);

  // Simulate async processing — mark completed after brief delay
  setTimeout(() => {
    job.status = "COMPLETED";
    job.imported = body.rows.length;
  }, 2000);

  return success(job);
}
