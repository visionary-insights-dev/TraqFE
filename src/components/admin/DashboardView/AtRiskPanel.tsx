import { ArrowUpRight, UserX } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui";
import { DataTable } from "@/components/admin";
import { ProgressBar } from "@/components/scholar/shared";
import type { AtRiskScholar } from "@/lib/types";

interface AtRiskPanelProps {
  scholars: AtRiskScholar[];
  loading: boolean;
}

export const AtRiskPanel = ({ scholars, loading }: AtRiskPanelProps) => {
  return (
    <section className="glass-card overflow-hidden rounded-2xl" aria-labelledby="at-risk-heading">
      <header className="flex items-center justify-between border-b border-neutral-200/70 px-5 py-4">
        <div>
          <h2 id="at-risk-heading" className="text-sm font-semibold text-neutral-900">
            At-risk scholars
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Scholars below attendance, assignment, or overdue thresholds
          </p>
        </div>
        <Link
          href="/admin/scholars?risk=at-risk"
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          View all
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </header>
      <DataTable<AtRiskScholar>
        caption="At-risk scholars"
        rows={scholars}
        isLoading={loading}
        skeletonRowCount={4}
        rowKey={(s) => s.id}
        emptyTitle="No at-risk scholars"
        emptyDescription="Everyone is meeting their attendance and assignment targets."
        columns={[
          {
            key: "name",
            header: "Scholar",
            sortValue: (s) => s.name,
            render: (s) => (
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warning-light text-warning-dark">
                  <UserX className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <Link
                    href={`/admin/scholars/${s.id}`}
                    className="font-medium text-neutral-900 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                  >
                    {s.name}
                  </Link>
                  {s.email ? (
                    <p className="truncate text-xs text-neutral-500">{s.email}</p>
                  ) : null}
                </div>
              </div>
            ),
          },
          {
            key: "course",
            header: "Course",
            sortValue: (s) => s.courseName ?? "",
            render: (s) => (
              <span className="text-sm text-neutral-600">{s.courseName ?? "—"}</span>
            ),
          },
          {
            key: "attendance",
            header: "Attendance",
            sortValue: (s) => s.attendancePct,
            render: (s) => <MiniPct value={s.attendancePct} />,
            className: "w-32",
          },
          {
            key: "assignment",
            header: "Assignments",
            sortValue: (s) => s.assignmentPct,
            render: (s) => <MiniPct value={s.assignmentPct} />,
            className: "w-40",
          },
          {
            key: "overdue",
            header: "Overdue",
            sortValue: (s) => s.overdueCount,
            render: (s) =>
              s.overdueCount > 0 ? (
                <Badge variant="red">{s.overdueCount} overdue</Badge>
              ) : (
                <span className="text-sm text-neutral-400">0</span>
              ),
          },
        ]}
      />
    </section>
  );
};

function MiniPct({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <ProgressBar
        value={value}
        tone={value < 50 ? "danger" : value < 70 ? "warning" : "success"}
        className="w-16"
        aria-label={`${value}%`}
      />
      <span className="text-sm tabular-nums text-neutral-600">{value}%</span>
    </div>
  );
}