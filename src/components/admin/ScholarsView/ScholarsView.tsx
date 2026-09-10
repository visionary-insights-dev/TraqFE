"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Search, Upload, WifiOff } from "lucide-react";
import Link from "next/link";
import { AdminAvatar, AdminPageHeader, DataTable, type DataTableColumn } from "@/components/admin";
import { Badge, Button, ErrorState } from "@/components/ui";
import { ProgressBar } from "@/components/scholar/shared";
import { useAdminScholars, useConnectivity } from "@/hooks";
import type { AdminScholar, PeopleStatus } from "@/lib/types";

const STATUS_FILTERS: Array<{ value: PeopleStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "INVITED", label: "Invited" },
  { value: "SUSPENDED", label: "Suspended" },
];

export const ScholarsView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useAdminScholars();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PeopleStatus | "ALL">("ALL");

  const filtered = useMemo(() => {
    const rows = data ?? [];
    const q = query.trim().toLowerCase();
    return rows.filter((s) => {
      if (status !== "ALL" && s.status !== status) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.programName ?? "").toLowerCase().includes(q) ||
        (s.courseName ?? "").toLowerCase().includes(q)
      );
    });
  }, [data, query, status]);

  if (isLoading) {
    return <ScholarsSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Scholars"
          description="Manage every scholar in your organization."
        />
        <ErrorState
          title="Could not load scholars"
          message="Something went wrong while loading scholars. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const columns: Array<DataTableColumn<AdminScholar>> = [
    {
      key: "name",
      header: "Scholar",
      sortValue: (s) => s.name,
      render: (s) => (
        <div className="flex items-center gap-3">
          <AdminAvatar name={s.name} avatarUrl={s.avatarUrl} />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-neutral-900">{s.name}</p>
              {s.atRisk ? (
                <Badge variant="red">At risk</Badge>
              ) : null}
            </div>
            <p className="text-xs text-neutral-500">{s.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "program",
      header: "Program",
      sortValue: (s) => s.programName ?? "",
      render: (s) => (
        <span className="text-neutral-600">{s.programName ?? "—"}</span>
      ),
    },
    {
      key: "course",
      header: "Course",
      sortValue: (s) => s.courseName ?? "",
      render: (s) => (
        <span className="text-neutral-600">{s.courseName ?? "—"}</span>
      ),
    },
    {
      key: "mentor",
      header: "Mentor",
      sortValue: (s) => s.mentorName ?? "",
      render: (s) => (
        <span className="text-neutral-600">{s.mentorName ?? "Unassigned"}</span>
      ),
    },
    {
      key: "progress",
      header: "Progress",
      sortValue: (s) => s.progress.overall,
      render: (s) => (
        <div className="w-36">
          <ProgressBar
            value={s.progress.overall}
            aria-label={`${s.name} overall progress`}
            className="h-1.5"
          />
          <p className="mt-1 text-xs text-neutral-500">
            {Math.round(s.progress.overall)}% · A {Math.round(s.progress.assignmentPct)}% / P{" "}
            {Math.round(s.progress.attendancePct)}%
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (s) => s.status,
      render: (s) => {
        if (s.status === "ACTIVE") return <Badge variant="green">Active</Badge>;
        if (s.status === "INVITED") return <Badge variant="amber">Invited</Badge>;
        return <Badge variant="neutral">Suspended</Badge>;
      },
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (s) => (
        <Link
          href={`/admin/scholars/${s.id}`}
          aria-label={`View ${s.name}'s profile`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Scholars"
        description="Manage every scholar in your organization."
        actions={
          <Link href="/admin/scholars/import">
            <Button>
              <Upload className="h-4 w-4" aria-hidden="true" />
              Import CSV
            </Button>
          </Link>
        }
      />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Scholar data may not be up to date.
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-64 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, program or course"
            aria-label="Search scholars"
            className="h-10 w-full rounded-lg border border-neutral-300 bg-white pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </div>
        <div role="group" aria-label="Filter by status" className="flex gap-1 rounded-lg bg-neutral-100 p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatus(f.value)}
              aria-pressed={status === f.value}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                status === f.value
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <DataTable<AdminScholar>
        caption="Scholars"
        rows={filtered}
        rowKey={(s) => s.id}
        columns={columns}
        emptyTitle={status === "ALL" ? "No scholars yet" : `No ${status.toLowerCase()} scholars`}
        emptyDescription="Invite or import scholars to get started."
      />
    </div>
  );
};

function ScholarsSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading scholars">
      <div className="space-y-2">
        <div className="skeleton-shimmer h-8 w-32 rounded-lg" />
        <div className="skeleton-shimmer h-4 w-64 rounded" />
      </div>
      <div className="space-y-px overflow-hidden rounded-xl border border-white/60 bg-white/80 shadow-sm">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-white/60 px-4 py-4">
            <div className="skeleton-shimmer h-9 w-9 rounded-full" />
            <div className="skeleton-shimmer h-4 w-48 rounded" />
            <div className="skeleton-shimmer h-4 w-32 rounded" />
            <div className="skeleton-shimmer h-2 w-36 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}