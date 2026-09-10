"use client";

import { AlertTriangle } from "lucide-react";
import { Button, Modal } from "@/components/ui";
import type { ArchiveMeetingModalProps } from "./types";

export const ArchiveMeetingModal = ({
  meeting,
  open,
  onClose,
  onConfirm,
  isSubmitting,
  error,
}: ArchiveMeetingModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Archive this meeting?"
      description="This removes it from active schedules."
      size="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg bg-warning-light p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning-dark" aria-hidden="true" />
          <p className="text-sm text-warning-dark">
            <strong>Attendance history is preserved.</strong> The meeting is only
            hidden from active lists.
          </p>
        </div>
        <p className="text-sm text-neutral-600">
          Are you sure you want to archive{" "}
          <strong className="text-neutral-900">{meeting?.title}</strong>?
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
            Archive meeting
          </Button>
        </div>
      </div>
    </Modal>
  );
};