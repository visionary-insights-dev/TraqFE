"use client";

import { useEffect, useState } from "react";
import { ClipboardList, WifiOff } from "lucide-react";
import {
  useCreateAssignment,
  useMentorAssignments,
  useMentorCourses,
  usePublishAssignment,
  useRequestChange,
  useConnectivity,
  useSocketEvents,
} from "@/hooks";
import { queryKeys } from "@/hooks/keys";
import { EmptyState, ErrorState } from "@/components/ui";
import { AssignmentRow } from "./AssignmentRow";
import { CreateAssignmentModal } from "./CreateAssignmentModal";
import { ChangeRequestModal } from "./ChangeRequestModal";
import type { MentorAssignment } from "@/lib/types";

export const AssignmentsView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useMentorAssignments();
  const { data: courses = [] } = useMentorCourses();
  const createMutation = useCreateAssignment();
  const publishMutation = usePublishAssignment();
  const requestChangeMutation = useRequestChange();
  const [createOpen, setCreateOpen] = useState(false);
  const [changeRequest, setChangeRequest] = useState<MentorAssignment | null>(
    null
  );
  const [now, setNow] = useState(() => Date.now());

  useSocketEvents(["assignment.status_changed"], {
    invalidateKeys: [queryKeys.mentorAssignments],
  });

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const handleCreate = async (input: {
    title: string;
    description: string;
    dueAt: string;
    courseId: string;
    audience: string;
  }) => {
    const created = await createMutation.mutateAsync(input);
    await publishMutation.mutateAsync(created.id);
    setCreateOpen(false);
  };

  const handleRequestChange = async (
    assignmentId: string,
    message: string
  ) => {
    await requestChangeMutation.mutateAsync({ assignmentId, message });
    setChangeRequest(null);
  };

  if (isLoading) {
    return <AssignmentsSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Header onCreate={() => setCreateOpen(true)} />
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
      <Header onCreate={() => setCreateOpen(true)} />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. You can&apos;t create or publish assignments
          until you reconnect.
        </div>
      ) : null}

      {data && data.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="h-7 w-7" aria-hidden="true" />}
          title="No assignments yet"
          description="Create your first assignment to assign work to your scholars."
        />
      ) : (
        <ul className="space-y-4">
          {data?.map((assignment) => (
            <li key={assignment.id}>
              <AssignmentRow
                assignment={assignment}
                now={now}
                onOpen={(id) => publishMutation.mutate(id)}
                onRequestChange={setChangeRequest}
              />            </li>
          ))}
        </ul>
      )}

      <CreateAssignmentModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
        courses={courses}
        isSubmitting={createMutation.isPending || publishMutation.isPending}
        error={
          createMutation.isError || publishMutation.isError
            ? "Couldn't create the assignment. Please try again."
            : null
        }
      />

      <ChangeRequestModal
        assignment={changeRequest}
        open={changeRequest !== null}
        onClose={() => setChangeRequest(null)}
        onRequest={handleRequestChange}
        isSubmitting={requestChangeMutation.isPending}
        error={
          requestChangeMutation.isError
            ? "Couldn't send the change request. Please try again."
            : null
        }
      />

      <p className="sr-only" role="status" aria-live="polite">
        {data?.length ?? 0} assignment{data?.length === 1 ? "" : "s"} shown
      </p>
    </div>
  );
};

function Header({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Assignments
        </h1>
        <p className="mt-1 text-neutral-600">
          Create and manage assignments for your scholars.
        </p>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        New Assignment
      </button>
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
      <div className="flex items-start justify-between">
        <div className="skeleton-shimmer h-8 w-40 rounded-lg" />
        <div className="skeleton-shimmer h-11 w-36 rounded-lg" />
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
