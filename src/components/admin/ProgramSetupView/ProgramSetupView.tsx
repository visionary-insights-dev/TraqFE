"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { programSchema, type ProgramFormValues } from "@/validators";
import { Button, Input, Label } from "@/components/ui";
import { useCreateProgram } from "@/hooks";

export const ProgramSetupView = () => {
  const router = useRouter();
  const createProgram = useCreateProgram();
  const [form, setForm] = useState<Omit<ProgramFormValues, "name"> & { name: string }>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(key: K, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const parsed = programSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        if (issue.path.length > 0) {
          next[String(issue.path[0])] = issue.message;
        }
      }
      setErrors(next);
      return;
    }
    setErrors({});

    try {
      await createProgram.mutateAsync({
        name: parsed.data.name.trim(),
        description: parsed.data.description?.trim() || undefined,
        startDate: parsed.data.startDate || undefined,
        endDate: parsed.data.endDate || undefined,
      });
      router.push("/admin/programs");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Could not create the program."
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/admin/programs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to programs
      </Link>

      <div className="glass-card rounded-2xl">
        <div className="border-b border-neutral-200/70 px-6 py-5">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">
            Set up a new program
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            A program groups courses, scholars and mentors under one umbrella.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6" noValidate>
          <Input
            id="program-name"
            label="Program name"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. TMF Tech Scholarship 2026"
            error={errors.name}
            autoComplete="off"
          />

          <div>
            <Label htmlFor="program-description">Description</Label>
            <textarea
              id="program-description"
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              placeholder="What is this program about?"
              className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="program-start">Start date</Label>
              <input
                id="program-start"
                type="date"
                value={form.startDate ?? ""}
                onChange={(e) => set("startDate", e.target.value)}
                className="mt-1.5 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              />
            </div>
            <div>
              <Label htmlFor="program-end">End date</Label>
              <input
                id="program-end"
                type="date"
                value={form.endDate ?? ""}
                onChange={(e) => set("endDate", e.target.value)}
                className="mt-1.5 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              />
            </div>
          </div>

          {submitError ? (
            <p
              role="alert"
              className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark"
            >
              {submitError}
            </p>
          ) : null}

          <div className="flex justify-end gap-3 border-t border-neutral-200/70 pt-5">
            <Link href="/admin/programs">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" loading={createProgram.isPending}>
              Create program
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};