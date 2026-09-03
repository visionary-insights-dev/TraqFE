"use client";

import { WifiOff } from "lucide-react";
import { useDashboardAnalytics } from "@/hooks/useDashboardAnalytics";
import { useSocketEvents } from "@/hooks/useSocketEvents";
import { useConnectivity } from "@/hooks/useConnectivity";
import { queryKeys } from "@/hooks/keys";
import { ProgramProgressCard } from "./ProgramProgressCard";
import { UpcomingMeetingCard } from "./UpcomingMeetingCard";
import { ActiveTasksList } from "./ActiveTasksList";
import { MentorCard } from "./MentorCard";
import { AttendanceSummary } from "./AttendanceSummary";

export const DashboardView = () => {
  const { data, isLoading, error, refetch } = useDashboardAnalytics();
  const isOnline = useConnectivity();

  useSocketEvents(["analytics.course.updated"], {
    invalidateKeys: [queryKeys.dashboardAnalytics],
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900">Home</h1>
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-3 rounded-lg border border-danger-light bg-danger-light/40 px-6 py-12 text-center"
        >
          <p className="text-base font-semibold text-neutral-900">
            Could not load dashboard
          </p>
          <p className="text-sm text-neutral-600">
            Something went wrong. Please try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-neutral-300 bg-transparent px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
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
        <h1 className="text-2xl font-bold text-neutral-900">Home</h1>
        <div className="glass-card flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
          <p className="text-base font-semibold text-neutral-800">
            No dashboard data yet
          </p>
          <p className="text-sm text-neutral-500">
            Your program data will appear here once your mentor sets things up.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Data may not be up to date.
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Home
        </h1>
        <span className="rounded-full bg-brand-600/10 px-3 py-1 text-xs font-semibold text-brand-800 ring-1 ring-brand-200">
          Scholar
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProgramProgressCard progress={data.progress} />
        <AttendanceSummary attendance={data.attendance} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {data.upcomingMeeting ? (
          <UpcomingMeetingCard meeting={data.upcomingMeeting} />
        ) : null}
        <MentorCard mentor={data.mentor} />
      </div>

      <ActiveTasksList tasks={data.activeTasks} />
    </div>
  );
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="skeleton-shimmer h-8 w-32 rounded-lg" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-5">
          <div className="skeleton-shimmer mb-4 h-5 w-40 rounded-md" />
          <div className="skeleton-shimmer mb-3 h-9 w-20 rounded-md" />
          <div className="skeleton-shimmer mb-4 h-2 w-full rounded-full" />
          <div className="space-y-2 border-t border-white/40 pt-4">
            <div className="flex justify-between">
              <div className="skeleton-shimmer h-4 w-36 rounded-md" />
              <div className="skeleton-shimmer h-4 w-10 rounded-md" />
            </div>
            <div className="flex justify-between">
              <div className="skeleton-shimmer h-4 w-32 rounded-md" />
              <div className="skeleton-shimmer h-4 w-10 rounded-md" />
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="skeleton-shimmer mb-4 h-5 w-28 rounded-md" />
          <div className="skeleton-shimmer mb-3 h-9 w-20 rounded-md" />
          <div className="skeleton-shimmer mb-3 h-2 w-full rounded-full" />
          <div className="skeleton-shimmer h-4 w-48 rounded-md" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-5">
          <div className="skeleton-shimmer mb-4 h-5 w-36 rounded-md" />
          <div className="flex gap-3">
            <div className="skeleton-shimmer h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <div className="skeleton-shimmer h-5 w-40 rounded-md" />
              <div className="skeleton-shimmer h-4 w-52 rounded-md" />
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="skeleton-shimmer mb-4 h-5 w-28 rounded-md" />
          <div className="flex items-center gap-3">
            <div className="skeleton-shimmer h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <div className="skeleton-shimmer h-5 w-32 rounded-md" />
              <div className="skeleton-shimmer h-4 w-40 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div className="border-b border-white/40 px-5 py-4">
          <div className="skeleton-shimmer h-5 w-28 rounded-md" />
        </div>
        <div className="divide-y divide-white/40">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3">
              <div className="space-y-2">
                <div className="skeleton-shimmer h-4 w-48 rounded-md" />
                <div className="skeleton-shimmer h-3 w-36 rounded-md" />
              </div>
              <div className="skeleton-shimmer h-6 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
