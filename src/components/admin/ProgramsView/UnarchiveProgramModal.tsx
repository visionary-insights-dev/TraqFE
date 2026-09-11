"use client";

import { RotateCcw } from "lucide-react";
import { Button, Modal } from "@/components/ui";
import type { UnarchiveProgramModalProps } from "./types";

export const UnarchiveProgramModal = ({
  program,
  open,
  onClose,
  onConfirm,
  isSubmitting,
  error,
}: UnarchiveProgramModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Restore this program?"
      description="The program and its courses will reappear in active lists."
      size="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg bg-brand-50 p-4">
          <RotateCcw
            className="mt-0.5 h-5 w-5 shrink-0 text-brand-700"
            aria-hidden="true"
          />
          <p className="text-sm text-brand-800">
            Courses, scholars, assignments and attendance stay exactly as they
            are — restoring only re-enables the program.
          </p>
        </div>
        <p className="text-sm text-neutral-600">
          Are you sure you want to restore{" "}
          <strong className="text-neutral-900">{program?.name}</strong>?
        </p>

        {error ? (
          <p
            role="alert"
            className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark"
          >
            {error}
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            loading={isSubmitting}
          >
            Restore program
          </Button>
        </div>
      </div>
    </Modal>
  );
};