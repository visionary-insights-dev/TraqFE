"use client";

import { useState } from "react";
import { CalendarClock, CalendarPlus, UserRoundCheck, WifiOff } from "lucide-react";
import {
  useCreateMeeting,
  useMeetings,
  useMentorCourses,
  useMentorScholars,
  useSaveAttendance,
  useConnectivity,
  useSocketEvents,
} from "@/hooks";
import { queryKeys } from "@/hooks/keys";
import { Card, CardContent, EmptyState, ErrorState } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";
import { AttendanceRosterModal } from "./AttendanceRosterModal";
import { CreateMeetingModal } from "./CreateMeetingModal";
import type { Meeting } from "@/lib/types";

export const AttendanceView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useMeetings();
  const { data: courses = [] } = useMentorCourses();
  const { data: scholars = [] } = useMentorScholars();
  const createMeetingMutation = useCreateMeeting();
  const saveAttendanceMutation = useSaveAttendance();
  const [createOpen, setCreateOpen] = useState(false);
  const [rosterMeeting, setRosterMeeting] = useState<Meeting | null>(null);

  useSocketEvents(["analytics.course.updated"], {
    invalidateKeys: [queryKeys.meetings],
  });

  const handleCreate = async (input: {
    title: string;
    startsAt: string;
    courseId?: string;
  }) => {
    await createMeetingMutation.mutateAsync(input);
    setCreateOpen(false);
  };

  const handleSaveAttendance = async (
    meetingId: string,
    records: Array<{ scholarId: string; attendance: "PRESENT" | "ABSENT" | "EXCUSED" }>
  ) => {
    await saveAttendanceMutation.mutateAsync({ meetingId, records });
    setRosterMeeting(null);
  };

  if (isLoading) {
    return <AttendanceSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Header onCreate={() => setCreateOpen(true)} />
        <ErrorState
          title="Could not load meetings"
          message="Something went wrong while loading your meetings. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header onCreate={() => setCreateOpen(true)} />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. You can&apos;t save attendance until you
          reconnect.
        </div>
      ) : null}

      {data && data.length === 0 ? (
        <EmptyState
          icon={<CalendarClock className="h-7 w-7" aria-hidden="true" />}
          title="No meetings yet"
          description="Create your first meeting to start tracking attendance."
        />
      ) : (
        <ul className="space-y-4">
          {data?.map((meeting) => (
            <li key={meeting.id}>
              <Card className="glass-card">
                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-100 to-brand-200 text-brand-800">
                      <UserRoundCheck className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900">
                        {meeting.title}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-600">
                        <CalendarClock
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                        {formatDateTime(meeting.startsAt)}
                        {meeting.courseName
                          ? ` · ${meeting.courseName}`
                          : null}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRosterMeeting(meeting)}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    Mark Attendance
                  </button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <CreateMeetingModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
        courses={courses}
        isSubmitting={createMeetingMutation.isPending}
        error={
          createMeetingMutation.isError
            ? "Couldn't create the meeting. Please try again."
            : null
        }
      />

      <AttendanceRosterModal
        meeting={rosterMeeting}
        scholars={scholars}
        open={rosterMeeting !== null}
        onClose={() => setRosterMeeting(null)}
        onSave={handleSaveAttendance}
        isSubmitting={saveAttendanceMutation.isPending}
        error={
          saveAttendanceMutation.isError
            ? "Couldn't save attendance. Please try again."
            : null
        }
      />
    </div>
  );
};

function Header({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Meetings &amp; Attendance
        </h1>
        <p className="mt-1 text-neutral-600">
          Schedule meetings and mark attendance for your scholars.
        </p>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <CalendarPlus className="h-4 w-4" aria-hidden="true" />
        New Meeting
      </button>
    </div>
  );
}

function AttendanceSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-busy="true"
      aria-label="Loading meetings"
    >
      <div className="flex items-start justify-between">
        <div className="skeleton-shimmer h-8 w-52 rounded-lg" />
        <div className="skeleton-shimmer h-11 w-36 rounded-lg" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex items-center gap-4">
              <div className="skeleton-shimmer h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="skeleton-shimmer h-4 w-1/2 rounded-md" />
                <div className="skeleton-shimmer h-3 w-1/3 rounded-md" />
              </div>
              <div className="skeleton-shimmer h-11 w-32 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
