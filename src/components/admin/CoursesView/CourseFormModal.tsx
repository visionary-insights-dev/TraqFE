"use client";

import { useState } from "react";
import { Button, Input, Label, Modal } from "@/components/ui";
import { courseSchema } from "@/validators";
import type { CourseFormModalProps } from "./types";

export const CourseFormModal = ({
  open,
  onClose,
  programs,
  initial,
  isSubmitting,
  error,
  onSubmit,
}: CourseFormModalProps) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [programId, setProgramId] = useState(initial?.program?.id ?? "");
  const [formError, setFormError] = useState<string | null>(null);

  // Component is keyed by initial id at the call site so state resets on edit.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const parsed = courseSchema.safeParse({ name, code, programId });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Check the form and try again.");
      return;
    }
    onSubmit({
      name: parsed.data.name.trim(),
      code: parsed.data.code?.trim() || undefined,
      programId: parsed.data.programId || undefined,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit course" : "New course"}
      description={
        initial
          ? "Update the course details. Scholars and history are preserved."
          : "Create a course and link it to a program."
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          id="course-name"
          label="Course name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Frontend Engineering"
          autoComplete="off"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="course-code"
            label="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. FE-101"
            helperText="Optional short identifier"
            autoComplete="off"
          />
          <div>
            <Label htmlFor="course-program">Program</Label>
            <select
              id="course-program"
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <option value="">No program</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
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
            {initial ? "Save changes" : "Create course"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};