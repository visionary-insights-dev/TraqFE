import { db, success, error, requireUser } from "@/lib/api/mock-db";
import { buildCsv, buildPdf, buildReportRows } from "@/lib/api/report-export";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const report = db.reports.find((r) => r.id === id);
  if (!report) return error("NOT_FOUND", "Report not found", 404);

  if (report.status !== "COMPLETED") {
    return error("REPORT_NOT_READY", "Report has not finished generating", 409);
  }

  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "csv";
  const rows = buildReportRows();

  if (format === "pdf") {
    const buffer = buildPdf(report.name, rows);
    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${report.id}.pdf"`,
      },
    });
  }

  return new Response(buildCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${report.id}.csv"`,
    },
  });
}