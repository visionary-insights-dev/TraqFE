"use client";

import { AlertTriangle } from "lucide-react";
import { Button, Modal } from "@/components/ui";
import type { ArchiveCourseModalProps } from "./types";

export const ArchiveCourseModal = ({
  course,
  open,
  onClose,
  onConfirm,
  isSubmitting,
  error,
}: ArchiveCourseModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Archive this course?"
      description="This can't be undone from the active list."
      size="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg bg-warning-light p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning-dark" aria-hidden="true" />
          <p className="text-sm text-warning-dark">
            <strong>Historical data is preserved.</strong> Assignments, scholars
            and attendance stay intact — the course is only hidden from active
            lists.
          </p>
        </div>
        <p className="text-sm text-neutral-600">
          Are you sure you want to archive{" "}
          <strong className="text-neutral-900">{course?.name}</strong>?
        </p>

        {error ? (
          <p role="alert" className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark">
            {error}
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm} loading={isSubmitting}>
            Archive course
          </Button>
        </div>
      </div>
    </Modal>
  );
};