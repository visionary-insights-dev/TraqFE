"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminPageHeader, DataTable, type DataTableColumn } from "@/components/admin";
import { Badge, ErrorState, LoadingSpinner } from "@/components/ui";
import { useAttendanceHistory } from "@/hooks";
import { relativeTime } from "@/lib/utils";
import type { AttendanceHistoryEntry } from "@/lib/types";

const ACTION_LABELS: Record<string, { label: string; variant: "green" | "red" | "amber" | "blue" }> = {
  MARKED_PRESENT: { label: "Marked present", variant: "green" },
  MARKED_ABSENT: { label: "Marked absent", variant: "red" },
  MARKED_EXCUSED: { label: "Marked excused", variant: "amber" },
  MEETING_SETTLED: { label: "Meeting settled", variant: "blue" },
};

export const AttendanceHistoryView = () => {
  const params = useParams<{ meetingId: string }>();
  const { data, isLoading, isError, refetch } = useAttendanceHistory(params.meetingId);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner label="Loading history..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Attendance history" description="Every change made to a roster, who made it, and when." />
        <ErrorState
          title="Could not load history"
          message="Something went wrong while loading history. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const entries = data ?? [];

  const columns: Array<DataTableColumn<AttendanceHistoryEntry>> = [
    {
      key: "who",
      header: "Scholar",
      sortValue: (e) => e.scholarName ?? "",
      render: (e) => (
        <span className="text-neutral-700">{e.scholarName ?? "—"}</span>
      ),
    },
    {
      key: "action",
      header: "Action",
      sortValue: (e) => e.action,
      render: (e) => {
        const config = ACTION_LABELS[e.action];
        if (config) return <Badge variant={config.variant}>{config.label}</Badge>;
        return <span className="text-neutral-600">{e.action}</span>;
      },
    },
    {
      key: "change",
      header: "Change",
      sortValue: (e) => e.changedFrom ?? e.changedTo ?? "",
      render: (e) => (
        <span className="text-neutral-600">
          {e.changedFrom ? (
            <>
              {e.changedFrom}
              <span className="mx-1 text-neutral-400">→</span>
            </>
          ) : null}
          {e.changedTo ?? "—"}
        </span>
      ),
    },
    {
      key: "by",
      header: "Changed by",
      sortValue: (e) => e.changedBy,
      render: (e) => <span className="text-neutral-600">{e.changedBy}</span>,
    },
    {
      key: "at",
      header: "When",
      sortValue: (e) => e.at,
      render: (e) => <span className="text-neutral-600">{relativeTime(e.at)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/attendance/${params.meetingId}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to roster
      </Link>

      <AdminPageHeader
        title="Attendance history"
        description="Every change made to this roster, who made it, and when."
      />

      <DataTable<AttendanceHistoryEntry>
        caption="Attendance history"
        rows={entries}
        rowKey={(e) => e.id}
        columns={columns}
        emptyTitle="No activity yet"
        emptyDescription="Changes to this roster will appear here."
      />
    </div>
  );
};