"use client";

import { GraduationCap, WifiOff } from "lucide-react";
import { useScholarCourses, useConnectivity, useSocketEvents } from "@/hooks";
import { queryKeys } from "@/hooks/keys";
import { EmptyState, ErrorState } from "@/components/ui";
import { ScholarPageHeader } from "@/components/scholar/shared";
import { CourseCard } from "./CourseCard";

export const CoursesView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useScholarCourses();

  useSocketEvents(["analytics.course.updated"], {
    invalidateKeys: [queryKeys.scholarCourses],
  });

  if (isLoading) {
    return <CoursesSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Header />
        <ErrorState
          title="Could not load courses"
          message="Something went wrong while loading your courses. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm dark:text-amber-300"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Progress may not be up to date.
        </div>
      ) : null}

      {data && data.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="h-7 w-7" aria-hidden="true" />}
          title="No courses yet"
          description="You haven't been enrolled in any courses yet. They'll appear here once your mentor adds them."
        />
      ) : (
        <ul className="space-y-5">
          {data?.map((course, index) => (
            <li
              key={course.id}
              className={`dash-enter ${
                ["dash-1", "dash-2", "dash-3", "dash-4", "dash-5"][index % 5]
              }`}
            >
              <CourseCard course={course} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

function Header() {
  return (
    <ScholarPageHeader
      eyebrow="Courses"
      title="Courses &amp; Progress"
      subtitle="See how you're doing across each of your courses."
    />
  );
}

function CoursesSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-busy="true"
      aria-label="Loading courses"
    >
      <div className="space-y-2">
        <div className="skeleton-shimmer h-3 w-28 rounded-md" />
        <div className="skeleton-shimmer h-8 w-52 rounded-lg" />
        <div className="skeleton-shimmer h-3 w-64 rounded-md" />
      </div>
      <div className="space-y-5">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="skeleton-shimmer h-11 w-11 rounded-xl" />
                <div className="space-y-2">
                  <div className="skeleton-shimmer h-4 w-40 rounded-md" />
                  <div className="skeleton-shimmer h-3 w-28 rounded-md" />
                </div>
              </div>
              <div className="skeleton-shimmer h-9 w-16 rounded-md" />
            </div>
            <div className="skeleton-shimmer my-4 h-2.5 w-full rounded-full" />
            <div className="grid grid-cols-2 gap-3 border-t border-white/40 pt-4 dark:border-white/5">
              <div className="skeleton-shimmer h-12 rounded-xl" />
              <div className="skeleton-shimmer h-12 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}