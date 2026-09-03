"use client";

import { useMemo, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button, Label, Modal } from "@/components/ui";
import type { ResourceType } from "@/lib/types";
import { MAX_FILE_SIZE, type UploadResourceModalProps } from "./types";

const TYPE_OPTIONS: Array<{ value: ResourceType; label: string }> = [
  { value: "PDF", label: "PDF" },
  { value: "LINK", label: "Link" },
  { value: "FILE", label: "File" },
  { value: "VIDEO", label: "Video" },
];

export const UploadResourceModal = ({
  open,
  onClose,
  onUpload,
  courses,
  isSubmitting,
  error,
}: UploadResourceModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<ResourceType>("PDF");
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [sizeError, setSizeError] = useState<string | null>(null);

  const isLink = type === "LINK";
  const canSubmit =
    (isLink ? title.trim().length > 0 : file !== null) &&
    !sizeError &&
    title.trim().length > 0;

  const fileMeta = useMemo(() => {
    if (!file) return null;
    return {
      name: file.name,
      size: file.size,
    };
  }, [file]);

  const handleFileChange = (selected: File | null) => {
    setSizeError(null);
    if (!selected) {
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setSizeError("File is over the 20 MB limit.");
      setFile(null);
      return;
    }
    setFile(selected);
    if (!title.trim()) {
      setTitle(selected.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;
    if (isLink) {
      await onUpload({
        name: title.trim(),
        type,
        courseId: courseId || undefined,
        url: title.trim(),
      });
    } else if (file) {
      await onUpload({
        name: title.trim(),
        type,
        courseId: courseId || undefined,
        file,
      });
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setFile(null);
    setTitle("");
    setCourseId("");
    setType("PDF");
    setSizeError(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Upload Resource"
      description="Add a resource your scholars can access. Max 20 MB."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="upload-type">Type</Label>
          <div
            role="group"
            aria-label="Resource type"
            className="mt-1.5 flex flex-wrap gap-2"
          >
            {TYPE_OPTIONS.map((opt) => {
              const active = type === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setType(opt.value)}
                  className={`inline-flex min-h-[44px] items-center rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                    active
                      ? "bg-brand-600 text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {isLink ? (
          <div>
            <Label htmlFor="upload-title" required>
              Link URL
            </Label>
            <input
              id="upload-title"
              type="url"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="https://example.com/resource"
              className="mt-1.5 h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="upload-file" required>
              File
            </Label>
            <input
              ref={inputRef}
              id="upload-file"
              type="file"
              className="sr-only"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-1.5 flex min-h-[88px] w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50/60 text-neutral-600 transition-colors hover:border-brand-400 hover:bg-brand-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <UploadCloud className="h-6 w-6" aria-hidden="true" />
              <span className="text-sm font-medium">
                {fileMeta ? fileMeta.name : "Choose a file to upload"}
              </span>
              {fileMeta ? (
                <span className="text-xs text-neutral-500">
                  {(fileMeta.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              ) : null}
            </button>
            {sizeError ? (
              <p
                role="alert"
                className="mt-1.5 text-sm text-danger-dark"
              >
                {sizeError}
              </p>
            ) : null}
          </div>
        )}

        {!isLink ? (
          <div>
            <Label htmlFor="upload-name">Name</Label>
            <input
              id="upload-name"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resource name"
              className="mt-1.5 h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            />
          </div>
        ) : null}

        <div>
          <Label htmlFor="upload-course">Course (optional)</Label>
          <select
            id="upload-course"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <option value="">Any course</option>
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
            Upload
          </Button>
        </div>
      </form>
    </Modal>
  );
};
