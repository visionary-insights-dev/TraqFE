"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminAssignmentSchema } from "@/validators";
import { Button, ErrorState, Input, Label } from "@/components/ui";
import {
  useAdminCourses,
  useAdminMentors,
  useCreateAdminAssignment,
  usePrograms,
} from "@/hooks";
import type { AudienceType } from "@/lib/types";

const AUDIENCE_OPTIONS: Array<{
  value: AudienceType;
  label: string;
  hint: string;
}> = [
  { value: "ALL", label: "All scholars", hint: "Every active scholar in the organization." },
  { value: "PROGRAM", label: "A program", hint: "All scholars within a single program." },
  { value: "COURSE", label: "A course", hint: "Scholars enrolled in one course." },
];

export const AssignmentSetupView = () => {
  const router = useRouter();
  const createAssignment = useCreateAdminAssignment();
  const { data: programs, isLoading: programsLoading, isError: programsError } = usePrograms();
  const { data: courses, isLoading: coursesLoading } = useAdminCourses();
  const { data: mentors, isLoading: mentorsLoading } = useAdminMentors();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState<AudienceType>("ALL");
  const [programId, setProgramId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [mentorId, setMentorId] = useState("");
  const [dueAtLocal, setDueAtLocal] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const craftsAvailable = !programsLoading && !coursesLoading && !mentorsLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const dueAt = dueAtLocal ? new Date(dueAtLocal).toISOString() : "";
    const parsed = adminAssignmentSchema.safeParse({
      title,
      description,
      dueAt,
      audience,
      programId: audience === "PROGRAM" ? programId : undefined,
      courseId: audience === "COURSE" ? courseId : undefined,
      mentorId: audience === "ALL" || audience === "PROGRAM" ? mentorId : undefined,
    });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        if (issue.path.length > 0) {
          next[String(issue.path[0])] = issue.message;
        }
      }
      setFieldErrors(next);
      return;
    }
    setFieldErrors({});

    try {
      const created = await createAssignment.mutateAsync({
        title: parsed.data.title,
        description: parsed.data.description ?? "",
        dueAt: parsed.data.dueAt,
        audience: parsed.data.audience,
        courseId: parsed.data.courseId,
        programId: parsed.data.programId,
        mentorId: parsed.data.mentorId,
      });
      router.push(`/admin/assignments/${created.id}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Could not create the assignment."
      );
    }
  };

  if (programsError) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <ErrorState
          title="Could not load programs"
          message="Assignments need program and course data to be crafted."
          onRetry={() => router.refresh()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/admin/assignments"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to assignments
      </Link>

      <div className="glass-card rounded-2xl">
        <div className="border-b border-neutral-200/70 px-6 py-5">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">
            New assignment
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Crafted as a draft until you publish it to scholars.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6" noValidate>
          <Input
            id="assignment-title"
            label="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Build a landing page"
            error={fieldErrors.title}
            autoComplete="off"
          />

          <div>
            <Label htmlFor="assignment-description">Description</Label>
            <textarea
              id="assignment-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Instructions, links and expectations for the scholar."
              className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            />
          </div>

          <div>
            <Label>Who is this for?</Label>
            <div className="mt-2 space-y-2">
              {AUDIENCE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors focus-within:ring-2 focus-within:ring-brand-500 ${
                    audience === opt.value
                      ? "border-brand-500 bg-brand-50"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="audience"
                    value={opt.value}
                    checked={audience === opt.value}
                    onChange={() => {
                      setAudience(opt.value);
                      setProgramId("");
                      setCourseId("");
                      setMentorId("");
                    }}
                    className="mt-0.5 h-4 w-4 accent-brand-600"
                  />
                  <span>
                    <span className="block text-sm font-medium text-neutral-900">
                      {opt.label}
                    </span>
                    <span className="block text-xs text-neutral-500">{opt.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {!craftsAvailable ? (
            <p role="status" className="text-sm text-neutral-500">
              Loading programs, courses and mentors…
            </p>
          ) : null}

          {craftsAvailable && audience === "PROGRAM" ? (
            <div>
              <Label htmlFor="assignment-program">Program</Label>
              <select
                id="assignment-program"
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <option value="">Choose a program</option>
                {(programs ?? [])
                  .filter((p) => p.status === "ACTIVE")
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
              {fieldErrors.programId ? (
                <p role="alert" className="mt-1 text-sm text-danger">
                  {fieldErrors.programId}
                </p>
              ) : null}
            </div>
          ) : null}

          {craftsAvailable && audience === "COURSE" ? (
            <div>
              <Label htmlFor="assignment-course">Course</Label>
              <select
                id="assignment-course"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <option value="">Choose a course</option>
                {(courses ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {fieldErrors.courseId ? (
                <p role="alert" className="mt-1 text-sm text-danger">
                  {fieldErrors.courseId}
                </p>
              ) : null}
            </div>
          ) : null}

          {craftsAvailable && audience === "ALL" ? (
            <div>
              <Label htmlFor="assignment-mentor">Reviewing mentor</Label>
              <select
                id="assignment-mentor"
                value={mentorId}
                onChange={(e) => setMentorId(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <option value="">No mentor (admin reviews)</option>
                {(mentors ?? [])
                  .filter((m) => m.status === "ACTIVE")
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
              </select>
            </div>
          ) : null}

          <div>
            <Label htmlFor="assignment-due">Deadline</Label>
            <input
              id="assignment-due"
              type="datetime-local"
              value={dueAtLocal}
              onChange={(e) => setDueAtLocal(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            />
            {fieldErrors.dueAt ? (
              <p role="alert" className="mt-1 text-sm text-danger">
                {fieldErrors.dueAt}
              </p>
            ) : null}
            <p className="mt-1 text-xs text-neutral-500">
              Deadlines are mandatory and cannot be removed once set.
            </p>
          </div>

          {submitError ? (
            <p role="alert" className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark">
              {submitError}
            </p>
          ) : null}

          <div className="flex justify-end gap-3 border-t border-neutral-200/70 pt-5">
            <Link href="/admin/assignments">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              loading={createAssignment.isPending}
              disabled={!craftsAvailable}
            >
              Create assignment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};