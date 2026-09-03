"use client";

import { useState } from "react";
import { Button, Input, Label, Modal } from "@/components/ui";
import type { CreateAssignmentModalProps } from "./types";

export const CreateAssignmentModal = ({
  open,
  onClose,
  onCreate,
  courses,
  isSubmitting,
  error,
}: CreateAssignmentModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [courseId, setCourseId] = useState("");
  const [audience, setAudience] = useState("ALL");

  const canSubmit =
    title.trim().length > 0 &&
    dueAt.trim().length > 0 &&
    courseId.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;
    await onCreate({
      title: title.trim(),
      description: description.trim(),
      dueAt: new Date(dueAt).toISOString(),
      courseId,
      audience,
    });
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setTitle("");
    setDescription("");
    setDueAt("");
    setCourseId("");
    setAudience("ALL");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create Assignment"
      description="Fill in the details, then publish to your scholars."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Build a REST API"
        />
        <div>
          <Label htmlFor="assign-description">Description</Label>
          <textarea
            id="assign-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe the assignment…"
            className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="assign-due" required>
              Due date
            </Label>
            <input
              id="assign-due"
              type="datetime-local"
              required
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            />
          </div>
          <div>
            <Label htmlFor="assign-course" required>
              Course
            </Label>
            <select
              id="assign-course"
              required
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <option value="" disabled>
                Select a course
              </option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <Label htmlFor="assign-audience">Audience</Label>
          <select
            id="assign-audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <option value="ALL">All Scholars</option>
            <option value="COURSE">Course members</option>
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
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={!canSubmit}
          >
            Publish Assignment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
