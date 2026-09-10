"use client";

import { useState } from "react";
import { Button, Input, Label, Modal } from "@/components/ui";
import type { MeetingFormModalProps } from "./types";

export const MeetingFormModal = ({
  open,
  onClose,
  courses,
  initial,
  isSubmitting,
  error,
  onSubmit,
}: MeetingFormModalProps) => {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [courseValue, setCourseValue] = useState(
    initial ? (courses.find((c) => c.name === initial.courseName)?.id ?? "") : ""
  );
  const [startsAtLocal, setStartsAtLocal] = useState(
    initial ? toLocalInput(initial.startsAt) : ""
  );
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (title.trim().length < 2) {
      setFormError("Meeting title is required.");
      return;
    }
    const startsAt = startsAtLocal ? new Date(startsAtLocal).toISOString() : "";
    if (!startsAt) {
      setFormError("Pick a start time for the meeting.");
      return;
    }
    onSubmit({ title: title.trim(), startsAt, courseId: courseValue || undefined });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit meeting" : "Schedule meeting"}
      description={
        initial
          ? "Update the meeting details."
          : "Create a meeting so scholars can be marked present, absent or excused."
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          id="meeting-title"
          label="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Weekly cohort sync"
          autoComplete="off"
        />
        <div>
          <Label htmlFor="meeting-course">Course</Label>
          <select
            id="meeting-course"
            value={courseValue}
            onChange={(e) => setCourseValue(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <option value="">No course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="meeting-starts">Starts at</Label>
          <input
            id="meeting-starts"
            type="datetime-local"
            value={startsAtLocal}
            onChange={(e) => setStartsAtLocal(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </div>

        {formError ? (
          <p role="alert" className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark">
            {formError}
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark">
            {error}
          </p>
        ) : null}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {initial ? "Save changes" : "Schedule meeting"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}