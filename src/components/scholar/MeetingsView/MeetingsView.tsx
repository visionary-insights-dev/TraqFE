"use client";

import { CalendarCheck2, CalendarDays, Clock, WifiOff, Users } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, EmptyState, ErrorState } from "@/components/ui";
import { ScholarPageHeader } from "@/components/scholar/shared";
import { useScholarMeetings, useConnectivity } from "@/hooks";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { UpcomingMeeting } from "@/lib/types";

export const MeetingsView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useScholarMeetings();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  if (isLoading) return <MeetingsSkeleton />;

  if (isError) {
    return (
      <div className="space-y-6">
        <Header />
        <ErrorState
          title="Could not load meetings"
          message="Something went wrong while loading your meetings. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  const meetings = data ?? [];
  const upcoming = meetings.filter((m) => !isPastMeeting(m));
  const past = meetings.filter((m) => isPastMeeting(m));
  const visible = tab === "upcoming" ? upcoming : past;

  return (
    <div className="space-y-6">
      <Header />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm dark:text-amber-300"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Meeting times may not be up to date.
        </div>
      ) : null}

      <div
        role="group"
        aria-label="Filter meetings"
        className="inline-flex rounded-2xl border border-white/40 bg-white/60 p-1 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5"
      >
        <TabButton
          active={tab === "upcoming"}
          label={`Upcoming (${upcoming.length})`}
          onClick={() => setTab("upcoming")}
        />
        <TabButton
          active={tab === "past"}
          label={`Past (${past.length})`}
          onClick={() => setTab("past")}
        />
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck2 className="h-7 w-7" aria-hidden="true" />}
          title={tab === "upcoming" ? "No upcoming meetings" : "No past meetings"}
          description={
            tab === "upcoming"
              ? "Your mentor will schedule meetings for you to join here."
              : "Meetings you've attended will appear here."
          }
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((meeting, index) => (
            <li
              key={meeting.id}
              className={`dash-enter ${
                ["dash-1", "dash-2", "dash-3", "dash-4", "dash-5"][index % 5]
              }`}
            >
              <MeetingCard meeting={meeting} isPast={tab === "past"} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-[0.97]",
        active
          ? "ember-glow bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-md shadow-amber-500/30"
          : "text-neutral-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-white"
      )}
    >
      {label}
    </button>
  );
}

function MeetingCard({
  meeting,
  isPast,
}: {
  meeting: UpcomingMeeting;
  isPast: boolean;
}) {
  return (
    <Card className="glass-card glass-edge group relative overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/15"
      />

      <CardContent className="relative flex items-start gap-3.5">
        <div className="relative shrink-0">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 ease-out group-hover:scale-105",
              isPast
                ? "bg-neutral-100 text-neutral-400 dark:bg-slate-800 dark:text-slate-500"
                : "bg-gradient-to-br from-brand-500 via-violet-500 to-amber-400 text-white shadow-lg"
            )}
          >
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
          </div>
          {!isPast ? (
            <span className="ember-pulse absolute inset-0 -z-10 rounded-xl bg-amber-400/30 blur-md" />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-semibold",
              isPast
                ? "text-neutral-500 dark:text-slate-400"
                : "text-neutral-900 dark:text-white"
            )}
          >
            {meeting.title}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-neutral-600 dark:text-slate-400">
            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {formatDateTime(meeting.startsAt)}
            {meeting.endsAt ? ` – ${formatDateTime(meeting.endsAt)}` : ""}
          </p>
          {meeting.courseName ? (
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-slate-500">
              {meeting.courseName}
            </p>
          ) : null}
          {meeting.mentor?.name ? (
            <p className="mt-0.5 text-sm font-medium text-violet-700 dark:text-violet-300">
              with {meeting.mentor.name}
            </p>
          ) : null}
          {meeting.attendeeCount !== undefined ? (
            <p
              className={cn(
                "mt-0.5 flex items-center gap-1.5 text-sm tabular-nums",
                isPast
                  ? "text-neutral-400 dark:text-slate-500"
                  : "text-neutral-500 dark:text-slate-400"
              )}
            >
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {meeting.attendeeCount} scholar
              {meeting.attendeeCount === 1 ? "" : "s"} attending
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function Header() {
  return (
    <ScholarPageHeader
      eyebrow="Meetings"
      title="Meetings"
      subtitle="Sessions with your mentor and fellow scholars."
    />
  );
}

function isPastMeeting(meeting: UpcomingMeeting) {
  return new Date(meeting.startsAt).getTime() < Date.now();
}

function MeetingsSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-busy="true"
      aria-label="Loading meetings"
    >
      <div className="space-y-2">
        <div className="skeleton-shimmer h-3 w-28 rounded-md" />
        <div className="skeleton-shimmer h-8 w-36 rounded-lg" />
        <div className="skeleton-shimmer h-3 w-64 rounded-md" />
      </div>
      <div className="skeleton-shimmer h-11 w-64 rounded-2xl" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass-card flex items-start gap-3 rounded-2xl p-4"
          >
            <div className="skeleton-shimmer h-11 w-11 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="skeleton-shimmer h-4 w-3/4 rounded-md" />
              <div className="skeleton-shimmer h-3 w-1/2 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}