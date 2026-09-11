"use client";

import { WifiOff } from "lucide-react";
import { useScholarDashboard } from "@/hooks";
import { useSocketEvents } from "@/hooks/useSocketEvents";
import { useConnectivity } from "@/hooks/useConnectivity";
import { queryKeys } from "@/hooks/keys";
import { ProgramProgressCard } from "./ProgramProgressCard";
import { UpcomingMeetingCard } from "./UpcomingMeetingCard";
import { ActiveTasksList } from "./ActiveTasksList";
import { MentorCard } from "./MentorCard";
import { AttendanceSummary } from "./AttendanceSummary";

export const DashboardView = () => {
  const { data, isLoading, error, refetch } = useScholarDashboard();
  const isOnline = useConnectivity();

  useSocketEvents(["analytics.course.updated"], {
    invalidateKeys: [queryKeys.scholarDashboard],
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <div
          role="alert"
          className="glass-card flex flex-col items-center justify-center gap-3 rounded-2xl px-6 py-12 text-center"
        >
          <p className="text-base font-semibold text-neutral-900 dark:text-white">
            Could not load dashboard
          </p>
          <p className="text-sm text-neutral-600 dark:text-slate-300">
            Something went wrong. Please try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-200 bg-white/70 px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-white/20"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <div className="glass-card glass-edge flex flex-col items-center justify-center gap-3 rounded-2xl px-6 py-12 text-center">
          <p className="text-base font-semibold text-neutral-900 dark:text-white">
            No dashboard data yet
          </p>
          <p className="text-sm text-neutral-500 dark:text-slate-400">
            Your program data will appear here once your mentor sets things up.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader isOnline={isOnline} />

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="dash-enter dash-1">
          <ProgramProgressCard progress={data.progress} />
        </div>
        <div className="dash-enter dash-2">
          <AttendanceSummary attendance={data.attendance} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {data.upcomingMeeting ? (
          <div className="dash-enter dash-3">
            <UpcomingMeetingCard meeting={data.upcomingMeeting} />
          </div>
        ) : null}
        <div className="dash-enter dash-4">
          <MentorCard mentor={data.mentor} />
        </div>
      </div>

      <div className="dash-enter dash-5">
        <ActiveTasksList tasks={data.activeTasks} />
      </div>
    </div>
  );
};

function PageHeader({ isOnline }: { isOnline?: boolean }) {
  return (
    <header className="dash-enter relative overflow-hidden pt-1">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-400/10 via-violet-500/10 to-amber-400/10 blur-3xl"
      />

      {isOnline === false ? (
        <div
          role="status"
          className="glass-surface relative flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm backdrop-blur-md dark:text-amber-300"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Data may not be up to date.
        </div>
      ) : null}

      <div className="relative flex items-end justify-between gap-4 pt-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-slate-400">
            <span
              aria-hidden="true"
              className="ember-pulse h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_2px_rgba(245,158,11,0.5)]"
            />
            Scholar · Track
          </p>
          <h1 className="mt-1 bg-gradient-to-br from-neutral-900 via-neutral-800 to-brand-700 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-white dark:to-slate-400">
            Home
          </h1>
          <p className="mt-0.5 text-sm text-neutral-600 dark:text-slate-400">
            Here&apos;s your momentum at a glance.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
          Scholar
        </span>
      </div>
    </header>
  );
}

function DashboardSkeleton() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="Loading dashboard"
      role="status"
    >
      <div className="space-y-2">
        <div className="skeleton-shimmer h-3 w-28 rounded-md" />
        <div className="skeleton-shimmer h-8 w-32 rounded-lg" />
        <div className="skeleton-shimmer h-3 w-48 rounded-md" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-5">
          <div className="skeleton-shimmer mb-5 h-3 w-28 rounded-md" />
          <div className="flex items-center gap-5">
            <div className="skeleton-shimmer h-24 w-24 rounded-full sm:h-28 sm:w-28" />
            <div className="flex-1 space-y-3">
              <div className="skeleton-shimmer h-4 w-full rounded-md" />
              <div className="skeleton-shimmer h-2 w-4/5 rounded-full" />
              <div className="skeleton-shimmer h-4 w-full rounded-md" />
              <div className="skeleton-shimmer h-2 w-3/5 rounded-full" />
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="skeleton-shimmer mb-5 h-3 w-24 rounded-md" />
          <div className="skeleton-shimmer mb-4 h-9 w-20 rounded-md" />
          <div className="skeleton-shimmer h-2.5 w-full rounded-full" />
          <div className="skeleton-shimmer mt-4 h-9 w-full rounded-xl" />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-5">
          <div className="skeleton-shimmer mb-4 h-3 w-32 rounded-md" />
          <div className="flex items-center gap-3">
            <div className="skeleton-shimmer h-11 w-11 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="skeleton-shimmer h-4 w-2/3 rounded-md" />
              <div className="skeleton-shimmer h-3 w-full rounded-md" />
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="skeleton-shimmer mb-4 h-3 w-24 rounded-md" />
          <div className="flex items-center gap-3">
            <div className="skeleton-shimmer h-14 w-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton-shimmer h-4 w-1/2 rounded-md" />
              <div className="skeleton-shimmer h-3 w-2/3 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl">
        <div className="border-b border-white/30 px-5 py-4 dark:border-white/5">
          <div className="skeleton-shimmer h-4 w-24 rounded-md" />
        </div>
        <div className="divide-y divide-white/30 dark:divide-white/5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between gap-3 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="skeleton-shimmer h-2 w-2 rounded-full" />
                <div className="space-y-2">
                  <div className="skeleton-shimmer h-4 w-48 rounded-md" />
                  <div className="skeleton-shimmer h-3 w-36 rounded-md" />
                </div>
              </div>
              <div className="skeleton-shimmer h-6 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}