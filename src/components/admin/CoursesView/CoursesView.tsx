"use client";

import { useState } from "react";
import { Pencil, Plus, WifiOff } from "lucide-react";
import { AdminPageHeader, DataTable, type DataTableColumn } from "@/components/admin";
import { Badge, Button, ErrorState } from "@/components/ui";
import {
  useAdminCourses,
  useArchiveCourse,
  useConnectivity,
  useCreateCourse,
  usePrograms,
  useUnarchiveCourse,
  useUpdateCourse,
} from "@/hooks";
import type { AdminCourse } from "@/lib/types";
import { ArchiveCourseModal, UnarchiveCourseModal } from "./index";
import { CourseFormModal } from "./CourseFormModal";

type CourseFilter = "all" | "active" | "archived";

export const CoursesView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useAdminCourses();
  const { data: programs } = usePrograms();

  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const archiveMutation = useArchiveCourse();
  const unarchiveMutation = useUnarchiveCourse();

  const [formOpen, setFormOpen] = useState(false);
  const [initial, setInitial] = useState<AdminCourse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<AdminCourse | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [unarchiveTarget, setUnarchiveTarget] = useState<AdminCourse | null>(null);
  const [unarchiveError, setUnarchiveError] = useState<string | null>(null);
  const [filter, setFilter] = useState<CourseFilter>("all");

  const handleFormSubmit = async (input: {
    name: string;
    code?: string;
    programId?: string;
  }) => {
    setFormError(null);
    try {
      if (initial) {
        await updateMutation.mutateAsync({ courseId: initial.id, input });
      } else {
        await createMutation.mutateAsync(input);
      }
      setFormOpen(false);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Could not save the course."
      );
    }
  };

  const handleArchive = async () => {
    if (!archiveTarget) return;
    setArchiveError(null);
    try {
      await archiveMutation.mutateAsync(archiveTarget.id);
      setArchiveTarget(null);
    } catch (err) {
      setArchiveError(
        err instanceof Error ? err.message : "Could not archive the course."
      );
    }
  };

  const handleUnarchive = async () => {
    if (!unarchiveTarget) return;
    setUnarchiveError(null);
    try {
      await unarchiveMutation.mutateAsync(unarchiveTarget.id);
      setUnarchiveTarget(null);
    } catch (err) {
      setUnarchiveError(
        err instanceof Error ? err.message : "Could not restore the course."
      );
    }
  };

  if (isLoading) {
    return <CoursesSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Courses"
          description="Create and manage the courses linked to your programs."
        />
        <ErrorState
          title="Could not load courses"
          message="Something went wrong while loading your courses. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const courses = (data ?? []).filter((c) => {
    if (filter === "active") return !c.archived;
    if (filter === "archived") return c.archived;
    return true;
  });

  const columns: Array<DataTableColumn<AdminCourse>> = [
    {
      key: "name",
      header: "Course",
      sortValue: (c) => c.name,
      render: (c) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-neutral-900">{c.name}</p>
            {c.archived ? <Badge variant="neutral">Archived</Badge> : null}
          </div>
          {c.code ? (
            <p className="mt-0.5 text-xs text-neutral-500">{c.code}</p>
          ) : null}
        </div>
      ),
    },
    {
      key: "program",
      header: "Program",
      sortValue: (c) => c.program?.name ?? "",
      render: (c) => (
        <span className="text-neutral-600">{c.program?.name ?? "—"}</span>
      ),
    },
    {
      key: "scholars",
      header: "Scholars",
      sortValue: (c) => c.scholarCount ?? 0,
      render: (c) => (
        <span className="tabular-nums text-neutral-700">{c.scholarCount ?? 0}</span>
      ),
    },
    {
      key: "mentor",
      header: "Mentor",
      sortValue: (c) => c.mentorName ?? "",
      render: (c) =>
        c.mentorName ? (
          <span className="text-neutral-600">{c.mentorName}</span>
        ) : (
          <Badge variant="amber">Unassigned</Badge>
        ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (c) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => {
              setInitial(c);
              setFormError(null);
              setFormOpen(true);
            }}
            aria-label={`Edit ${c.name}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
          {c.archived ? (
            <button
              type="button"
              onClick={() => {
                setUnarchiveError(null);
                setUnarchiveTarget(c);
              }}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              Unarchive
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setArchiveError(null);
                setArchiveTarget(c);
              }}
              className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-danger-light hover:text-danger-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
            >
              Archive
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Courses"
        description="Create and manage the courses linked to your programs."
        actions={
          <Button
            onClick={() => {
              setInitial(null);
              setFormError(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New course
          </Button>
        }
      />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Courses data may not be up to date.
        </div>
      ) : null}

      <div
        role="group"
        aria-label="Filter courses"
        className="inline-flex rounded-lg bg-neutral-100 p-1"
      >
        {([
          ["all", "All"],
          ["active", "Active"],
          ["archived", "Archived"],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              filter === value
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <DataTable<AdminCourse>
        caption="Courses"
        rows={courses}
        rowKey={(c) => c.id}
        columns={columns}
        emptyTitle="No courses yet"
        emptyDescription="Create your first course and link it to a program."
        emptyAction={
          <Button
            size="sm"
            onClick={() => {
              setInitial(null);
              setFormError(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create course
          </Button>
        }
      />

      <CourseFormModal
        key={initial?.id ?? "new"}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        programs={programs ?? []}
        initial={initial}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        error={formError}
        onSubmit={handleFormSubmit}
      />

      <ArchiveCourseModal
        course={archiveTarget}
        open={archiveTarget !== null}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleArchive}
        isSubmitting={archiveMutation.isPending}
        error={archiveError}
      />

      <UnarchiveCourseModal
        course={unarchiveTarget}
        open={unarchiveTarget !== null}
        onClose={() => setUnarchiveTarget(null)}
        onConfirm={handleUnarchive}
        isSubmitting={unarchiveMutation.isPending}
        error={unarchiveError}
      />
    </div>
  );
};

function CoursesSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading courses">
      <div className="space-y-2">
        <div className="skeleton-shimmer h-8 w-32 rounded-lg" />
        <div className="skeleton-shimmer h-4 w-72 rounded" />
      </div>
      <div className="space-y-px overflow-hidden rounded-xl border border-white/60 bg-white/80 shadow-sm">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-white/60 px-4 py-4">
            <div className="skeleton-shimmer h-4 w-44 rounded" />
            <div className="skeleton-shimmer h-4 w-32 rounded" />
            <div className="skeleton-shimmer h-4 w-10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}