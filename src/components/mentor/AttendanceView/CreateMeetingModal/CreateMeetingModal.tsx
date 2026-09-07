"use client";

import { useState } from "react";
import { Button, Input, Label, Modal } from "@/components/ui";
import type { CreateMeetingModalProps } from "./types";

export const CreateMeetingModal = ({
  open,
  onClose,
  onCreate,
  courses,
  isSubmitting,
  error,
}: CreateMeetingModalProps) => {
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [courseId, setCourseId] = useState("");

  const canSubmit = title.trim().length > 0 && startsAt.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;
    await onCreate({
      title: title.trim(),
      startsAt: new Date(startsAt).toISOString(),
      courseId: courseId || undefined,
    });
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setTitle("");
    setStartsAt("");
    setCourseId("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create Meeting"
      description="Schedule a meeting to track attendance."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Weekly standup"
        />
        <div>
          <Label htmlFor="meeting-start" required>
            Date &amp; time
          </Label>
          <input
            id="meeting-start"
            type="datetime-local"
            required
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </div>
        <div>
          <Label htmlFor="meeting-course">Course (optional)</Label>
          <select
            id="meeting-course"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <option value="">No course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
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
          <Button type="submit" loading={isSubmitting} disabled={!canSubmit}>
            Create Meeting
          </Button>
        </div>
      </form>
    </Modal>
  );
};
