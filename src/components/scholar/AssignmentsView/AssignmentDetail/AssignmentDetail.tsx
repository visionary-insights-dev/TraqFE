"use client";

import { CalendarClock, WifiOff, Info, CheckCircle2 } from "lucide-react";
import { Button, Modal } from "@/components/ui";
import { AssignmentStatusBadge } from "@/components/scholar/shared";
import { formatDateTime } from "@/lib/utils";
import type { Assignment } from "@/lib/types";
import type { AssignmentDetailProps } from "./types";

const canSubmit = (status: Assignment["status"]) =>
  status === "NOT_STARTED" ||
  status === "IN_PROGRESS" ||
  status === "RESUBMISSION_REQUIRED";

export const AssignmentDetail = ({
  assignment,
  open,
  onClose,
  isOffline,
  isSubmitting,
  onSubmit,
  error,
}: AssignmentDetailProps) => {
  if (!assignment) return null;

  const submitEnabled = canSubmit(assignment.status) && !isOffline;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={assignment.title}
      description={assignment.courseName}
      size="md"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <AssignmentStatusBadge status={assignment.status} />
        </div>

        <div className="glass-chip inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-neutral-700 dark:text-slate-300">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
            <CalendarClock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </span>
          <span>
            {assignment.status === "OVERDUE"
              ? "Was due"
              : "Due"}{" "}
            {formatDateTime(assignment.dueAt)}
          </span>
        </div>

        {assignment.description ? (
          <div className="rounded-2xl border border-white/40 bg-white/50 p-4 shadow-sm backdrop-blur dark:border-white/5 dark:bg-white/5">
            <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                <Info className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              Details
            </h3>
            <p className="pl-8 text-sm leading-relaxed text-neutral-600 dark:text-slate-300">
              {assignment.description}
            </p>
          </div>
        ) : null}

        {assignment.submission ? (
          <div className="glass-chip flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-success-dark dark:text-green-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            Submitted {formatDateTime(assignment.submission.submittedAt)}
          </div>
        ) : null}

        {isOffline ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl bg-warning-light/80 px-4 py-3 text-sm font-medium text-warning-dark shadow-sm dark:bg-warning/15 dark:text-amber-300"
          >
            <WifiOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              You&apos;re offline. You can&apos;t submit this assignment right
              now. Reconnect and try again.
            </span>
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl bg-danger-light/80 px-4 py-3 text-sm font-medium text-danger-dark shadow-sm dark:bg-danger/15 dark:text-red-300"
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : null}

        {submitEnabled ? (
          <p className="flex items-start gap-2 text-sm text-neutral-500 dark:text-slate-400">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Marking this as done sends it to your mentor for review.
          </p>
        ) : null}
      </div>

      <div className="flex justify-end gap-3 border-t border-white/40 dark:border-white/5 pb-1 pt-4">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Close
        </Button>
        {submitEnabled ? (
          <Button
            onClick={onSubmit}
            loading={isSubmitting}
            className="shadow-md"
          >
            Mark as Done
          </Button>
        ) : null}
      </div>
    </Modal>
  );
};