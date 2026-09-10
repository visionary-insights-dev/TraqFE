"use client";

import { useState } from "react";
import { Plus, RotateCcw, WifiOff } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader, DataTable, type DataTableColumn } from "@/components/admin";
import { ArchiveProgramModal, UnarchiveProgramModal } from "./index";
import { Badge, Button, ErrorState } from "@/components/ui";
import { useArchiveProgram, useConnectivity, usePrograms, useUnarchiveProgram } from "@/hooks";
import { formatDate } from "@/lib/utils";
import type { Program } from "@/lib/types";

export const ProgramsView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = usePrograms();
  const archiveMutation = useArchiveProgram();
  const unarchiveMutation = useUnarchiveProgram();
  const [archiveTarget, setArchiveTarget] = useState<Program | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [unarchiveTarget, setUnarchiveTarget] = useState<Program | null>(null);
  const [unarchiveError, setUnarchiveError] = useState<string | null>(null);

  const handleArchive = async () => {
    if (!archiveTarget) return;
    setArchiveError(null);
    try {
      await archiveMutation.mutateAsync(archiveTarget.id);
      setArchiveTarget(null);
    } catch (err) {
      setArchiveError(
        err instanceof Error ? err.message : "Could not archive the program."
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
        err instanceof Error ? err.message : "Could not restore the program."
      );
    }
  };

  if (isLoading) {
    return <ProgramsSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Programs"
          description="Manage the programs running across your organization."
          actions={
            <Link href="/admin/programs/new">
              <Button>
                <Plus className="h-4 w-4" aria-hidden="true" />
                New program
              </Button>
            </Link>
          }
        />
        <ErrorState
          title="Could not load programs"
          message="Something went wrong while loading your programs. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const programs = data ?? [];

  const columns: Array<DataTableColumn<Program>> = [
    {
      key: "name",
      header: "Program",
      sortValue: (p) => p.name,
      render: (p) => (
        <div>
          <p className="font-medium text-neutral-900">{p.name}</p>
          {p.description ? (
            <p className="mt-0.5 line-clamp-1 max-w-sm text-xs text-neutral-500">
              {p.description}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (p) => p.status,
      render: (p) =>
        p.status === "ACTIVE" ? (
          <Badge variant="green">Active</Badge>
        ) : (
          <Badge variant="neutral">Archived</Badge>
        ),
    },
    {
      key: "courses",
      header: "Courses",
      sortValue: (p) => p.courseCount,
      render: (p) => (
        <span className="tabular-nums text-neutral-700">{p.courseCount}</span>
      ),
    },
    {
      key: "scholars",
      header: "Scholars",
      sortValue: (p) => p.scholarCount,
      render: (p) => (
        <span className="tabular-nums text-neutral-700">{p.scholarCount}</span>
      ),
    },
    {
      key: "start",
      header: "Starts",
      sortValue: (p) => p.startDate ?? "",
      render: (p) =>
        p.startDate ? (
          <span className="text-neutral-600">{formatDate(p.startDate)}</span>
        ) : (
          <span className="text-neutral-400">—</span>
        ),
    },
    {
      key: "actions",
      header: "",
      render: (p) =>
        p.status === "ACTIVE" ? (
          <button
            type="button"
            onClick={() => {
              setArchiveError(null);
              setArchiveTarget(p);
            }}
            className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-danger-light hover:text-danger-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
          >
            Archive
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setUnarchiveError(null);
              setUnarchiveTarget(p);
            }}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Unarchive
          </button>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Programs"
        description="Manage the programs running across your organization."
        actions={
          <Link href="/admin/programs/new">
            <Button>
              <Plus className="h-4 w-4" aria-hidden="true" />
              New program
            </Button>
          </Link>
        }
      />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Programs data may not be up to date.
        </div>
      ) : null}

      <DataTable<Program>
        caption="Programs"
        rows={programs}
        rowKey={(p) => p.id}
        isLoading={isLoading}
        columns={columns}
        emptyTitle="No programs yet"
        emptyDescription="Create your first program to start enrolling scholars."
        emptyAction={
          <Link href="/admin/programs/new" className="inline-flex">
            <Button size="sm">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create program
            </Button>
          </Link>
        }
      />

      <ArchiveProgramModal
        program={archiveTarget}
        open={archiveTarget !== null}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleArchive}
        isSubmitting={archiveMutation.isPending}
        error={archiveError}
      />

      <UnarchiveProgramModal
        program={unarchiveTarget}
        open={unarchiveTarget !== null}
        onClose={() => setUnarchiveTarget(null)}
        onConfirm={handleUnarchive}
        isSubmitting={unarchiveMutation.isPending}
        error={unarchiveError}
      />
    </div>
  );
};

function ProgramsSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading programs">
      <div className="space-y-2">
        <div className="skeleton-shimmer h-8 w-32 rounded-lg" />
        <div className="skeleton-shimmer h-4 w-80 rounded" />
      </div>
      <div className="space-y-px overflow-hidden rounded-xl border border-white/60 bg-white/80 shadow-sm">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-white/60 px-4 py-4">
            <div className="skeleton-shimmer h-4 w-48 rounded" />
            <div className="skeleton-shimmer h-5 w-16 rounded-full" />
            <div className="skeleton-shimmer h-4 w-10 rounded" />
            <div className="skeleton-shimmer h-4 w-10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}