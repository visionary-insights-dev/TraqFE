"use client";

import { ArrowRight, FileCheck2, Plus, WifiOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdminPageHeader, DataTable, type DataTableColumn } from "@/components/admin";
import { Badge, Button, ErrorState } from "@/components/ui";
import { useAdminAssignments, useConnectivity } from "@/hooks";
import { formatDateTime } from "@/lib/utils";
import type { AdminAssignment } from "@/lib/types";

type PublishFilter = "ALL" | "DRAFT" | "PUBLISHED";

const PUBLISH_FILTERS: Array<{ value: PublishFilter; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "PUBLISHED", label: "Published" },
  { value: "DRAFT", label: "Drafts" },
];

export const AssignmentsView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useAdminAssignments();
  const [filter, setFilter] = useState<PublishFilter>("ALL");

  if (isLoading) {
    return <AssignmentsSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Assignments"
          description="Create, publish and review all assignments."
        />
        <ErrorState
          title="Could not load assignments"
          message="Something went wrong while loading assignments. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const filtered = (data ?? []).filter((a) => {
    if (filter === "DRAFT") return !a.published;
    if (filter === "PUBLISHED") return a.published;
    return true;
  });

  const columns: Array<DataTableColumn<AdminAssignment>> = [
    {
      key: "title",
      header: "Assignment",
      sortValue: (a) => a.title,
      render: (a) => (
        <div>
          <p className="font-medium text-neutral-900">{a.title}</p>
          {a.programName ? (
            <p className="mt-0.5 text-xs text-neutral-500">{a.programName}</p>
          ) : null}
        </div>
      ),
    },
    {
      key: "audience",
      header: "Audience",
      sortValue: (a) => a.audience,
      render: (a) => {
        if (a.audience === "COURSE") return <Badge variant="blue">Course</Badge>;
        if (a.audience === "PROGRAM") return <Badge variant="orange">Program</Badge>;
        return <Badge variant="neutral">All scholars</Badge>;
      },
    },
    {
      key: "due",
      header: "Due",
      sortValue: (a) => a.dueAt,
      render: (a) => (
        <span className="text-neutral-600">{formatDateTime(a.dueAt)}</span>
      ),
    },
    {
      key: "submissions",
      header: "Submissions",
      sortValue: (a) => a.submissionStats.submitted / Math.max(1, a.submissionStats.total),
      render: (a) => (
        <span className="tabular-nums text-neutral-700">
          {a.submissionStats.submitted}/{a.submissionStats.total || 0}
        </span>
      ),
    },
    {
      key: "pending",
      header: "Pending",
      sortValue: (a) => a.submissionStats.pending,
      render: (a) =>
        a.submissionStats.pending > 0 ? (
          <Badge variant="amber">{a.submissionStats.pending} to review</Badge>
        ) : (
          <span className="text-neutral-400">—</span>
        ),
    },
    {
      key: "published",
      header: "",
      sortValue: (a) => (a.published ? 1 : 0),
      render: (a) =>
        a.published ? (
          <Badge variant="green">Published</Badge>
        ) : (
          <Badge variant="neutral">Draft</Badge>
        ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (a) => (
        <Link
          href={`/admin/assignments/${a.id}`}
          aria-label={`Open ${a.title}`}
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
        title="Assignments"
        description="Create, publish and review all assignments."
        actions={
          <>
            <Link href="/admin/assignments/verification">
              <Button variant="outline">
                <FileCheck2 className="h-4 w-4" aria-hidden="true" />
                Verification queue
              </Button>
            </Link>
            <Link href="/admin/assignments/new">
              <Button>
                <Plus className="h-4 w-4" aria-hidden="true" />
                New assignment
              </Button>
            </Link>
          </>
        }
      />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Assignments data may not be up to date.
        </div>
      ) : null}

      <div role="group" aria-label="Filter assignments" className="flex gap-1 rounded-lg bg-neutral-100 p-1 w-fit">
        {PUBLISH_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            aria-pressed={filter === f.value}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              filter === f.value
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <DataTable<AdminAssignment>
        caption="Assignments"
        rows={filtered}
        rowKey={(a) => a.id}
        columns={columns}
        emptyTitle="No assignments"
        emptyDescription="Create your first assignment to get started."
      />
    </div>
  );
};

function AssignmentsSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading assignments">
      <div className="space-y-2">
        <div className="skeleton-shimmer h-8 w-40 rounded-lg" />
        <div className="skeleton-shimmer h-4 w-72 rounded" />
      </div>
      <div className="space-y-px overflow-hidden rounded-xl border border-white/60 bg-white/80 shadow-sm">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-white/60 px-4 py-4">
            <div className="skeleton-shimmer h-4 w-52 rounded" />
            <div className="skeleton-shimmer h-5 w-20 rounded-full" />
            <div className="skeleton-shimmer h-4 w-28 rounded" />
            <div className="skeleton-shimmer h-4 w-14 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}