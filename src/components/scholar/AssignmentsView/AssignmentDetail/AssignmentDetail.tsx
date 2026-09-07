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

        <div className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-600">
          <CalendarClock className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {assignment.status === "OVERDUE"
              ? "Was due"
              : "Due"}{" "}
            {formatDateTime(assignment.dueAt)}
          </span>
        </div>

        {assignment.description ? (
          <div className="rounded-xl bg-neutral-50 p-4">
            <h3 className="mb-1 text-sm font-semibold text-neutral-900">
              Details
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600">
              {assignment.description}
            </p>
          </div>
        ) : null}

        {assignment.submission ? (
          <div className="flex items-center gap-2 rounded-xl bg-success-light/60 px-4 py-3 text-sm font-medium text-success-dark">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            Submitted {formatDateTime(assignment.submission.submittedAt)}
          </div>
        ) : null}

        {isOffline ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl bg-warning-light px-4 py-3 text-sm font-medium text-warning-dark"
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
            className="flex items-start gap-2 rounded-xl bg-danger-light px-4 py-3 text-sm font-medium text-danger-dark"
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : null}

        {submitEnabled ? (
          <p className="flex items-start gap-2 text-sm text-neutral-500">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Marking this as done sends it to your mentor for review.
          </p>
        ) : null}
      </div>

      <div className="flex justify-end gap-3 border-t border-neutral-200 pb-1 pt-4">
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
