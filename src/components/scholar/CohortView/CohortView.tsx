"use client";

import { useMemo, useState } from "react";
import { GraduationCap, Search, UserRound, Users, WifiOff, X } from "lucide-react";
import { useScholarCohort, useConnectivity } from "@/hooks";
import type { CohortMember } from "@/lib/types";
import { EmptyState, ErrorState } from "@/components/ui";
import { ScholarPageHeader } from "@/components/scholar/shared";
import { MemberRow } from "./MemberRow";

export const CohortView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useScholarCohort();
  const [search, setSearch] = useState("");

  const members = useMemo<{
    mentors: CohortMember[];
    scholars: CohortMember[];
  }>(() => {
    const list = data?.members ?? [];
    const q = search.trim().toLowerCase();
    const filtered =
      q.length === 0
        ? list
        : list.filter((m) => m.name.toLowerCase().includes(q));
    return {
      mentors: filtered.filter((m) => m.role === "MENTOR"),
      scholars: filtered.filter((m) => m.role === "SCHOLAR"),
    };
  }, [data, search]);

  if (isLoading) {
    return <CohortSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Header memberCount={0} />
        <ErrorState
          title="Could not load your cohort"
          message="Something went wrong while loading your cohort. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const isEmpty = !data || data.members.length === 0;
  const noResults = !isEmpty && members.mentors.length + members.scholars.length === 0;

  return (
    <div className="space-y-6">
      <Header name={data?.name} memberCount={data?.members.length ?? 0} />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm dark:text-amber-300"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Member details may be out of date.
        </div>
      ) : null}

      {isEmpty ? (
        <EmptyState
          icon={<Users className="h-7 w-7" aria-hidden="true" />}
          title="No cohort yet"
          description="You haven't been assigned to a cohort yet. Check back once your mentor adds you."
        />
      ) : (
        <>
          <label htmlFor="cohort-search" className="sr-only">
            Search cohort members
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
              aria-hidden="true"
            />
            <input
              id="cohort-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members..."
              className="h-12 w-full rounded-xl border border-white/60 bg-white/80 pl-10 pr-11 text-sm text-neutral-900 shadow-sm backdrop-blur placeholder:text-neutral-500 transition-all duration-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          {noResults ? (
            <>
              <EmptyState
                icon={<Users className="h-7 w-7" aria-hidden="true" />}
                title="No matching members"
                description="Try a different name."
                hasFilters
                onClearFilters={() => setSearch("")}
              />
              <p key={search} className="sr-only" role="status">
                No members match your search
              </p>
            </>
          ) : (
            <div className="space-y-6">
              {members.mentors.length > 0 ? (
                <section aria-labelledby="mentors-heading">
                  <h2
                    id="mentors-heading"
                    className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-600 dark:text-slate-400"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300">
                      <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    Mentors
                  </h2>
                  <ul className="space-y-3">
                    {members.mentors.map((member, index) => (
                      <MemberRow
                        key={member.id}
                        member={member}
                        className={`dash-enter ${
                          ["dash-1", "dash-2", "dash-3", "dash-4", "dash-5"][
                            index % 5
                          ]
                        }`}
                      />
                    ))}
                  </ul>
                </section>
              ) : null}

              {members.scholars.length > 0 ? (
                <section aria-labelledby="scholars-heading">
                  <h2
                    id="scholars-heading"
                    className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-600 dark:text-slate-400"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                      <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    Scholars
                  </h2>
                  <ul className="space-y-3">
                    {members.scholars.map((member, index) => (
                      <MemberRow
                        key={member.id}
                        member={member}
                        className={`dash-enter ${
                          ["dash-1", "dash-2", "dash-3", "dash-4", "dash-5"][
                            index % 5
                          ]
                        }`}
                      />
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          )}
        </>
      )}
    </div>
  );
};

function Header({ name, memberCount }: { name?: string; memberCount: number }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <ScholarPageHeader
        eyebrow="Cohort"
        title="My Cohort"
        subtitle={name}
      />
      <p className="glass-chip inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-neutral-700 dark:text-slate-200">
        <Users className="h-4 w-4 text-amber-500" aria-hidden="true" />
        {memberCount} member{memberCount === 1 ? "" : "s"}
      </p>
    </div>
  );
}

function CohortSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-busy="true"
      aria-label="Loading cohort"
    >
      <div className="space-y-2">
        <div className="skeleton-shimmer h-3 w-24 rounded-md" />
        <div className="skeleton-shimmer h-8 w-40 rounded-lg" />
      </div>
      <div className="skeleton-shimmer h-12 w-full rounded-xl" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass-card flex items-center gap-4 rounded-2xl p-4"
          >
            <div className="skeleton-shimmer h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton-shimmer h-4 w-2/3 rounded-md" />
              <div className="skeleton-shimmer h-3 w-1/3 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
