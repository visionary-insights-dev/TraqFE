"use client";

import { ArrowLeft, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminAvatar, DataTable, type DataTableColumn } from "@/components/admin";
import { Badge, ErrorState, LoadingSpinner } from "@/components/ui";
import { ProgressBar } from "@/components/scholar/shared";
import { useAdminMentor } from "@/hooks";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { AdminScholar } from "@/lib/types";

export const MentorDetailView = () => {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useAdminMentor(params.id);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner label="Loading mentor..." />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <ErrorState
          title="Could not load mentor"
          message="We couldn't find this mentor. They may have been removed."
          onRetry={() => refetch()}
        />
        <Link
          href="/admin/mentors"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to mentors
        </Link>
      </div>
    );
  }

  const m = data;

  const scholarColumns: Array<DataTableColumn<AdminScholar>> = [
    {
      key: "name",
      header: "Scholar",
      sortValue: (s) => s.name,
      render: (s) => (
        <div className="flex items-center gap-3">
          <AdminAvatar name={s.name} avatarUrl={s.avatarUrl} />
          <div>
            <p className="font-medium text-neutral-900">{s.name}</p>
            <p className="text-xs text-neutral-500">{s.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "course",
      header: "Course",
      sortValue: (s) => s.courseName ?? "",
      render: (s) => (
        <span className="text-neutral-600">{s.courseName ?? "—"}</span>
      ),
    },
    {
      key: "progress",
      header: "Progress",
      sortValue: (s) => s.progress.overall,
      render: (s) => (
        <div className="w-36">
          <ProgressBar value={s.progress.overall} className="h-1.5" />
          <p className="mt-1 text-xs text-neutral-500">
            {Math.round(s.progress.overall)}%
          </p>
        </div>
      ),
    },
    {
      key: "risk",
      header: "",
      render: (s) => (s.atRisk ? <Badge variant="red">At risk</Badge> : null),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (s) => (
        <Link
          href={`/admin/scholars/${s.id}`}
          aria-label={`View ${s.name}'s profile`}
          className="text-xs font-semibold text-brand-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/admin/mentors"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to mentors
      </Link>

      <div className="glass-card flex flex-wrap items-center gap-4 rounded-2xl px-6 py-5">
        <AdminAvatar name={m.name} avatarUrl={m.avatarUrl} className="h-14 w-14 text-lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">{m.name}</h1>
            <Badge variant="green">Active</Badge>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              {m.email}
            </span>
            {m.phone ? (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                {m.phone}
              </span>
            ) : null}
            <span>Joined {formatDate(m.joinedAt)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="glass-card rounded-2xl p-6" aria-label="Load summary">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Load summary
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <SummaryStat label="Scholars" value={m.scholars.length} />
            <SummaryStat label="Assignments" value={m.assignments.length} />
            <SummaryStat label="Meetings" value={m.meetings.length} />
          </div>
        </section>

        <div className="space-y-6 lg:col-span-2">
          <section className="glass-card rounded-2xl p-6" aria-label="Assignments">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Assignments
            </h2>
            {m.assignments.length === 0 ? (
              <p className="py-6 text-center text-sm text-neutral-500">
                No assignments to review.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-neutral-100">
                {m.assignments.map((a) => (
                  <li key={a.id} className="flex flex-wrap items-center gap-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-neutral-900">{a.title}</p>
                      <p className="text-xs text-neutral-500">
                        Due {formatDateTime(a.dueAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-28">
                        <ProgressBar
                          value={(a.submittedCount / Math.max(1, a.totalCount)) * 100}
                          className="h-1.5"
                        />
                        <p className="mt-1 text-right text-xs text-neutral-500">
                          {a.submittedCount}/{a.totalCount} submitted
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="glass-card rounded-2xl p-6" aria-label="Next meetings">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Next meetings
            </h2>
            {m.meetings.length === 0 ? (
              <p className="py-6 text-center text-sm text-neutral-500">
                No upcoming meetings.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-neutral-100">
                {m.meetings.map((mt) => (
                  <li key={mt.id} className="flex flex-wrap items-center gap-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-neutral-900">{mt.title}</p>
                      <p className="text-xs text-neutral-500">
                        {formatDateTime(mt.startsAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <section className="glass-card rounded-2xl" aria-label="Scholars">
        <div className="border-b border-neutral-200/70 px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Scholars ({m.scholars.length})
          </h2>
        </div>
        <DataTable<AdminScholar>
          caption="Scholars assigned to this mentor"
          rows={m.scholars}
          rowKey={(s) => s.id}
          columns={scholarColumns}
          emptyTitle="No scholars assigned"
          emptyDescription="Head to Pairing to assign scholars to this mentor."
        />
      </section>
    </div>
  );
};

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-2xl font-bold tabular-nums text-neutral-900">{value}</p>
      <p className="mt-1 text-xs text-neutral-500">{label}</p>
    </div>
  );
}