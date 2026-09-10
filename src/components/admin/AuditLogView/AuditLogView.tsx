"use client";

import { useState } from "react";
import { WifiOff } from "lucide-react";
import { AdminPageHeader } from "@/components/admin";
import { Badge, Button, ErrorState } from "@/components/ui";
import { useAuditLogs, useConnectivity } from "@/hooks";
import { relativeTime } from "@/lib/utils";

const PAGE_SIZE = 25;

const ENTITY_LABELS: Record<string, string> = {
  PROGRAM: "Program",
  COURSE: "Course",
  USER: "User",
  ASSIGNMENT: "Assignment",
  SUBMISSION: "Submission",
  MEETING: "Meeting",
  ATTENDANCE: "Attendance",
  INVITATION: "Invitation",
  SETTINGS: "Settings",
  REPORT: "Report",
};

export const AuditLogView = () => {
  const isOnline = useConnectivity();
  const [page, setPage] = useState(1);
  const [entityType, setEntityType] = useState("ALL");
  const { data, isLoading, isError, refetch } = useAuditLogs({
    page,
    limit: PAGE_SIZE,
    filters: entityType === "ALL" ? undefined : { entityType },
  });

  if (isLoading && !data) {
    return <AuditSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Audit log"
          description="A record of every significant action in your organization."
        />
        <ErrorState
          title="Could not load the audit log"
          message="Something went wrong while loading log entries. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const entries = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Audit log"
        description="A record of every significant action in your organization."
      />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. The audit log may not be up to date.
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Filter by entity" className="flex flex-wrap gap-1 rounded-lg bg-neutral-100 p-1">
          {["ALL", "PROGRAM", "COURSE", "USER", "ASSIGNMENT", "MEETING", "ATTENDANCE", "SETTINGS", "INVITATION", "REPORT"].map(
            (value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setEntityType(value);
                  setPage(1);
                }}
                aria-pressed={entityType === value}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  entityType === value
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {value === "ALL" ? "All" : ENTITY_LABELS[value] ?? value}
              </button>
            )
          )}
        </div>
      </div>

      <section className="glass-card rounded-2xl" aria-label="Audit entries">
        {entries.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-neutral-500">
            No audit entries match this filter.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {entries.map((e) => (
              <li key={e.id} className="flex flex-wrap items-start gap-4 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-900">
                    {e.action}
                    {e.entityLabel ? (
                      <span className="text-neutral-500"> · {e.entityLabel}</span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {e.actorName ?? "System"}
                    {e.actorRole ? ` (${e.actorRole})` : ""} · {relativeTime(e.at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {e.entityType ? (
                    <Badge variant="neutral">{ENTITY_LABELS[e.entityType] ?? e.entityType}</Badge>
                  ) : null}
                  {e.detail ? (
                    <span
                      className="max-w-xs truncate text-xs text-neutral-400"
                      title={e.detail}
                    >
                      {e.detail}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Pagination
        page={page}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={(next) => setPage(next)}
      />
    </div>
  );
};

function Pagination({
  page,
  totalPages,
  isLoading,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-neutral-500">
        Page <span className="font-medium text-neutral-900">{page}</span> of{" "}
        <span className="font-medium text-neutral-900">{totalPages}</span>
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1 || isLoading}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages || isLoading}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function AuditSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading audit log">
      <div className="space-y-2">
        <div className="skeleton-shimmer h-8 w-32 rounded-lg" />
        <div className="skeleton-shimmer h-4 w-80 rounded" />
      </div>
      <div className="space-y-px overflow-hidden rounded-xl border border-white/60 bg-white/80 shadow-sm">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-white/60 px-4 py-4">
            <div className="skeleton-shimmer h-4 w-64 rounded" />
            <div className="skeleton-shimmer h-4 w-24 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}