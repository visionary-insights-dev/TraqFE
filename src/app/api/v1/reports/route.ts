import { db, success, error, requireUser, mockId } from "@/lib/api/mock-db";
import type { ReportStatus } from "@/lib/types";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  return success(db.reports);
}

export async function POST(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const body = await request.json().catch(() => null);
  if (!body?.name) {
    return error("VALIDATION_ERROR", "Report name is required");
  }

  const report = {
    id: `rpt-${mockId()}`,
    name: body.name,
    status: "PROCESSING" as ReportStatus,
    programId: body.programId,
    includeAtRisk: body.includeAtRisk ?? false,
    createdAt: new Date().toISOString(),
  };
  db.reports.push(report);

  // Simulate async completion
  setTimeout(() => {
    report.status = "COMPLETED";
    (report as { completedAt?: string }).completedAt = new Date().toISOString();
    (report as { downloadUrl?: string }).downloadUrl = `https://storage.scholarlink.dev/reports/${report.id}.pdf`;
  }, 5000);

  return success(report);
}
