"use client";

import { useState } from "react";
import { Button, Modal } from "@/components/ui";
import type { ChangeRequestModalProps } from "./types";

export const ChangeRequestModal = ({
  assignment,
  open,
  onClose,
  onRequest,
  isSubmitting,
  error,
}: ChangeRequestModalProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment || !message.trim() || isSubmitting) return;
    await onRequest(assignment.id, message.trim());
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setMessage("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Request Change"
      description={
        assignment
          ? `Request changes to “${assignment.title}”. The 60-minute edit window has closed.`
          : "Request changes to this assignment."
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="change-message" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Message
          </label>
          <textarea
            id="change-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
            placeholder="Describe the changes you'd like to make…"
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
            disabled={!message.trim()}
          >
            Send Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
