"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Search, WifiOff } from "lucide-react";
import Link from "next/link";
import { AdminAvatar, AdminPageHeader, DataTable, type DataTableColumn } from "@/components/admin";
import { Badge, Button, ErrorState } from "@/components/ui";
import { useAdminMentors, useConnectivity } from "@/hooks";
import type { AdminMentor, PeopleStatus } from "@/lib/types";

const STATUS_FILTERS: Array<{ value: PeopleStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "INVITED", label: "Invited" },
  { value: "SUSPENDED", label: "Suspended" },
];

export const MentorsView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useAdminMentors();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PeopleStatus | "ALL">("ALL");

  const filtered = useMemo(() => {
    const rows = data ?? [];
    const q = query.trim().toLowerCase();
    return rows.filter((m) => {
      if (status !== "ALL" && m.status !== status) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.title ?? "").toLowerCase().includes(q) ||
        m.courses.some((c) => c.name.toLowerCase().includes(q))
      );
    });
  }, [data, query, status]);

  if (isLoading) {
    return <MentorsSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Mentors"
          description="Manage mentors, their courses and scholar loads."
        />
        <ErrorState
          title="Could not load mentors"
          message="Something went wrong while loading mentors. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const columns: Array<DataTableColumn<AdminMentor>> = [
    {
      key: "name",
      header: "Mentor",
      sortValue: (m) => m.name,
      render: (m) => (
        <div className="flex items-center gap-3">
          <AdminAvatar name={m.name} avatarUrl={m.avatarUrl} />
          <div>
            <p className="font-medium text-neutral-900">{m.name}</p>
            <p className="text-xs text-neutral-500">
              {m.title ?? m.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "scholars",
      header: "Scholars",
      sortValue: (m) => m.scholarCount,
      render: (m) => (
        <span className="tabular-nums text-neutral-700">
          {m.scholarCount}
        </span>
      ),
    },
    {
      key: "courses",
      header: "Courses",
      sortValue: (m) => m.courseCount,
      render: (m) => (
        <span className="text-neutral-600">
          {m.courses.map((c) => c.name).join(", ") || "None"}
        </span>
      ),
    },
    {
      key: "load",
      header: "Load",
      sortValue: (m) => m.scholarCount,
      render: (m) => (
        <span
          className={`text-xs font-medium ${
            m.scholarCount > 15 ? "text-danger-dark" : "text-neutral-600"
          }`}
        >
          {m.scholarCount > 15 ? "High load" : "Healthy"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (m) => m.status,
      render: (m) => {
        if (m.status === "ACTIVE") return <Badge variant="green">Active</Badge>;
        if (m.status === "INVITED") return <Badge variant="amber">Invited</Badge>;
        return <Badge variant="neutral">Suspended</Badge>;
      },
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (m) => (
        <Link
          href={`/admin/mentors/${m.id}`}
          aria-label={`View ${m.name}'s profile`}
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
        title="Mentors"
        description="Manage mentors, their courses and scholar loads."
        actions={
          <Link href="/admin/invitations?role=MENTOR">
            <Button>Invite mentor</Button>
          </Link>
        }
      />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Mentor data may not be up to date.
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
            placeholder="Search by name, email, title or course"
            aria-label="Search mentors"
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

      <DataTable<AdminMentor>
        caption="Mentors"
        rows={filtered}
        rowKey={(m) => m.id}
        columns={columns}
        emptyTitle={status === "ALL" ? "No mentors yet" : `No ${status.toLowerCase()} mentors`}
        emptyDescription="Invite mentors to start pairing them with scholars."
      />
    </div>
  );
};

function MentorsSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading mentors">
      <div className="space-y-2">
        <div className="skeleton-shimmer h-8 w-32 rounded-lg" />
        <div className="skeleton-shimmer h-4 w-64 rounded" />
      </div>
      <div className="space-y-px overflow-hidden rounded-xl border border-white/60 bg-white/80 shadow-sm">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-white/60 px-4 py-4">
            <div className="skeleton-shimmer h-9 w-9 rounded-full" />
            <div className="skeleton-shimmer h-4 w-48 rounded" />
            <div className="skeleton-shimmer h-4 w-16 rounded" />
            <div className="skeleton-shimmer h-4 w-32 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}