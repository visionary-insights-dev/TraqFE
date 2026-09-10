"use client";

import { useState } from "react";
import { Pencil, Plus, WifiOff } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader, DataTable, type DataTableColumn } from "@/components/admin";
import { Badge, Button, ErrorState } from "@/components/ui";
import {
  useAdminArchiveMeeting,
  useAdminCoursesForSelect,
  useAdminCreateMeeting,
  useAdminMeetings,
  useAdminUpdateMeeting,
  useConnectivity,
} from "@/hooks";
import { formatDateTime } from "@/lib/utils";
import type { Meeting } from "@/lib/types";
import { ArchiveMeetingModal } from "./ArchiveMeetingModal";
import { MeetingFormModal } from "./MeetingFormModal";

export const MeetingsView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useAdminMeetings();
  const { data: courses } = useAdminCoursesForSelect();

  const createMutation = useAdminCreateMeeting();
  const updateMutation = useAdminUpdateMeeting();
  const archiveMutation = useAdminArchiveMeeting();

  const [formOpen, setFormOpen] = useState(false);
  const [initial, setInitial] = useState<Meeting | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<Meeting | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  const handleFormSubmit = async (input: {
    title: string;
    startsAt: string;
    courseId?: string;
  }) => {
    setFormError(null);
    try {
      if (initial) {
        await updateMutation.mutateAsync({ meetingId: initial.id, input });
      } else {
        await createMutation.mutateAsync(input);
      }
      setFormOpen(false);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Could not save the meeting."
      );
    }
  };

  const handleArchive = async () => {
    if (!archiveTarget) return;
    setArchiveError(null);
    try {
      await archiveMutation.mutateAsync(archiveTarget.id);
      setArchiveTarget(null);
    } catch (err) {
      setArchiveError(
        err instanceof Error ? err.message : "Could not archive the meeting."
      );
    }
  };

  if (isLoading) {
    return <MeetingsSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Meetings"
          description="Schedule meetings and track attendance."
        />
        <ErrorState
          title="Could not load meetings"
          message="Something went wrong while loading meetings. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const meetings = data ?? [];

  const startAttending = (m: Meeting) => {
    const start = new Date(m.startsAt).getTime();
    const now = Date.now();
    return start <= now + 30 * 60_000;
  };

  const columns: Array<DataTableColumn<Meeting>> = [
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
          {m.attendeeCount !== undefined ? (
            <p className="mt-0.5 text-xs tabular-nums text-neutral-500">
              {m.attendeeCount} attending
            </p>
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
      key: "status",
      header: "Status",
      sortValue: (m) => (startAttending(m) ? 1 : 0),
      render: (m) =>
        startAttending(m) ? (
          <Badge variant="blue">Open for sign-in</Badge>
        ) : (
          <Badge variant="neutral">Scheduled</Badge>
        ),
    },
    {
      key: "attendance",
      header: "",
      render: (m) => (
        <Link
          href={`/admin/attendance/${m.id}`}
          className="text-xs font-semibold text-brand-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
        >
          Attendance
        </Link>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (m) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => {
              setInitial(m);
              setFormError(null);
              setFormOpen(true);
            }}
            aria-label={`Edit ${m.title}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              setArchiveError(null);
              setArchiveTarget(m);
            }}
            className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-danger-light hover:text-danger-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
          >
            Archive
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Meetings"
        description="Schedule meetings and track attendance."
        actions={
          <Button
            onClick={() => {
              setInitial(null);
              setFormError(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Schedule meeting
          </Button>
        }
      />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Meetings data may not be up to date.
        </div>
      ) : null}

      <DataTable<Meeting>
        caption="Meetings"
        rows={meetings}
        rowKey={(m) => m.id}
        columns={columns}
        emptyTitle="No meetings scheduled"
        emptyDescription="Schedule a meeting to start taking attendance."
        emptyAction={
          <Button
            size="sm"
            onClick={() => {
              setInitial(null);
              setFormError(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Schedule meeting
          </Button>
        }
      />

      <MeetingFormModal
        key={initial?.id ?? "new"}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        courses={(courses ?? []).map((c) => ({ id: c.id, name: c.name }))}
        initial={initial}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        error={formError}
        onSubmit={handleFormSubmit}
      />

      <ArchiveMeetingModal
        meeting={archiveTarget}
        open={archiveTarget !== null}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleArchive}
        isSubmitting={archiveMutation.isPending}
        error={archiveError}
      />
    </div>
  );
};

function MeetingsSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading meetings">
      <div className="space-y-2">
        <div className="skeleton-shimmer h-8 w-32 rounded-lg" />
        <div className="skeleton-shimmer h-4 w-72 rounded" />
      </div>
      <div className="space-y-px overflow-hidden rounded-xl border border-white/60 bg-white/80 shadow-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-white/60 px-4 py-4">
            <div className="skeleton-shimmer h-4 w-44 rounded" />
            <div className="skeleton-shimmer h-4 w-36 rounded" />
            <div className="skeleton-shimmer h-5 w-24 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}