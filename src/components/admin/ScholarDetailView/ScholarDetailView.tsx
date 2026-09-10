"use client";

import { useState } from "react";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminAvatar, ProgressRing } from "@/components/admin";
import { Badge, Button, ErrorState, LoadingSpinner } from "@/components/ui";
import { AssignmentStatusBadge, ProgressBar } from "@/components/scholar/shared";
import { useAdminScholar, useAdminUpdateUserStatus } from "@/hooks";
import { formatDate, formatDateTime, relativeTime } from "@/lib/utils";
import type { AttendanceStatus, AuditLogEntry, PeopleStatus } from "@/lib/types";

const ATTENDANCE_CONFIG: Record<
  AttendanceStatus,
  { label: string; variant: "green" | "red" | "amber" }
> = {
  PRESENT: { label: "Present", variant: "green" },
  ABSENT: { label: "Absent", variant: "red" },
  EXCUSED: { label: "Excused", variant: "amber" },
};

const ATTENDANCE_PILLS: Array<{
  key: "present" | "absent" | "excused";
  label: string;
  className: string;
}> = [
  { key: "present", label: "Present", className: "bg-success-light text-success-dark" },
  { key: "absent", label: "Absent", className: "bg-danger-light text-danger-dark" },
  { key: "excused", label: "Excused", className: "bg-warning-light text-warning-dark" },
];

const STATUS_CONFIG: Record<
  PeopleStatus,
  { label: string; variant: "green" | "amber" | "neutral" }
> = {
  ACTIVE: { label: "Active", variant: "green" },
  INVITED: { label: "Invited", variant: "amber" },
  SUSPENDED: { label: "Suspended", variant: "neutral" },
};

export const ScholarDetailView = () => {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useAdminScholar(params.id);
  const statusMutation = useAdminUpdateUserStatus();
  const [statusError, setStatusError] = useState<string | null>(null);

  const handleToggleStatus = async () => {
    if (!data) return;
    setStatusError(null);
    const next: PeopleStatus = data.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await statusMutation.mutateAsync({ userId: data.id, status: next });
    } catch (err) {
      setStatusError(
        err instanceof Error
          ? err.message
          : "Could not update the scholar's status."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner label="Loading scholar..." />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <ErrorState
          title="Could not load scholar"
          message="We couldn't find this scholar. They may have been removed."
          onRetry={() => refetch()}
        />
        <Link
          href="/admin/scholars"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to scholars
        </Link>
      </div>
    );
  }

  const s = data;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/scholars"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to scholars
      </Link>

      <div className="glass-card flex flex-wrap items-center gap-4 rounded-2xl px-6 py-5">
        <AdminAvatar name={s.name} avatarUrl={s.avatarUrl} className="h-14 w-14 text-lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">{s.name}</h1>
            <Badge variant={STATUS_CONFIG[s.status].variant}>
              {STATUS_CONFIG[s.status].label}
            </Badge>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              {s.email}
            </span>
            {s.phone ? (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                {s.phone}
              </span>
            ) : null}
            <span>Joined {formatDate(s.joinedAt)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {statusError ? (
            <p role="alert" className="max-w-xs text-right text-xs font-medium text-danger-dark">
              {statusError}
            </p>
          ) : null}
          {s.status !== "INVITED" ? (
            <Button
              size="sm"
              variant={s.status === "ACTIVE" ? "outline" : "primary"}
              onClick={handleToggleStatus}
              loading={statusMutation.isPending}
            >
              {s.status === "ACTIVE" ? "Suspend scholar" : "Reactivate scholar"}
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="glass-card rounded-2xl p-6" aria-label="Progress overview">
          <div className="flex items-center gap-6">
            <ProgressRing
              value={s.progress.overall}
              label={`${Math.round(s.progress.overall)}%`}
              tone="brand"
            />
            <div className="space-y-3">
              <Stat
                label={`Assignments · ${s.progress.assignmentWeight}%`}
                value={Math.round(s.progress.assignmentPct)}
              />
              <Stat
                label={`Attendance · ${s.progress.attendanceWeight}%`}
                value={Math.round(s.progress.attendancePct)}
              />
            </div>
          </div>
        </section>

        <div className="space-y-6 lg:col-span-2">
          <section className="glass-card rounded-2xl p-6" aria-label="Overview">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Overview
            </h2>
            <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Detail label="Program" value={s.programName ?? "—"} />
              <Detail label="Course" value={s.courseName ?? "—"} />
              <Detail
                label="Mentor"
                value={
                  s.mentor ? (
                    <Link
                      href={`/admin/mentors/${s.mentor.id}`}
                      className="font-medium text-brand-700 underline-offset-2 hover:underline"
                    >
                      {s.mentor.name}
                    </Link>
                  ) : (
                    <span className="text-neutral-400">Unassigned</span>
                  )
                }
              />
              <Detail
                label="Attendance rate"
                value={`${Math.round(s.attendance.rate)}% (${s.attendance.present} present)`}
              />
            </dl>
          </section>

          <section className="glass-card rounded-2xl p-6" aria-label="Attendance">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Attendance
              </h2>
              <span className="text-sm font-semibold text-neutral-700">
                {Math.round(s.attendance.rate)}%
              </span>
            </div>
            <div className="mt-3 flex gap-4">
              {ATTENDANCE_PILLS.map((p) => (
                <span
                  key={p.key}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${p.className}`}
                >
                  <span className="tabular-nums font-bold">{s.attendance[p.key]}</span>
                  {p.label}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section className="glass-card rounded-2xl" aria-label="Assignments">
        <div className="border-b border-neutral-200/70 px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Assignments
          </h2>
        </div>
        {s.assignments.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-neutral-500">
            No assignments for this scholar yet.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {s.assignments.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-neutral-900">{a.title}</p>
                  <p className="text-xs text-neutral-500">
                    {a.courseName ?? "No course"} · Due {formatDateTime(a.dueAt)}
                    {a.submittedAt ? ` · Submitted ${relativeTime(a.submittedAt)}` : ""}
                  </p>
                </div>
                {a.creditPct !== undefined ? (
                  <span className="text-sm tabular-nums text-neutral-600">
                    {Math.round(a.creditPct)}% credit
                  </span>
                ) : null}
                <AssignmentStatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="glass-card rounded-2xl" aria-label="Meetings">
        <div className="border-b border-neutral-200/70 px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Meetings
          </h2>
        </div>
        {s.meetings.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-neutral-500">
            No meetings scheduled yet.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {s.meetings.map((m) => {
              const config = m.attendance ? ATTENDANCE_CONFIG[m.attendance] : null;
              return (
                <li key={m.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-neutral-900">{m.title}</p>
                    <p className="text-xs text-neutral-500">{formatDateTime(m.startsAt)}</p>
                  </div>
                  {config ? <Badge variant={config.variant}>{config.label}</Badge> : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <AuditTrail entries={s.auditTrail} />
    </div>
  );
};

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-neutral-500">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <ProgressBar value={value} className="h-1.5 w-28" />
        <span className="text-sm font-semibold text-neutral-900">{value}%</span>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-neutral-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-neutral-900">{value}</dd>
    </div>
  );
}

function AuditTrail({ entries }: { entries: AuditLogEntry[] }) {
  return (
    <section className="glass-card rounded-2xl" aria-label="Audit trail">
      <div className="border-b border-neutral-200/70 px-6 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Audit trail
        </h2>
      </div>
      {entries.length === 0 ? (
        <p className="px-6 py-8 text-center text-sm text-neutral-500">
          No activity recorded yet.
        </p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {entries.slice(0, 8).map((e) => (
            <li key={e.id} className="flex flex-wrap items-center gap-4 px-6 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-neutral-800">{e.action}</p>
                <p className="text-xs text-neutral-500">
                  {e.actorName ?? "System"} · {relativeTime(e.at)}
                </p>
              </div>
              {e.detail ? (
                <span className="text-xs text-neutral-500">{e.detail}</span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}