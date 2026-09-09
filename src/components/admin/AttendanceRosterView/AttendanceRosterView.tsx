"use client";

import { useState } from "react";
import { ArrowLeft, History, Save, WifiOff } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminPageHeader } from "@/components/admin";
import { Button, ErrorState, LoadingSpinner } from "@/components/ui";
import { useAttendanceRoster, useConnectivity, useSaveAttendanceRoster } from "@/hooks";
import { formatDateTime } from "@/lib/utils";
import type { AttendanceStatus } from "@/lib/types";

const STATUS_OPTIONS: Array<{ value: AttendanceStatus; label: string }> = [
  { value: "PRESENT", label: "Present" },
  { value: "ABSENT", label: "Absent" },
  { value: "EXCUSED", label: "Excused" },
];

export const AttendanceRosterView = () => {
  const params = useParams<{ meetingId: string }>();
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useAttendanceRoster(params.meetingId);
  const saveMutation = useSaveAttendanceRoster();

  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner label="Loading roster..." />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <ErrorState
          title="Could not load roster"
          message="We couldn't load the attendance roster for this meeting."
          onRetry={() => refetch()}
        />
        <Link
          href="/admin/attendance"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to attendance
        </Link>
      </div>
    );
  }

  const roster = data;

  const current = (scholarId: string): AttendanceStatus =>
    statuses[scholarId] ??
    roster.scholars.find((s) => s.scholarId === scholarId)?.attendance ??
    "PRESENT";

  const dirtyCount = roster.scholars.filter(
    (s) => (statuses[s.scholarId] ?? s.attendance) !== s.attendance
  ).length;

  const setStatus = (scholarId: string, value: AttendanceStatus) => {
    setSaved(false);
    setStatuses((prev) => {
      if ((prev[scholarId] ?? roster.scholars.find((s) => s.scholarId === scholarId)?.attendance) === value) {
        const next = { ...prev };
        delete next[scholarId];
        return next;
      }
      return { ...prev, [scholarId]: value };
    });
  };

  const handleSave = async () => {
    setSubmitError(null);
    try {
      await saveMutation.mutateAsync({
        meetingId: roster.meetingId,
        records: roster.scholars.map((s) => ({
          scholarId: s.scholarId,
          attendance: current(s.scholarId),
        })),
      });
      setStatuses({});
      setSaved(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Could not save attendance."
      );
    }
  };

  const present = roster.scholars.filter((s) => current(s.scholarId) === "PRESENT").length;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/attendance"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to attendance
      </Link>

      <AdminPageHeader
        title={roster.title}
        description={`${formatDateTime(roster.startsAt)}${roster.courseName ? ` · ${roster.courseName}` : ""}`}
        actions={
          <Link href={`/admin/attendance/${roster.meetingId}/history`}>
            <Button variant="outline">
              <History className="h-4 w-4" aria-hidden="true" />
              History
            </Button>
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-600">
        <span>
          <strong className="tabular-nums text-neutral-900">{present}</strong> present
        </span>
        <span>
          <strong className="tabular-nums text-neutral-900">{roster.scholars.length}</strong> enrolled
        </span>
        {dirtyCount > 0 ? (
          <span className="font-medium text-brand-700">
            {dirtyCount} unsaved change{dirtyCount > 1 ? "s" : ""}
          </span>
        ) : null}
        {saved ? (
          <span role="status" className="font-medium text-success-dark">
            Attendance saved.
          </span>
        ) : null}
      </div>

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Save is disabled until you reconnect.
        </div>
      ) : null}

      {submitError ? (
        <p role="alert" className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark">
          {submitError}
        </p>
      ) : null}

      <section className="glass-card rounded-2xl" aria-label="Attendance roster">
        {roster.scholars.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-neutral-500">
            No scholars are enrolled in this meeting&apos;s course yet.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {roster.scholars.map((s) => (
              <li key={s.scholarId} className="flex flex-wrap items-center gap-4 px-6 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-neutral-900">{s.name}</p>
                  {s.email ? (
                    <p className="text-xs text-neutral-500">{s.email}</p>
                  ) : null}
                </div>
                <div
                  role="radiogroup"
                  aria-label={`Attendance for ${s.name}`}
                  className="flex gap-1 rounded-lg bg-neutral-100 p-1"
                >
                  {STATUS_OPTIONS.map((opt) => {
                    const active = current(s.scholarId) === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        disabled={!isOnline}
                        onClick={() => setStatus(s.scholarId, opt.value)}
                        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 ${
                          active
                            ? opt.value === "PRESENT"
                              ? "bg-success-dark text-white"
                              : opt.value === "ABSENT"
                                ? "bg-danger text-white"
                                : "bg-warning-dark text-white"
                            : "text-neutral-500 hover:text-neutral-800"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex justify-end gap-3">
        <Button
          onClick={() => {
            setStatuses({});
            setSaved(false);
          }}
          variant="outline"
          disabled={dirtyCount === 0 || !isOnline || saveMutation.isPending}
        >
          Reset
        </Button>
        <Button
          onClick={handleSave}
          loading={saveMutation.isPending}
          disabled={!isOnline}
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Save attendance
        </Button>
      </div>
    </div>
  );
};