"use client";

import { useMemo, useState } from "react";
import { FolderOpen, WifiOff } from "lucide-react";
import { useScholarResources, useConnectivity } from "@/hooks";
import { EmptyState, ErrorState } from "@/components/ui";
import { ScholarPageHeader } from "@/components/scholar/shared";
import { ResourceCard } from "./ResourceCard";
import { ResourceFilters, type ResourceTypeFilter } from "./ResourceFilters";

export const ResourcesView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useScholarResources();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<ResourceTypeFilter>("ALL");

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.filter((resource) => {
      const matchesType = type === "ALL" || resource.type === type;
      const matchesSearch =
        q.length === 0 ||
        resource.name.toLowerCase().includes(q) ||
        (resource.courseName ?? "").toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [data, search, type]);

  if (isLoading) {
    return <ResourcesSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Header />
        <ErrorState
          title="Could not load resources"
          message="Something went wrong while loading your resources. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const isEmpty = !data || data.length === 0;
  const noResults = !isEmpty && filtered.length === 0;

  return (
    <div className="space-y-6">
      <Header />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm dark:text-amber-300"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Files may not be available to open.
        </div>
      ) : null}

      {!isEmpty ? (
        <ResourceFilters
          search={search}
          onSearchChange={setSearch}
          type={type}
          onTypeChange={setType}
        />
      ) : null}

      {isEmpty ? (
        <EmptyState
          icon={<FolderOpen className="h-7 w-7" aria-hidden="true" />}
          title="No resources yet"
          description="Your mentor will share learning materials and links here."
        />
      ) : noResults ? (
        <>
          <EmptyState
            icon={<FolderOpen className="h-7 w-7" aria-hidden="true" />}
            title="No matching resources"
            description="Try a different search term or filter."
            hasFilters
            onClearFilters={() => {
              setSearch("");
              setType("ALL");
            }}
          />
          <p className="sr-only" role="status">
            {filtered.length === 0
              ? "No resources match your filters"
              : `${filtered.length} resource${filtered.length === 1 ? "" : "s"} match your filters`}
          </p>
        </>
      ) : (
        <>
          <ul className="space-y-4">
            {filtered.map((resource, index) => (
              <li
                key={resource.id}
                className={`dash-enter ${
                  ["dash-1", "dash-2", "dash-3", "dash-4", "dash-5"][index % 5]
                }`}
              >
                <ResourceCard resource={resource} />
              </li>
            ))}
          </ul>
          <p className="sr-only" role="status">
            {filtered.length} resource{filtered.length === 1 ? "" : "s"} shown
          </p>
        </>
      )}
    </div>
  );
};

function Header() {
  return (
    <ScholarPageHeader
      eyebrow="Resources"
      title="Resources"
      subtitle="Learning materials shared by your mentors."
    />
  );
}

function ResourcesSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-busy="true"
      aria-label="Loading resources"
    >
      <div className="space-y-2">
        <div className="skeleton-shimmer h-3 w-28 rounded-md" />
        <div className="skeleton-shimmer h-8 w-40 rounded-lg" />
        <div className="skeleton-shimmer h-3 w-64 rounded-md" />
      </div>
      <div className="skeleton-shimmer h-12 w-full rounded-xl" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass-card flex items-start gap-4 rounded-2xl p-5"
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
