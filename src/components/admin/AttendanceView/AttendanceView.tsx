"use client";

import { ArrowRight, WifiOff } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader, DataTable, type DataTableColumn } from "@/components/admin";
import { Button, ErrorState } from "@/components/ui";
import { useAttendanceOverview, useConnectivity } from "@/hooks";
import { formatDateTime } from "@/lib/utils";
import type { AttendanceMeetingSummary } from "@/lib/types";

export const AttendanceView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useAttendanceOverview();

  if (isLoading) {
    return <AttendanceSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Attendance"
          description="Compare attendance rates across scheduled meetings."
        />
        <ErrorState
          title="Could not load attendance"
          message="Something went wrong while loading attendance. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const meetings = data ?? [];

  const rateTone = (rate: number) => {
    if (rate >= 75) return "text-success-dark";
    if (rate >= 50) return "text-warning-dark";
    return "text-danger-dark";
  };

  const columns: Array<DataTableColumn<AttendanceMeetingSummary>> = [
    {
      key: "title",
      header: "Meeting",
      sortValue: (m) => m.title,
      render: (m) => (
        <div>
          <p className="font-medium text-neutral-900">{m.title}</p>
          {m.courseName ? (
            <p className="mt-0.5 text-xs text-neutral-500">{m.courseName}</p>
          ) : null}
        </div>
      ),
    },
    {
      key: "starts",
      header: "Starts",
      sortValue: (m) => m.startsAt,
      render: (m) => (
        <span className="text-neutral-600">{formatDateTime(m.startsAt)}</span>
      ),
    },
    {
      key: "present",
      header: "Present",
      sortValue: (m) => m.total,
      render: (m) => (
        <span className="tabular-nums text-neutral-700">
          {m.present}
          <span className="text-neutral-400"> / {m.total}</span>
        </span>
      ),
    },
    {
      key: "absent",
      header: "Absent",
      sortValue: (m) => m.absent,
      render: (m) => (
        <span className="tabular-nums text-neutral-700">{m.absent}</span>
      ),
    },
    {
      key: "excused",
      header: "Excused",
      sortValue: (m) => m.excused,
      render: (m) => (
        <span className="tabular-nums text-neutral-700">{m.excused}</span>
      ),
    },
    {
      key: "rate",
      header: "Rate",
      sortValue: (m) => m.rate,
      render: (m) => (
        <span className={`tabular-nums font-semibold ${rateTone(m.rate)}`}>
          {Math.round(m.rate)}%
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (m) => (
        <Link
          href={`/admin/attendance/${m.meetingId}`}
          aria-label={`Open ${m.title} attendance`}
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
        title="Attendance"
        description="Compare attendance rates across scheduled meetings."
        actions={
          <Link href="/admin/meetings">
            <Button variant="outline">Manage meetings</Button>
          </Link>
        }
      />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Attendance data may not be up to date.
        </div>
      ) : null}

      <DataTable<AttendanceMeetingSummary>
        caption="Attendance by meeting"
        rows={meetings}
        rowKey={(m) => m.meetingId}
        columns={columns}
        emptyTitle="No meetings yet"
        emptyDescription="Schedule a meeting to start recording attendance."
        emptyAction={
          <Link href="/admin/meetings" className="inline-flex">
            <Button size="sm">Schedule a meeting</Button>
          </Link>
        }
      />
    </div>
  );
};

function AttendanceSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading attendance">
      <div className="space-y-2">
        <div className="skeleton-shimmer h-8 w-40 rounded-lg" />
        <div className="skeleton-shimmer h-4 w-72 rounded" />
      </div>
      <div className="space-y-px overflow-hidden rounded-xl border border-white/60 bg-white/80 shadow-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-white/60 px-4 py-4">
            <div className="skeleton-shimmer h-4 w-44 rounded" />
            <div className="skeleton-shimmer h-4 w-32 rounded" />
            <div className="skeleton-shimmer h-4 w-16 rounded" />
            <div className="skeleton-shimmer h-4 w-12 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}