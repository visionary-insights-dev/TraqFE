"use client";

import { useState } from "react";
import { ArrowLeft, Save, WifiOff } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin";
import { Button, Checkbox, ErrorState, LoadingSpinner } from "@/components/ui";
import { useConnectivity, useOrgSettings, useUpdateOrgSettings } from "@/hooks";

export const AttendanceSettingsView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useOrgSettings();
  const updateMutation = useUpdateOrgSettings();

  const [excusedAllowed, setExcusedAllowed] = useState<boolean | null>(null);
  const [requireExcuseReason, setRequireExcuseReason] = useState<boolean | null>(null);
  const [reminderHours, setReminderHours] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSubmitError(null);
    setSaved(false);
    try {
      await updateMutation.mutateAsync({
        assignmentWeight: data.assignmentWeight,
        attendanceWeight: data.attendanceWeight,
        atRisk: data.atRisk,
        lateSubmissionPenaltyPct: data.lateSubmissionPenaltyPct,
        assignmentEditWindowMinutes: data.assignmentEditWindowMinutes,
        attendance: {
          excusedAllowed:
            excusedAllowed ?? data.attendance.excusedAllowed,
          requireExcuseReason:
            requireExcuseReason ?? data.attendance.requireExcuseReason,
          reminderHoursBefore: reminderHours ?? data.attendance.reminderHoursBefore,
        },
      });
      setSaved(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Could not save attendance settings."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner label="Loading attendance settings..." />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Attendance settings"
          description="Excuse rules and reminders for attendance."
        />
        <ErrorState
          title="Could not load settings"
          message="Something went wrong while loading settings. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const canExcuse = excusedAllowed ?? data.attendance.excusedAllowed;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/admin/settings"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to settings
      </Link>

      <AdminPageHeader
        title="Attendance settings"
        description="Excuse rules and reminders for attendance."
      />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Settings can&apos;t be saved right now.
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <section className="glass-card rounded-2xl p-6" aria-label="Excuse rules">
          <h2 className="text-base font-semibold text-neutral-900">Excused attendance</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Excused absences are excluded from attendance-rate calculations.
          </p>
          <div className="mt-4 space-y-4">
            <Checkbox
              id="excuse-allowed"
              checked={canExcuse}
              onChange={(e) => {
                setSaved(false);
                setExcusedAllowed(e.target.checked);
              }}
              label="Allow scholars to be marked excused"
            />
            <Checkbox
              id="excuse-reason"
              checked={requireExcuseReason ?? data.attendance.requireExcuseReason}
              onChange={(e) => {
                setSaved(false);
                setRequireExcuseReason(e.target.checked);
              }}
              disabled={!canExcuse}
              label="Require a reason when excusing"
            />
          </div>
        </section>

        <section className="glass-card rounded-2xl p-6" aria-label="Reminders">
          <h2 className="text-base font-semibold text-neutral-900">Reminders</h2>
          <div>
            <label htmlFor="reminder-hours" className="text-sm font-medium text-neutral-700">
              Remind scholars this many hours before a meeting
            </label>
            <input
              id="reminder-hours"
              type="number"
              min={1}
              value={reminderHours ?? data.attendance.reminderHoursBefore}
              onChange={(e) => {
                setSaved(false);
                const n = e.target.valueAsNumber;
                setReminderHours(Number.isNaN(n) ? 1 : n);
              }}
              className="mt-1.5 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            />
          </div>
        </section>

        {submitError ? (
          <p role="alert" className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark">
            {submitError}
          </p>
        ) : null}

        <div className="flex items-center justify-end gap-3">
          {saved ? (
            <span role="status" className="text-sm font-medium text-success-dark">
              Attendance settings saved.
            </span>
          ) : null}
          <Button type="submit" loading={updateMutation.isPending} disabled={!isOnline}>
            <Save className="h-4 w-4" aria-hidden="true" />
            Save settings
          </Button>
        </div>
      </form>
    </div>
  );
};