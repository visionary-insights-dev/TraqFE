import { db, success, error, requireUser, mockId, recordAuditLog } from "@/lib/api/mock-db";
import type { ReportStatus } from "@/lib/types";
import type { UserRole } from "@/stores/types";

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

  const author = db.users.find((u) => u.id === user.sub);

  // Simulate async completion
  setTimeout(() => {
    report.status = "COMPLETED";
    (report as { completedAt?: string }).completedAt = new Date().toISOString();
    (report as { downloadUrl?: string }).downloadUrl = `/api/v1/reports/${report.id}/download?format=csv`;
  }, 5000);

  recordAuditLog({
    entityType: "REPORT",
    entityId: report.id,
    entityLabel: report.name,
    eventType: "REPORT_GENERATED",
    actorName: author?.name ?? "System",
    actorRole: user.role as UserRole,
    action: "report generated",
    detail: `Report "${report.name}" queued for generation`,
  });

  return success(report);
}
