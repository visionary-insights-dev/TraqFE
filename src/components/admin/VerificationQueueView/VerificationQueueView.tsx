"use client";

import { ArrowRight, WifiOff } from "lucide-react";
import Link from "next/link";
import { AdminAvatar, AdminPageHeader, DataTable, type DataTableColumn } from "@/components/admin";
import { Badge, Button, ErrorState } from "@/components/ui";
import { useAdminVerificationQueue, useConnectivity } from "@/hooks";
import { relativeTime } from "@/lib/utils";
import type { VerificationItem } from "@/lib/types";

export const VerificationQueueView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useAdminVerificationQueue();

  if (isLoading) {
    return <QueueSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Verification queue"
          description="Review scholar submissions waiting for approval."
        />
        <ErrorState
          title="Could not load the queue"
          message="Something went wrong while loading submissions. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const items = data ?? [];

  const columns: Array<DataTableColumn<VerificationItem>> = [
    {
      key: "assignment",
      header: "Assignment",
      sortValue: (v) => v.assignmentTitle,
      render: (v) => (
        <p className="font-medium text-neutral-900">{v.assignmentTitle}</p>
      ),
    },
    {
      key: "scholar",
      header: "Scholar",
      sortValue: (v) => v.scholarName,
      render: (v) => (
        <div className="flex items-center gap-3">
          <AdminAvatar name={v.scholarName} />
          <div>
            <p className="font-medium text-neutral-900">{v.scholarName}</p>
            {v.courseName ? (
              <p className="text-xs text-neutral-500">{v.courseName}</p>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      key: "submitted",
      header: "Submitted",
      sortValue: (v) => v.submittedAt,
      render: (v) => (
        <span className="text-neutral-600">{relativeTime(v.submittedAt)}</span>
      ),
    },
    {
      key: "late",
      header: "",
      render: (v) =>
        v.late ? <Badge variant="amber">Late</Badge> : <Badge variant="green">On time</Badge>,
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (v) => (
        <Link
          href={`/admin/assignments/${v.assignmentId}/submissions/${v.id}`}
          aria-label={`Review ${v.assignmentTitle}`}
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
        title="Verification queue"
        description="Review scholar submissions waiting for approval."
        actions={
          items.length > 0 ? (
            <Badge variant="amber">{items.length} awaiting review</Badge>
          ) : null
        }
      />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Actions are disabled.
        </div>
      ) : null}

      <DataTable<VerificationItem>
        caption="Pending verification submissions"
        rows={items}
        rowKey={(v) => v.id}
        columns={columns}
        emptyTitle="Queue is clear"
        emptyDescription="There are no submissions waiting for review."
        emptyAction={
          <Link href="/admin/assignments" className="inline-flex">
            <Button size="sm" variant="outline">
              Back to assignments
            </Button>
          </Link>
        }
      />
    </div>
  );
};

function QueueSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading verification queue">
      <div className="space-y-2">
        <div className="skeleton-shimmer h-8 w-56 rounded-lg" />
        <div className="skeleton-shimmer h-4 w-80 rounded" />
      </div>
      <div className="space-y-px overflow-hidden rounded-xl border border-white/60 bg-white/80 shadow-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-white/60 px-4 py-4">
            <div className="skeleton-shimmer h-4 w-44 rounded" />
            <div className="skeleton-shimmer h-9 w-9 rounded-full" />
            <div className="skeleton-shimmer h-4 w-24 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}