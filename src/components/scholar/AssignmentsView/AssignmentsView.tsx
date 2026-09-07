"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ListChecks, WifiOff } from "lucide-react";
import {
  useAssignments,
  useSubmitAssignment,
  useConnectivity,
  useSocketEvents,
} from "@/hooks";
import { queryKeys } from "@/hooks/keys";
import { EmptyState, ErrorState } from "@/components/ui";
import { AssignmentCard } from "./AssignmentCard";
import { StatusFilterBar } from "./StatusFilterBar";
import { AssignmentDetail } from "./AssignmentDetail";
import type { AssignmentStatus } from "@/lib/types";
import type { AssignmentFilter } from "./types";

const statusGroup: Record<AssignmentStatus, AssignmentFilter> = {
  NOT_STARTED: "PENDING",
  IN_PROGRESS: "PENDING",
  PENDING_VERIFICATION: "AWAITING",
  RESUBMISSION_REQUIRED: "AWAITING",
  VERIFIED: "COMPLETED",
  VERIFIED_LATE: "COMPLETED",
  OVERDUE: "OVERDUE",
};

export const AssignmentsView = () => {
  const params = useParams<{ id?: string }>();
  const [filter, setFilter] = useState<AssignmentFilter>("ALL");
  const [detailId, setDetailId] = useState<string | null>(
    params?.id ?? null
  );

  // Sync the open assignment to a changed deep-link param using render-phase
  // state adjustment (the documented pattern for deriving state from props),
  // rather than setState-in-effect which would cascade renders.
  const [prevRouteId, setPrevRouteId] = useState<string | undefined>(
    params?.id
  );
  if (prevRouteId !== params?.id) {
    setPrevRouteId(params?.id);
    setDetailId(params?.id ?? null);
  }

  const isOnline = useConnectivity();

  const { data, isLoading, isError, refetch } = useAssignments();
  const submitMutation = useSubmitAssignment(detailId ?? "");

  useSocketEvents(["assignment.status_changed"], {
    invalidateKeys: [queryKeys.assignments],
  });

  const counts = useMemo(() => {
    const acc: Partial<Record<AssignmentFilter, number>> = {};
    for (const a of data ?? []) {
      acc["ALL"] = (acc["ALL"] ?? 0) + 1;
      const group = statusGroup[a.status];
      acc[group] = (acc[group] ?? 0) + 1;
    }
    return acc;
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "ALL") return data;
    return data.filter((a) => statusGroup[a.status] === filter);
  }, [data, filter]);

  const detailAssignment = useMemo(
    () => (data ?? []).find((a) => a.id === detailId) ?? null,
    [data, detailId]
  );

  const handleSubmit = useCallback(async () => {
    if (!detailId) return;
    await submitMutation.mutateAsync();
  }, [detailId, submitMutation]);

  if (isLoading) {
    return <AssignmentsSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Header />
        <ErrorState
          title="Could not load assignments"
          message="Something went wrong while loading your assignments. Please try again."
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
          You&apos;re offline. You can&apos;t submit assignments until you
          reconnect.
        </div>
      ) : null}

      <StatusFilterBar
        active={filter}
        counts={counts}
        onChange={setFilter}
      />

      {data && data.length === 0 ? (
        <EmptyState
          icon={<ListChecks className="h-7 w-7" aria-hidden="true" />}
          title="No assignments yet"
          description="Your mentor hasn't assigned anything yet. New assignments will appear here."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<ListChecks className="h-7 w-7" aria-hidden="true" />}
          title={`No ${filter.toLowerCase()} assignments`}
          description="There aren't any assignments in this category right now."
          hasFilters
          onClearFilters={() => setFilter("ALL")}
        />
      ) : (
        <>
          <ul className="space-y-4">
            {filtered.map((assignment) => (
              <li key={assignment.id}>
                <AssignmentCard
                  assignment={assignment}
                  onOpen={() => setDetailId(assignment.id)}
                />
              </li>
            ))}
          </ul>
          <p className="sr-only" role="status" aria-live="polite">
            {filtered.length} assignment{filtered.length === 1 ? "" : "s"} shown
          </p>
        </>
      )}

      <AssignmentDetail
        assignment={detailAssignment}
        open={detailId !== null}
        onClose={() => setDetailId(null)}
        isOffline={!isOnline}
        isSubmitting={submitMutation.isPending}
        onSubmit={handleSubmit}
        error={
          submitMutation.isError
            ? "Couldn't submit your assignment. Please try again."
            : null
        }
      />
    </div>
  );
};

function Header() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
        Assignments
      </h1>
      <p className="mt-1 text-neutral-600">
        Track and complete your assigned work.
      </p>
    </div>
  );
}

function AssignmentsSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-busy="true"
      aria-label="Loading assignments"
    >
      <div className="skeleton-shimmer h-8 w-40 rounded-lg" />
      <div className="flex flex-wrap gap-2">
        {["All", "Pending", "Awaiting", "Completed", "Overdue"].map((label) => (
          <div
            key={label}
            className="skeleton-shimmer h-11 w-24 rounded-full"
          />
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex items-center gap-4">
              <div className="skeleton-shimmer h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="skeleton-shimmer h-4 w-1/2 rounded-md" />
                <div className="skeleton-shimmer h-3 w-2/3 rounded-md" />
              </div>
              <div className="skeleton-shimmer h-6 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
