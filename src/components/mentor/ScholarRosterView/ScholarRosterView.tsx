"use client";

import { useMemo, useState } from "react";
import { Users, WifiOff } from "lucide-react";
import { useMentorScholars, useConnectivity, useSocketEvents } from "@/hooks";
import { queryKeys } from "@/hooks/keys";
import { EmptyState, ErrorState } from "@/components/ui";
import { ScholarRow } from "./ScholarRow";
import type { MentorScholar } from "@/lib/types";

export const ScholarRosterView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useMentorScholars();
  const [search, setSearch] = useState("");

  useSocketEvents(["analytics.course.updated"], {
    invalidateKeys: [queryKeys.mentorScholars],
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (s: MentorScholar) =>
        s.name.toLowerCase().includes(q) ||
        (s.courseName ?? "").toLowerCase().includes(q)
    );
  }, [data, search]);

  if (isLoading) {
    return <ScholarRosterSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Header />
        <ErrorState
          title="Could not load your scholars"
          message="Something went wrong while loading your scholar roster. Please try again."
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
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Roster data may not be up to date.
        </div>
      ) : null}

      <div>
        <label htmlFor="roster-search" className="sr-only">
          Search scholars
        </label>
        <input
          id="roster-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or course…"
          className="h-12 w-full rounded-xl border border-white/60 bg-white/80 pl-4 pr-4 text-sm text-neutral-900 shadow-sm backdrop-blur transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      </div>

      {data && data.length === 0 ? (
        <EmptyState
          icon={<Users className="h-7 w-7" aria-hidden="true" />}
          title="No scholars assigned"
          description="You don't have any assigned scholars yet. They'll appear here once you're paired."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-7 w-7" aria-hidden="true" />}
          title={`No scholars match "${search}"`}
          description="Try a different name or course."
          hasFilters
          onClearFilters={() => setSearch("")}
        />
      ) : (
        <>
          <ul className="space-y-4">
            {filtered.map((scholar) => (
              <li key={scholar.id}>
                <ScholarRow scholar={scholar} />
              </li>
            ))}
          </ul>
          <p className="sr-only" role="status" aria-live="polite">
            {filtered.length} scholar{filtered.length === 1 ? "" : "s"} shown
          </p>
        </>
      )}
    </div>
  );
};

function Header() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
        My Scholars
      </h1>
      <p className="mt-1 text-neutral-600">
        A quick view of your assigned scholars and their progress.
      </p>
    </div>
  );
}

function ScholarRosterSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-busy="true"
      aria-label="Loading scholars"
    >
      <div className="skeleton-shimmer h-8 w-40 rounded-lg" />
      <div className="skeleton-shimmer h-12 w-full rounded-xl" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex items-center gap-4">
              <div className="skeleton-shimmer h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton-shimmer h-4 w-1/3 rounded-md" />
                <div className="skeleton-shimmer h-2.5 w-full rounded-full" />
              </div>
              <div className="skeleton-shimmer h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
