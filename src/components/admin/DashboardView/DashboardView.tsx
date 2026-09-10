"use client";

import {
  AlertTriangle,
  BookOpen,
  CalendarCheck,
  FolderKanban,
  GraduationCap,
  Inbox,
  ListChecks,
  UserCheck,
  WifiOff,
} from "lucide-react";
import Link from "next/link";
import {
  AdminPageHeader,
} from "@/components/admin";
import { ErrorState } from "@/components/ui";
import {
  useAdminDashboard,
  useAdminSocketEvents,
  useConnectivity,
} from "@/hooks";
import { queryKeys } from "@/hooks/keys";
import { MetricCard, type MetricCardProps } from "./MetricCard";
import { AtRiskPanel } from "./AtRiskPanel";
import { ActivityFeed } from "./ActivityFeed";
import { QuickActions } from "./QuickActions";

export const DashboardView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useAdminDashboard();

  useAdminSocketEvents(
    ["analytics.admin.updated", "dashboard.updated"],
    { invalidateKeys: [queryKeys.adminDashboard] }
  );

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Dashboard"
          description="Program-wide health at a glance."
        />
        <ErrorState
          title="Could not load the dashboard"
          message="Something went wrong while loading your program metrics. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const cards: MetricCardProps[] = [
    {
      label: "Scholars",
      value: data.metrics.scholars,
      icon: GraduationCap,
      tone: "brand",
      subLabel: "Active in programs",
    },
    {
      label: "Mentors",
      value: data.metrics.mentors,
      icon: UserCheck,
      tone: "info",
      subLabel: "Active coaches",
    },
    {
      label: "Active programs",
      value: data.metrics.activePrograms,
      icon: FolderKanban,
      tone: "neutral",
    },
    {
      label: "Active courses",
      value: data.metrics.activeCourses,
      icon: BookOpen,
      tone: "neutral",
    },
    {
      label: "At-risk scholars",
      value: data.metrics.atRiskScholars,
      icon: AlertTriangle,
      tone: data.metrics.atRiskScholars > 0 ? "danger" : "success",
      helper:
        data.metrics.atRiskScholars > 0
          ? "Needs attention this week"
          : "No one flagged",
    },
    {
      label: "Avg attendance",
      value: data.metrics.avgAttendanceRate,
      icon: CalendarCheck,
      tone: "success",
      suffix: "%",
      helper: "Across active courses",
    },
    {
      label: "Assignment completion",
      value: data.metrics.assignmentCompletionRate,
      icon: ListChecks,
      tone: "success",
      suffix: "%",
      helper: "Verified submissions",
    },
    {
      label: "Awaiting review",
      value: data.metrics.pendingVerification,
      icon: Inbox,
      tone: data.metrics.pendingVerification > 0 ? "warning" : "success",
      helper:
        data.metrics.pendingVerification > 0 ? (
          <Link
            href="/admin/assignments/verification"
            className="font-semibold text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
          >
            Open verification queue
          </Link>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="Program-wide health at a glance — metrics update live."
      />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Dashboard data may not be up to date.
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AtRiskPanel
            scholars={data.atRiskScholars}
            loading={isLoading}
          />
        </div>
        <div className="space-y-6">
          <ActivityFeed items={data.recentActivity} loading={isLoading} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading dashboard">
      <div className="space-y-2">
        <div className="skeleton-shimmer h-8 w-40 rounded-lg" />
        <div className="skeleton-shimmer h-4 w-72 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-5">
            <div className="skeleton-shimmer h-3 w-20 rounded" />
            <div className="skeleton-shimmer mt-3 h-9 w-16 rounded" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="glass-card rounded-2xl p-5">
            <div className="skeleton-shimmer h-4 w-40 rounded" />
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-shimmer h-12 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-5">
              <div className="skeleton-shimmer h-4 w-32 rounded" />
              <div className="mt-4 space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="skeleton-shimmer h-10 w-full rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
);
};