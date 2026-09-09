"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  WifiOff,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminAvatar, AdminPageHeader } from "@/components/admin";
import { AssignmentStatusBadge } from "@/components/scholar/shared";
import { Badge, Button, ErrorState, LoadingSpinner, Modal } from "@/components/ui";
import {
  useAdminOverrideSubmission,
  useAdminRequestResubmission,
  useAdminVerifySubmission,
  useConnectivity,
  useSubmissionDetail,
} from "@/hooks";
import { formatDateTime, relativeTime } from "@/lib/utils";
import type { AssignmentStatus, OverrideStatus } from "@/lib/types";

type ActionKind = "verify" | "resubmit" | "override";

const OVERRIDE_OPTIONS: Array<{ value: OverrideStatus; label: string }> = [
  { value: "VERIFIED", label: "Verified" },
  { value: "VERIFIED_LATE", label: "Verified (late)" },
  { value: "RESUBMISSION_REQUIRED", label: "Changes requested" },
];

export const SubmissionDetailView = () => {
  const params = useParams<{ assignmentId: string; submissionId: string }>();
  const isOnline = useConnectivity();
  const { data, isLoading, isError, refetch } = useSubmissionDetail(
    params.assignmentId,
    params.submissionId
  );

  const verifyMutation = useAdminVerifySubmission(params.assignmentId, params.submissionId);
  const resubmitMutation = useAdminRequestResubmission(params.assignmentId, params.submissionId);
  const overrideMutation = useAdminOverrideSubmission(params.assignmentId, params.submissionId);

  const [action, setAction] = useState<ActionKind | null>(null);
  const [comment, setComment] = useState("");
  const [overrideStatus, setOverrideStatus] = useState<OverrideStatus>("VERIFIED");
  const [actionError, setActionError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner label="Loading submission..." />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <ErrorState
          title="Could not load submission"
          message="We couldn't find this submission. It may have been moved."
          onRetry={() => refetch()}
        />
        <Link
          href="/admin/assignments/verification"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to verification queue
        </Link>
      </div>
    );
  }

  const s = data;
  const busy =
    verifyMutation.isPending || resubmitMutation.isPending || overrideMutation.isPending;

  const handleConfirm = async () => {
    setActionError(null);
    try {
      if (action === "verify") {
        await verifyMutation.mutateAsync({ submissionId: s.id, comment: comment || undefined });
      } else if (action === "resubmit") {
        await resubmitMutation.mutateAsync({
          submissionId: s.id,
          comment: comment || undefined,
        });
      } else if (action === "override") {
        await overrideMutation.mutateAsync({
          submissionId: s.id,
          status: overrideStatus,
          comment: comment || undefined,
        });
      }
      setAction(null);
      setComment("");
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Could not save this action. Please try again."
      );
    }
  };

  const isResolved = s.status === "VERIFIED" || s.status === "VERIFIED_LATE";

  return (
    <div className="space-y-6">
      <Link
        href="/admin/assignments/verification"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to verification queue
      </Link>

      <AdminPageHeader
        title={s.assignment.title}
        description={`Submission review for ${s.assignment.title}`}
        actions={[
          <AssignmentStatusBadge key="status" status={s.status} />,
          s.late ? (
            <Badge key="late" variant="amber">
              Late submission
            </Badge>
          ) : null,
        ].filter(Boolean)}
      />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Actions are disabled.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="glass-card rounded-2xl p-6" aria-label="Submission">
          <div className="flex items-center gap-3">
            <AdminAvatar name={s.scholarName} />
            <div>
              <p className="font-medium text-neutral-900 no-underline">{s.scholarName}</p>
              {s.courseName ? (
                <p className="text-xs text-neutral-500">{s.courseName}</p>
              ) : null}
            </div>
          </div>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-neutral-500">Submitted</dt>
              <dd className="text-right font-medium text-neutral-900">
                {formatDateTime(s.submittedAt)}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-neutral-500">Due</dt>
              <dd className="text-right font-medium text-neutral-900">
                {formatDateTime(s.assignment.dueAt)}
              </dd>
            </div>
            {s.creditPct !== undefined ? (
              <div className="flex items-start justify-between gap-4">
                <dt className="text-neutral-500">Credit</dt>
                <dd className="text-right font-medium text-neutral-900">
                  {Math.round(s.creditPct)}%
                </dd>
              </div>
            ) : null}
          </dl>

          {s.submissionUrl ? (
            <a
              href={s.submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Open submission
            </a>
          ) : (
            <p className="mt-5 text-sm text-neutral-500">No submission link provided.</p>
          )}

          {s.scholarComment ? (
            <div className="mt-5 rounded-lg bg-neutral-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Scholar note
              </p>
              <p className="mt-1.5 text-sm text-neutral-700">{s.scholarComment}</p>
            </div>
          ) : null}

          {!isResolved && isOnline ? (
            <div className="mt-6 space-y-2 border-t border-neutral-100 pt-5">
              <Button
                className="w-full"
                onClick={() => setAction("verify")}
                disabled={busy}
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Approve &amp; verify
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setAction("resubmit")}
                disabled={busy}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Request changes
              </Button>
              <Button
                className="w-full"
                variant="ghost"
                onClick={() => setAction("override")}
                disabled={busy}
              >
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Override status
              </Button>
            </div>
          ) : null}
        </section>

        <div className="space-y-6 lg:col-span-2">
          <section className="glass-card rounded-2xl p-6" aria-label="History">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Status history
            </h2>
            {s.history.length === 0 ? (
              <p className="py-6 text-center text-sm text-neutral-500">No history yet.</p>
            ) : (
              <ol className="mt-4 space-y-0">
                {[...s.history].reverse().map((h, i, arr) => (
                  <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < arr.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="absolute left-[5px] top-4 h-full w-px bg-neutral-200"
                      />
                    ) : null}
                    <span
                      aria-hidden="true"
                      className="relative mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-brand-500 bg-white"
                    />
                    <div className="-mt-0.5">
                      <p className="text-sm text-neutral-700">
                        {statusLabels[h.status]}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {relativeTime(h.at)}
                        {h.by ? ` · by ${h.by}` : ""}
                      </p>
                      {h.note ? (
                        <p className="mt-1 rounded-md bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
                          {h.note}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>

      <ActionModal
        open={action !== null}
        kind={action}
        comment={comment}
        onCommentChange={setComment}
        overrideStatus={overrideStatus}
        onOverrideStatusChange={setOverrideStatus}
        error={actionError}
        isSubmitting={busy}
        onCancel={() => setAction(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

const statusLabels: Record<AssignmentStatus, string> = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "In progress",
  PENDING_VERIFICATION: "Submitted",
  VERIFIED: "Verified",
  VERIFIED_LATE: "Verified (late)",
  RESUBMISSION_REQUIRED: "Changes requested",
  OVERDUE: "Overdue",
};

function ActionModal({
  open,
  kind,
  comment,
  onCommentChange,
  overrideStatus,
  onOverrideStatusChange,
  error,
  isSubmitting,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  kind: ActionKind | null;
  comment: string;
  onCommentChange: (value: string) => void;
  overrideStatus: OverrideStatus;
  onOverrideStatusChange: (value: OverrideStatus) => void;
  error: string | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const COPY: Record<ActionKind, { title: string; description: string; confirmLabel: string }> = {
    verify: {
      title: "Approve this submission?",
      description: "The scholar will be credited with this assignment.",
      confirmLabel: "Approve & verify",
    },
    resubmit: {
      title: "Request changes?",
      description: "The scholar will be asked to resubmit. Add a note explaining what to change.",
      confirmLabel: "Request changes",
    },
    override: {
      title: "Override status",
      description: "Manually force a status on this submission, bypassing the queue.",
      confirmLabel: "Save override",
    },
  };

  const copy = kind ? COPY[kind] : null;

  return (
    <Modal open={open} onClose={onCancel} title={copy?.title ?? ""} description={copy?.description ?? ""} size="sm">
      <div className="space-y-4">
        {kind === "override" ? (
          <div>
            <label htmlFor="override-status" className="text-sm font-medium text-neutral-700">
              New status
            </label>
            <select
              id="override-status"
              value={overrideStatus}
              onChange={(e) => onOverrideStatusChange(e.target.value as OverrideStatus)}
              className="mt-1.5 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {OVERRIDE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <label htmlFor="action-comment" className="text-sm font-medium text-neutral-700">
            Comment {kind === "resubmit" ? "(recommended)" : "(optional)"}
          </label>
          <textarea
            id="action-comment"
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            rows={3}
            placeholder="Visible to the scholar…"
            className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </div>

        {error ? (
          <p role="alert" className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark">
            {error}
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} loading={isSubmitting}>
            {copy?.confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}