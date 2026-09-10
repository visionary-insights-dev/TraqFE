"use client";

import { BarChart3, ClipboardCheck, Target } from "lucide-react";
import { Card, CardContent, EmptyState, ErrorState } from "@/components/ui";
import { ProgressBar, ScholarPageHeader } from "@/components/scholar/shared";
import { ActiveTasksList } from "@/components/scholar/DashboardView/ActiveTasksList";
import { AttendanceSummary } from "@/components/scholar/DashboardView/AttendanceSummary";
import { ProgramProgressCard } from "@/components/scholar/DashboardView/ProgramProgressCard";
import { useScholarCourses, useScholarDashboard } from "@/hooks";
import type { Course } from "@/lib/types";

export const ProgressView = () => {
  const dashboard = useScholarDashboard();
  const courses = useScholarCourses();

  if (dashboard.isLoading) return <ProgressSkeleton />;

  if (dashboard.isError) {
    return (
      <div className="space-y-6">
        <Header />
        <ErrorState
          title="Could not load your progress"
          message="Something went wrong while loading your progress. Please try again."
          onRetry={() => dashboard.refetch()}
        />
      </div>
    );
  }

  const analytics = dashboard.data!;

  return (
    <div className="space-y-6">
      <Header />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="dash-enter dash-1">
          <ProgramProgressCard progress={analytics.progress} />
        </div>
        <div className="dash-enter dash-2">
          <AttendanceSummary attendance={analytics.attendance} />
        </div>
      </div>

      <section aria-labelledby="active-tasks-heading" className="dash-enter dash-3 space-y-3">
        <h2
          id="active-tasks-heading"
          className="flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-white"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
            <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          Active tasks
        </h2>
        <ActiveTasksList tasks={analytics.activeTasks} />
      </section>

      <section aria-labelledby="course-progress-heading" className="dash-enter dash-4 space-y-3">
        <h2
          id="course-progress-heading"
          className="flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-white"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
          </span>
          Course progress
        </h2>
        {courses.isLoading ? (
          <CourseProgressSkeleton />
        ) : courses.isError ? (
          <ErrorState
            title="Could not load course progress"
            message="Please try again."
            onRetry={() => courses.refetch()}
          />
        ) : (courses.data ?? []).length === 0 ? (
          <EmptyState
            icon={<BarChart3 className="h-7 w-7" aria-hidden="true" />}
            title="No courses yet"
            description="Your program lead will assign you to a course."
          />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {(courses.data ?? []).map((course) => (
              <li key={course.id}>
                <CourseProgressCard course={course} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

function CourseProgressCard({ course }: { course: Course }) {
  return (
    <Card className="glass-card glass-edge group relative overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-violet-500/10 to-amber-400/10 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/15"
      />
      <CardContent className="relative space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium text-neutral-900 dark:text-white">
            {course.name}
          </h3>
          <span className="rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2.5 py-0.5 text-sm font-bold tabular-nums text-amber-950 shadow-md shadow-amber-500/30">
            {Math.round(course.progress.overall)}%
          </span>
        </div>
        <ProgressBar
          value={course.progress.overall}
          aria-label={`${course.name} progress`}
          className="h-2 bg-neutral-200/60 ring-1 ring-white/40 dark:bg-slate-700/60 dark:ring-white/10"
          barClassName="bar-shine bg-gradient-to-r from-brand-500 via-brand-600 to-violet-500"
        />
        <dl className="flex items-center justify-between gap-2 text-sm text-neutral-600 dark:text-slate-400">
          <dt className="flex items-center gap-1.5">
            <ClipboardCheck className="h-3.5 w-3.5 text-brand-600 dark:text-brand-300" aria-hidden="true" />
            Assignments
          </dt>
          <dd className="tabular-nums text-neutral-900 dark:text-white">
            {course.progress.assignmentsCompleted}/{course.progress.assignmentsTotal}{" "}
            done
          </dd>
        </dl>
        <dl className="flex items-center justify-between gap-2 text-sm text-neutral-600 dark:text-slate-400">
          <dt className="flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
            Attendance
          </dt>
          <dd className="tabular-nums text-neutral-900 dark:text-white">
            {Math.round(course.progress.attendancePct)}%
          </dd>
        </dl>
      </CardContent>
    </Card>
  );
}

function Header() {
  return (
    <ScholarPageHeader
      eyebrow="Progress"
      title="Progress"
      subtitle="How you're tracking on assignments and attendance."
    />
  );
}

function ProgressSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-busy="true"
      aria-label="Loading progress"
    >
      <div className="space-y-2">
        <div className="skeleton-shimmer h-3 w-24 rounded-md" />
        <div className="skeleton-shimmer h-8 w-32 rounded-lg" />
        <div className="skeleton-shimmer h-3 w-64 rounded-md" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-5">
            <div className="skeleton-shimmer h-4 w-32 rounded-md" />
            <div className="mt-4 skeleton-shimmer h-9 w-20 rounded-md" />
            <div className="mt-3 skeleton-shimmer h-2.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CourseProgressSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[1, 2].map((i) => (
        <div key={i} className="glass-card rounded-2xl p-5">
          <div className="skeleton-shimmer h-4 w-2/3 rounded-md" />
          <div className="mt-3 skeleton-shimmer h-2 w-full rounded-full" />
          <div className="mt-3 skeleton-shimmer h-3 w-1/2 rounded-md" />
        </div>
      ))}
    </div>
  );
}