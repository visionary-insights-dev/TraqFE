"use client";

import { useMemo, useState } from "react";
import { FolderOpen, UploadCloud, WifiOff } from "lucide-react";
import {
  useUploadResource,
  useResources,
  useMentorCourses,
  useConnectivity,
} from "@/hooks";
import { EmptyState, ErrorState } from "@/components/ui";
import { ResourceCard } from "@/components/scholar/ResourcesView/ResourceCard";
import { cn } from "@/lib/utils";
import { UploadResourceModal } from "./UploadResourceModal";
import type { ResourceType } from "@/lib/types";
import type { ResourceTypeFilter } from "@/components/scholar/ResourcesView/ResourceFilters/types";

const TYPE_OPTIONS: Array<{ value: ResourceTypeFilter; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "PDF", label: "PDF" },
  { value: "LINK", label: "Links" },
  { value: "FILE", label: "Files" },
  { value: "VIDEO", label: "Videos" },
];

export const ResourceCenterView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useResources();
  const { data: courses = [] } = useMentorCourses();
  const uploadMutation = useUploadResource();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<ResourceTypeFilter>("ALL");

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.filter((r: { name: string; type: ResourceType }) => {
      const matchesType = type === "ALL" || r.type === type;
      const matchesSearch = !q || r.name.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [data, search, type]);

  const handleUpload = async (input: Parameters<typeof uploadMutation.mutateAsync>[0]) => {
    await uploadMutation.mutateAsync(input);
    setUploadOpen(false);
  };

  if (isLoading) {
    return <ResourceSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Header onCreate={() => setUploadOpen(true)} />
        <ErrorState
          title="Could not load resources"
          message="Something went wrong while loading your resources. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header onCreate={() => setUploadOpen(true)} />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. You can&apos;t upload resources until you
          reconnect.
        </div>
      ) : null}

      <div className="space-y-3">
        <label htmlFor="resource-search" className="sr-only">
          Search resources
        </label>
        <input
          id="resource-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search resources..."
          className="h-12 w-full rounded-xl border border-white/60 bg-white/80 pl-4 text-sm text-neutral-900 shadow-sm backdrop-blur transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <div
          role="group"
          aria-label="Filter resources by type"
          className="flex flex-wrap gap-2"
        >
          {TYPE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={type === value}
              onClick={() => setType(value)}
              className={cn(
                "inline-flex h-11 items-center rounded-full border px-4 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                type === value
                  ? "border-brand-700 bg-gradient-to-b from-brand-600 to-brand-700 text-white shadow-md focus-visible:ring-white"
                  : "border-white/60 bg-white/70 text-neutral-600 shadow-sm backdrop-blur hover:border-neutral-200 hover:text-neutral-900 focus-visible:ring-brand-500"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {data && data.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-7 w-7" aria-hidden="true" />}
          title="No resources yet"
          description="Upload a resource to share course materials with your scholars."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-7 w-7" aria-hidden="true" />}
          title="No matching resources"
          description="Try a different search or clear the filters."
          hasFilters
          onClearFilters={() => {
            setSearch("");
            setType("ALL");
          }}
        />
      ) : (
        <>
          <ul className="grid gap-4 sm:grid-cols-2">
            {filtered.map((resource) => (
              <li key={resource.id}>
                <ResourceCard resource={resource} />
              </li>
            ))}
          </ul>
          <p className="sr-only" role="status" aria-live="polite">
            {filtered.length} resource{filtered.length === 1 ? "" : "s"} shown
          </p>
        </>
      )}

      <UploadResourceModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
        courses={courses}
        isSubmitting={uploadMutation.isPending}
        error={
          uploadMutation.isError
            ? "Couldn't upload the resource. Please try again."
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
          Resource Center
        </h1>
        <p className="mt-1 text-neutral-600">
          Share and manage resources for your scholars.
        </p>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <UploadCloud className="h-4 w-4" aria-hidden="true" />
        Upload Resource
      </button>
    </div>
  );
}

function ResourceSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-busy="true"
      aria-label="Loading resources"
    >
      <div className="skeleton-shimmer h-8 w-48 rounded-lg" />
      <div className="skeleton-shimmer h-12 w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex items-center gap-4">
              <div className="skeleton-shimmer h-11 w-11 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton-shimmer h-4 w-1/2 rounded-md" />
                <div className="skeleton-shimmer h-3 w-2/3 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
