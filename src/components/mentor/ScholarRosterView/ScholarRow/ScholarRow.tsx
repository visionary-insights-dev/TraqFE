import { GraduationCap, TriangleAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { ProgressBar } from "@/components/scholar/shared";
import { cn } from "@/lib/utils";
import type { ScholarRowProps } from "./types";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

export const ScholarRow = ({ scholar }: ScholarRowProps) => {
  return (
    <Card className="glass-card transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-xl">
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          {scholar.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={scholar.avatarUrl}
              alt=""
              className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-100"
            />
          ) : (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-sm font-semibold text-white">
              {initials(scholar.name)}
            </span>
          )}
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
              {scholar.name}
              {scholar.atRisk ? (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-danger-light px-2 py-0.5 text-xs font-medium text-danger-dark"
                  title="At risk"
                >
                  <TriangleAlert className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only">At risk</span>
                </span>
              ) : null}
            </p>
            {scholar.courseName ? (
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-600">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                {scholar.courseName}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-6">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between gap-2 text-xs text-neutral-600">
              <span>Overall progress</span>
              <span className="font-semibold text-neutral-900">
                {Math.round(scholar.progress.overall)}%
              </span>
            </div>
            <ProgressBar
              value={scholar.progress.overall}
              aria-label={`${scholar.name} overall progress`}
              tone={
                scholar.progress.overall >= 70
                  ? "success"
                  : scholar.atRisk
                    ? "danger"
                    : "warning"
              }
            />
            <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600">
              <div className="flex items-center gap-1">
                <dt className="sr-only">Assignments</dt>
                <dd className="rounded bg-neutral-100 px-1.5 py-0.5">
                  Assignments {Math.round(scholar.progress.assignmentPct)}%
                </dd>
              </div>
              <div className="flex items-center gap-1">
                <dt className="sr-only">Attendance</dt>
                <dd className="rounded bg-neutral-100 px-1.5 py-0.5">
                  Attendance {Math.round(scholar.progress.attendancePct)}%
                </dd>
              </div>
            </dl>
          </div>

          <span
            className={cn(
              "inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-medium",
              scholar.progress.overall >= 70
                ? "bg-success-light text-success-dark"
                : scholar.atRisk
                  ? "bg-danger-light text-danger-dark"
                  : "bg-warning-light text-warning-dark"
            )}
          >
            {scholar.progress.overall >= 70
              ? "On track"
              : scholar.atRisk
                ? "At risk"
                : "Needs attention"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
