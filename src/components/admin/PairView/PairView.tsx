"use client";

import { useState } from "react";
import { UserPlus, WifiOff } from "lucide-react";
import { AdminAvatar, AdminPageHeader } from "@/components/admin";
import { Badge, Button, Checkbox, ErrorState } from "@/components/ui";
import {
  useAdminMentors,
  useAdminScholars,
  useConnectivity,
  useCreateMentorAssignment,
} from "@/hooks";
import type { AdminScholar } from "@/lib/types";

export const PairView = () => {
  const isOnline = useConnectivity();
  const { data: mentors, isLoading, isError, refetch } = useAdminMentors();
  const { data: scholars } = useAdminScholars();
  const assignment = useCreateMentorAssignment();

  const [selectedMentorId, setSelectedMentorId] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const unassigned = (scholars ?? []).filter((s) => !s.mentorName && s.status === "ACTIVE");

  const selectedMentor = mentors?.find((m) => m.id === selectedMentorId);
  const allSelected = unassigned.length > 0 && selectedIds.length === unassigned.length;

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : unassigned.map((s) => s.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (!selectedMentorId || selectedIds.length === 0) return;
    setError(null);
    try {
      await assignment.mutateAsync({
        mentorId: selectedMentorId,
        scholarIds: selectedIds,
      });
      setSelectedIds([]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not assign scholars to this mentor."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading pairing">
        <div className="space-y-2">
          <div className="skeleton-shimmer h-8 w-24 rounded-lg" />
          <div className="skeleton-shimmer h-4 w-72 rounded" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="skeleton-shimmer h-96 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Pair scholars with mentors"
          description="Assign unassigned scholars to mentors in one go."
        />
        <ErrorState
          title="Could not load pairing data"
          message="Something went wrong while loading mentors and scholars."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Pair scholars with mentors"
        description="Assign unassigned scholars to mentors in one go."
      />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Pairing is disabled.
        </div>
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section
          aria-label="Select a mentor"
          className="glass-card rounded-2xl"
        >
          <div className="border-b border-neutral-200/70 px-6 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              1. Choose a mentor
            </h2>
          </div>
          <ul className="max-h-96 divide-y divide-neutral-100 overflow-y-auto">
            {(mentors ?? []).map((m) => {
              const active = m.id === selectedMentorId;
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedMentorId(m.id)}
                    aria-pressed={active}
                    className={`flex w-full items-center gap-3 px-5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                      active ? "bg-brand-50" : "hover:bg-neutral-50"
                    }`}
                  >
                    <AdminAvatar name={m.name} avatarUrl={m.avatarUrl} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-neutral-900">{m.name}</p>
                      <p className="text-xs text-neutral-500">
                        {m.title ?? m.email}
                      </p>
                    </div>
                    <span className="text-xs tabular-nums text-neutral-500">
                      {m.scholarCount} scholars
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {!mentors?.length ? (
            <p className="px-6 py-8 text-center text-sm text-neutral-500">
              No mentors available. Invite mentors first.
            </p>
          ) : null}
        </section>

        <section aria-label="Select scholars" className="glass-card rounded-2xl">
          <div className="flex items-center justify-between gap-4 border-b border-neutral-200/70 px-6 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              2. Choose scholars
            </h2>
            {unassigned.length > 0 ? (
              <button
                type="button"
                onClick={toggleAll}
                className="text-sm font-medium text-brand-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
              >
                {allSelected ? "Clear all" : "Select all"}
              </button>
            ) : null}
          </div>

          {unassigned.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-neutral-500">
              All active scholars already have a mentor.
            </p>
          ) : (
            <ul className="max-h-96 divide-y divide-neutral-100 overflow-y-auto">
              {unassigned.map((s) => (
                <ScholarRow
                  key={s.id}
                  scholar={s}
                  checked={selectedIds.includes(s.id)}
                  onToggle={toggleOne}
                />
              ))}
            </ul>
          )}

          <div className="flex items-center justify-between gap-4 border-t border-neutral-200/70 px-6 py-4">
            <p className="text-sm text-neutral-600">
              <strong className="tabular-nums text-neutral-900">
                {selectedIds.length}
              </strong>{" "}
              selected
              {selectedMentor ? (
                <>
                  {" "}
                  · for <strong className="text-neutral-900">{selectedMentor.name}</strong>
                </>
              ) : null}
            </p>
            <Button
              onClick={handleAssign}
              disabled={!selectedMentorId || selectedIds.length === 0 || !isOnline}
              loading={assignment.isPending}
            >
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Assign
            </Button>
          </div>

          {error ? (
            <p
              role="alert"
              className="mx-6 mb-4 rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark"
            >
              {error}
            </p>
          ) : null}

          {assignment.isSuccess ? (
            <p
              role="status"
              className="mx-6 mb-4 rounded-lg bg-success-light px-3 py-2 text-sm text-success-dark"
            >
              Scholars assigned successfully.
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
};

function ScholarRow({
  scholar,
  checked,
  onToggle,
}: {
  scholar: AdminScholar;
  checked: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <li className="flex items-center gap-3 px-5 py-2.5 hover:bg-neutral-50">
      <Checkbox
        id={`scholar-${scholar.id}`}
        checked={checked}
        onChange={() => onToggle(scholar.id)}
        hideLabel
      />
      <AdminAvatar name={scholar.name} avatarUrl={scholar.avatarUrl} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-neutral-900">{scholar.name}</p>
        <p className="text-xs text-neutral-500">{scholar.courseName ?? "No course"}</p>
      </div>
      {scholar.atRisk ? <Badge variant="red">At risk</Badge> : null}
    </li>
  );
}