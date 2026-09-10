"use client";

import { useState } from "react";
import { BarChart3, CheckCircle2, Loader2, WifiOff } from "lucide-react";
import { AdminPageHeader, DataTable, type DataTableColumn } from "@/components/admin";
import { Badge, Button, Checkbox, ErrorState, Input, Label } from "@/components/ui";
import { useConnectivity, useCreateReport, useDownloadReport, usePrograms, useReportTask, useReports } from "@/hooks";
import { reportSchema } from "@/validators";
import { formatDateTime, relativeTime } from "@/lib/utils";
import type { Report, ReportStatus } from "@/lib/types";

const STATUS_CONFIG: Record<ReportStatus, { label: string; variant: "amber" | "blue" | "green" | "red" }> = {
  QUEUED: { label: "Queued", variant: "amber" },
  PROCESSING: { label: "Processing", variant: "blue" },
  COMPLETED: { label: "Completed", variant: "green" },
  FAILED: { label: "Failed", variant: "red" },
};

export const AnalyticsView = () => {
  const isOnline = useConnectivity();
  const { data: reports, isLoading, isError, refetch } = useReports();
  const { data: programs } = usePrograms();
  const createMutation = useCreateReport();
  const downloadMutation = useDownloadReport();

  const [name, setName] = useState("");
  const [programId, setProgramId] = useState("");
  const [includeAtRisk, setIncludeAtRisk] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [trackedId, setTrackedId] = useState<string | null>(null);

  const trackedQuery = useReportTask(isRunning(trackedId) ? trackedId : null);

  const handleDownload = async (report: Report, format: "csv" | "pdf") => {
    setDownloadError(null);
    setDownloadingId(report.id);
    try {
      const blob = await downloadMutation.mutateAsync({
        reportId: report.id,
        format,
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${report.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.${format}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setDownloadError(
        err instanceof Error ? err.message : "Could not download the report."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Analytics & reporting"
          description="Generate snapshot reports for programs."
        />
        <ErrorState
          title="Could not load reports"
          message="Something went wrong while loading reports. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const parsed = reportSchema.safeParse({
      name,
      programId: programId || undefined,
      includeAtRisk,
    });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Check the form and try again.");
      return;
    }
    try {
      const report = await createMutation.mutateAsync({
        name: parsed.data.name.trim(),
        programId: parsed.data.programId,
        includeAtRisk: parsed.data.includeAtRisk,
      });
      setTrackedId(report.id);
      setName("");
      setProgramId("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not generate the report.");
    }
  };

  const list = reports ?? [];

  const columns: Array<DataTableColumn<Report>> = [
    {
      key: "name",
      header: "Report",
      sortValue: (r) => r.name,
      render: (r) => (
        <p className="font-medium text-neutral-900">{r.name}</p>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (r) => r.status,
      render: (r) => {
        const config = STATUS_CONFIG[r.status];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "created",
      header: "Created",
      sortValue: (r) => r.createdAt,
      render: (r) => (
        <span className="text-neutral-600">{relativeTime(r.createdAt)}</span>
      ),
    },
    {
      key: "completed",
      header: "Completed",
      sortValue: (r) => r.completedAt ?? "",
      render: (r) => (
        <span className="text-neutral-600">
          {r.completedAt ? formatDateTime(r.completedAt) : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (r) => {
        if (r.status === "COMPLETED") {
          return (
            <div className="flex justify-end gap-1.5">
              <Button
                size="sm"
                variant="outline"
                disabled={downloadingId !== null}
                loading={downloadingId === r.id && downloadMutation.isPending}
                onClick={() => handleDownload(r, "csv")}
                aria-label={`Download ${r.name} as CSV`}
              >
                CSV
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={downloadingId !== null}
                loading={downloadingId === r.id && downloadMutation.isPending}
                onClick={() => handleDownload(r, "pdf")}
                aria-label={`Download ${r.name} as PDF`}
              >
                PDF
              </Button>
            </div>
          );
        }
        if (r.status === "FAILED") {
          return (
            <span className="text-xs text-neutral-500">See errors</span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Generating…
          </span>
        );
      },
    },
  ];

  const trackedJob = trackedId && trackedQuery.data?.status === "COMPLETED" ? trackedQuery.data : null;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Analytics & reporting"
        description="Generate snapshot reports for programs you run."
      />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Reports can&apos;t be generated right now.
        </div>
      ) : null}

      <section className="glass-card rounded-2xl overflow-hidden" aria-label="Generate a report">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200/70 px-6 py-5">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold text-neutral-900">
              <BarChart3 className="h-5 w-5 text-brand-600" aria-hidden="true" />
              Generate a report
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Snapshot of progress, attendance and at-risk flags. Reports are generated asynchronously.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 px-6 py-6 sm:grid-cols-2" noValidate>
          <Input
            id="report-name"
            label="Report name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mid-term snapshot"
            autoComplete="off"
          />
          <div>
            <Label htmlFor="report-program">Program</Label>
            <select
              id="report-program"
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <option value="">All programs</option>
              {(programs ?? [])
                .filter((p) => p.status === "ACTIVE")
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <Checkbox
              id="report-at-risk"
              checked={includeAtRisk}
              onChange={(e) => setIncludeAtRisk(e.target.checked)}
              label="Include the at-risk scholars list"
            />
          </div>

          {formError ? (
            <p
              role="alert"
              className="sm:col-span-2 rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark"
            >
              {formError}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-4 pt-2 sm:col-span-2">
            {trackedJob ? (
              <Badge variant="green">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                &quot;{trackedJob.name}&quot; is ready to download
              </Badge>
            ) : (
              <span className="text-sm text-neutral-500">
                Reports run in the background — you can keep working.
              </span>
            )}
            <Button type="submit" loading={createMutation.isPending} disabled={!isOnline}>
              Generate report
            </Button>
          </div>
        </form>
      </section>

      <section className="glass-card rounded-2xl" aria-label="Past reports">
        <div className="border-b border-neutral-200/70 px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Past reports
          </h2>
        </div>
        {downloadError ? (
          <p
            role="alert"
            className="mx-6 mt-4 rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark"
          >
            {downloadError}
          </p>
        ) : null}
        <DataTable<Report>
          caption="Generated reports"
          rows={list}
          rowKey={(r) => r.id}
          columns={columns}
          emptyTitle="No reports yet"
          emptyDescription="Generate your first report above."
        />
      </section>
    </div>
  );
};

function isRunning(reportId: string | null): reportId is string {
  return reportId !== null;
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading analytics">
      <div className="space-y-2">
        <div className="skeleton-shimmer h-8 w-52 rounded-lg" />
        <div className="skeleton-shimmer h-4 w-72 rounded" />
      </div>
      <div className="skeleton-shimmer h-64 rounded-2xl" />
      <div className="skeleton-shimmer h-40 rounded-2xl" />
    </div>
  );
}