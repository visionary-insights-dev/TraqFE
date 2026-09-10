"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, AlarmClock, Send, WifiOff } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminPageHeader } from "@/components/admin";
import { Badge, Button, ErrorState, LoadingSpinner } from "@/components/ui";
import {
  useAdminAssignment,
  useConnectivity,
  usePublishAdminAssignment,
} from "@/hooks";
import { formatDateTime } from "@/lib/utils";
import { getEditWindowInfo } from "@/lib/utils/assignmentEditWindow";

export const AssignmentDetailView = () => {
  const params = useParams<{ id: string }>();
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useAdminAssignment(params.id);
  const publishMutation = usePublishAdminAssignment();
  const [publishError, setPublishError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner label="Loading assignment..." />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <ErrorState
          title="Could not load assignment"
          message="We couldn't find this assignment. It may have been removed."
          onRetry={() => refetch()}
        />
        <Link
          href="/admin/assignments"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to assignments
        </Link>
      </div>
    );
  }

  const a = data;
  const editWindow = getEditWindowInfo({
    publishedAt: a.publishedAt,
    now: new Date(now),
  });

  const handlePublish = async () => {
    setPublishError(null);
    try {
      await publishMutation.mutateAsync(a.id);
    } catch (err) {
      setPublishError(
        err instanceof Error ? err.message : "Could not publish the assignment."
      );
    }
  };

  const stats = a.submissionStats;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/assignments"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to assignments
      </Link>

      <AdminPageHeader
        title={a.title}
        description={
          a.published
            ? `Published ${formatDateTime(a.publishedAt ?? "")}`
            : "This assignment is still a draft."
        }
        actions={[
          a.published ? (
            <Badge key="badge" variant="green">
              Published
            </Badge>
          ) : null,
          !a.published ? (
            <Button
              key="publish"
              onClick={handlePublish}
              loading={publishMutation.isPending}
              disabled={!isOnline}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Publish now
            </Button>
          ) : null,
        ].filter(Boolean)}
      />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Changes can&apos;t be saved right now.
        </div>
      ) : null}

      {a.published && editWindow.editable ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-brand-700 shadow-sm"
          aria-live="polite"
        >
          <AlarmClock className="h-4 w-4 shrink-0" aria-hidden="true" />
          Scholars can still see changes for {editWindow.remainingLabel}.
        </div>
      ) : null}

      {publishError ? (
        <p
          role="alert"
          className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark"
        >
          {publishError}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="glass-card rounded-2xl p-6" aria-label="Assignment details">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Details
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row
              dt="Audience"
              dd={
                a.audience === "ALL"
                  ? "All scholars"
                  : a.audience === "COURSE"
                    ? a.courseName ?? a.courseId ?? "A course"
                    : a.programName ?? "A program"
              }
            />
            <Row dt="Deadline" dd={formatDateTime(a.dueAt)} />
            <Row dt="Program" dd={a.programName ?? "—"} />
            <Row
              dt="Mentor"
              dd={
                a.mentor
                  ? a.mentor.name
                  : "Admin reviews"
              }
            />
          </dl>
        </section>

        <div className="space-y-6 lg:col-span-2">
          <section className="glass-card rounded-2xl p-6" aria-label="Submission stats">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Submission status
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatPill label="Submitted" value={stats.submitted} tone="text-neutral-900" />
              <StatPill label="Verified" value={stats.verified} tone="text-success-dark" />
              <StatPill label="Pending" value={stats.pending} tone="text-warning-dark" />
              <StatPill
                label="Changes requested"
                value={stats.resubmissionRequired}
                tone="text-secondary-800"
              />
              <StatPill label="Overdue" value={stats.overdue} tone="text-danger-dark" />
              <StatPill label="Total" value={stats.total} tone="text-neutral-900" />
            </div>
            {stats.pending > 0 ? (
              <div className="mt-4">
                <Link href="/admin/assignments/verification">
                  <Button variant="outline" size="sm">
                    Review {stats.pending} pending submissions
                  </Button>
                </Link>
              </div>
            ) : null}
          </section>

          <section className="glass-card rounded-2xl p-6" aria-label="Instructions">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Instructions
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm text-neutral-700">
              {a.description || "No instructions provided."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

function Row({ dt, dd }: { dt: string; dd: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-neutral-500">{dt}</dt>
      <dd className="text-right font-medium text-neutral-900">{dd}</dd>
    </div>
  );
}

function StatPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-200/70 bg-white/60 p-3">
      <p className={`text-2xl font-bold tabular-nums ${tone}`}>{value}</p>
      <p className="mt-1 text-xs text-neutral-500">{label}</p>
    </div>
  );
}