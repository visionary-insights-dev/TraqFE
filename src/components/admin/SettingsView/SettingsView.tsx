"use client";

import { useState } from "react";
import { CalendarClock, Save, WifiOff } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin";
import { Button, ErrorState, LoadingSpinner } from "@/components/ui";
import { orgSettingsSchema } from "@/validators";
import { useConnectivity, useOrgSettings, useUpdateOrgSettings } from "@/hooks";
import type { OrgSettings } from "@/lib/types";

export const SettingsView = () => {
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useOrgSettings();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner label="Loading settings..." />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Organization settings"
          description="Configure progress, at-risk and penalty rules."
        />
        <ErrorState
          title="Could not load settings"
          message="Something went wrong while loading settings. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return <SettingsForm key={data.assignmentWeight + data.attendanceWeight} settings={data} isOnline={isOnline} />;
};

function SettingsForm({
  settings,
  isOnline,
}: {
  settings: OrgSettings;
  isOnline: boolean;
}) {
  const updateMutation = useUpdateOrgSettings();
  const [form, setForm] = useState<OrgSettingsFormState>(() => ({
    assignmentWeight: settings.assignmentWeight,
    attendanceWeight: settings.attendanceWeight,
    atRisk: { ...settings.atRisk },
    lateSubmissionPenaltyPct: settings.lateSubmissionPenaltyPct,
    assignmentEditWindowMinutes: settings.assignmentEditWindowMinutes,
  }));
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof OrgSettingsFormState>(key: K, value: OrgSettingsFormState[K]) => {
    setSaved(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const weightsSum = form.assignmentWeight + form.attendanceWeight;
  const weightsValid = weightsSum === 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const parsed = orgSettingsSchema.safeParse({
      ...form,
      attendance: {
        excusedAllowed: settings.attendance.excusedAllowed,
        requireExcuseReason: settings.attendance.requireExcuseReason,
        reminderHoursBefore: settings.attendance.reminderHoursBefore,
      },
    });

    if (!parsed.success) {
      setSubmitError(
        "Assignment and attendance weights must add up to exactly 100%."
      );
      return;
    }

    try {
      await updateMutation.mutateAsync(parsed.data);
      setSaved(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Could not save settings."
      );
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="Organization settings"
        description="Configure progress, at-risk and penalty rules. Changes apply immediately."
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
        <section className="glass-card rounded-2xl p-6" aria-label="Progress weights">
          <h2 className="text-base font-semibold text-neutral-900">Progress calculation</h2>
          <p className="mt-1 text-sm text-neutral-500">
            How overall progress is weighted between assignments and attendance.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <NumericInput
              id="weight-assignment"
              label="Assignment weight (%)"
              value={form.assignmentWeight}
              onChange={(n) => set("assignmentWeight", n)}
              aria-invalid={!weightsValid}
            />
            <NumericInput
              id="weight-attendance"
              label="Attendance weight (%)"
              value={form.attendanceWeight}
              onChange={(n) => set("attendanceWeight", n)}
              aria-invalid={!weightsValid}
            />
          </div>
          <p
            className={`mt-3 text-sm font-medium ${
              weightsValid ? "text-success-dark" : "text-danger"
            }`}
            aria-live="polite"
          >
            Current sum: {weightsSum}% {weightsValid ? "· valid" : "· must equal 100%"}
          </p>
        </section>

        <section className="glass-card rounded-2xl p-6" aria-label="At-risk thresholds">
          <h2 className="text-base font-semibold text-neutral-900">At-risk flags</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Scholars below these levels are flagged as at risk on the dashboard.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <NumericInput
              id="atrisk-attendance"
              label="Min attendance (%)"
              value={form.atRisk.attendancePct}
              onChange={(n) => set("atRisk", { ...form.atRisk, attendancePct: n })}
            />
            <NumericInput
              id="atrisk-assignment"
              label="Min assignments (%)"
              value={form.atRisk.assignmentPct}
              onChange={(n) => set("atRisk", { ...form.atRisk, assignmentPct: n })}
            />
            <NumericInput
              id="atrisk-overdue"
              label="Max overdue before flag"
              value={form.atRisk.overdueCount}
              onChange={(n) => set("atRisk", { ...form.atRisk, overdueCount: n })}
            />
          </div>
        </section>

        <section className="glass-card rounded-2xl p-6" aria-label="Penalties and windows">
          <h2 className="text-base font-semibold text-neutral-900">Penalties & windows</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <NumericInput
              id="penalty-late"
              label="Late submission credit penalty (%)"
              value={form.lateSubmissionPenaltyPct}
              onChange={(n) => set("lateSubmissionPenaltyPct", n)}
              helperText="Deducted from credit for late submissions."
            />
            <NumericInput
              id="edit-window"
              label="Assignment edit window (minutes)"
              value={form.assignmentEditWindowMinutes}
              onChange={(n) => set("assignmentEditWindowMinutes", n)}
              helperText="How long changes can be made after publish."
            />
          </div>

          <div className="mt-5">
            <Link
              href="/admin/settings/attendance"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
            >
              <CalendarClock className="h-4 w-4" aria-hidden="true" />
              Attendance rules and reminders
            </Link>
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
              Settings saved.
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
}

function NumericInput({
  id,
  label,
  value,
  onChange,
  helperText,
  "aria-invalid": ariaInvalid,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  helperText?: string;
  "aria-invalid"?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={0}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const n = e.target.valueAsNumber;
          onChange(Number.isNaN(n) ? 0 : n);
        }}
        aria-invalid={ariaInvalid}
        className="mt-1.5 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 aria-invalid:border-danger"
      />
      {helperText ? (
        <p className="mt-1 text-xs text-neutral-500">{helperText}</p>
      ) : null}
    </div>
  );
}

interface OrgSettingsFormState {
  assignmentWeight: number;
  attendanceWeight: number;
  atRisk: { attendancePct: number; assignmentPct: number; overdueCount: number };
  lateSubmissionPenaltyPct: number;
  assignmentEditWindowMinutes: number;
}