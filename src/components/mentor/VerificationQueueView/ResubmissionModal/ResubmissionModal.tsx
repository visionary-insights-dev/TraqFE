"use client";

import { useState } from "react";
import { Button, Modal } from "@/components/ui";
import type { ResubmissionModalProps } from "./types";

export const ResubmissionModal = ({
  item,
  open,
  onClose,
  onRequest,
  isSubmitting,
  error,
}: ResubmissionModalProps) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !comment.trim() || isSubmitting) return;
    await onRequest(item, comment.trim());
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setComment("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Request Resubmission"
      description={
        item
          ? `Ask ${item.scholarName} to revise “${item.assignmentTitle}”.`
          : "Request a resubmission with feedback."
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="resubmission-comment"
            className="mb-1.5 block text-sm font-medium text-neutral-700"
          >
            Feedback
          </label>
          <textarea
            id="resubmission-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            required
            placeholder="Explain what should be revised…"
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark"
          >
            {error}
          </p>
        ) : null}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={!comment.trim()}
          >
            Send Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
