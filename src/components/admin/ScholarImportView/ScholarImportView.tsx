"use client";

import { useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, CheckCircle2, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin";
import { Button, ErrorState } from "@/components/ui";
import { useBulkImportUsers, useConnectivity, useImportJob } from "@/hooks";
import { parseCsv } from "@/lib/utils";
import type { ImportJob } from "@/lib/types";

const REQUIRED_COLUMNS = ["name", "email"];
const OPTIONAL_COLUMNS = ["phone", "course", "program"];

export const ScholarImportView = () => {
  const isOnline = useConnectivity();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importMutation = useBulkImportUsers();

  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewWarning, setPreviewWarning] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const jobQuery = useImportJob(jobId);

  const handleFile = async (file: File) => {
    setUploadError(null);
    setPreviewWarning(null);
    setRows([]);

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setUploadError("Please choose a .csv file.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError("File is larger than 20 MB. Split it into smaller files.");
      return;
    }

    const text = await file.text();
    const { headers: parsedHeaders, rows: parsedRows } = parseCsv(text);

    if (parsedHeaders.length === 0) {
      setUploadError("The CSV file appears to be empty.");
      return;
    }

    const lower = parsedHeaders.map((h) => h.trim().toLowerCase());
    const missing = REQUIRED_COLUMNS.filter((col) => !lower.includes(col));
    if (missing.length > 0) {
      setUploadError(
        `Missing required column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}.`
      );
      return;
    }

    setFileName(file.name);
    setHeaders(parsedHeaders);
    setRows(parsedRows);
    setPreviewWarning(
      parsedRows.length === 0
        ? "This file has no data rows. Nothing will be imported."
        : `${parsedRows.length} row${parsedRows.length > 1 ? "s" : ""} detected. Review the preview before importing.`
    );
  };

  const handleSubmit = async () => {
    if (!fileName || rows.length === 0) return;
    setUploadError(null);
    try {
      const job = await importMutation.mutateAsync({ fileName, rows });
      setJobId(job.id);
      setSubmitted(true);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Could not start the import."
      );
    }
  };

  const job = jobQuery.data;
  const isDone = job?.status === "COMPLETED" || job?.status === "FAILED";

  const previewHeaders = headers.slice(0, 5);
  const previewRows = rows.slice(0, 5);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/scholars"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to scholars
      </Link>

      <AdminPageHeader
        title="Import scholars from CSV"
        description="Bulk-add scholars using a CSV file. A template and job results are reviewed before anything is saved."
      />

      {!isOnline ? (
        <p
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Imports are disabled until you reconnect.
        </p>
      ) : null}

      {!submitted ? (
        <>
          <section className="glass-card rounded-2xl p-6" aria-label="CSV instructions">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Requirements
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-600">
              <li>
                Required columns:{" "}
                {REQUIRED_COLUMNS.map((c) => (
                  <code key={c} className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs">
                    {c}
                  </code>
                ))}
              </li>
              <li>
                Optional:{" "}
                {OPTIONAL_COLUMNS.map((c) => (
                  <code key={c} className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs">
                    {c}
                  </code>
                ))}
              </li>
              <li>File must be UTF-8 text, up to 20 MB.</li>
            </ul>
          </section>

          <section className="glass-card rounded-2xl p-6" aria-label="Choose file">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                  Choose file
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  {fileName ?? "Select a .csv file from your computer."}
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                aria-label="Choose a CSV file"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleFile(f);
                }}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={!isOnline}
              >
                <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
                Choose file
              </Button>
            </div>

            {uploadError ? (
              <p
                role="alert"
                className="mt-4 rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark"
              >
                {uploadError}
              </p>
            ) : null}
          </section>

          {rows.length > 0 ? (
            <section className="glass-card rounded-2xl" aria-label="Preview">
              <div className="flex items-center justify-between border-b border-neutral-200/70 px-6 py-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                  Preview
                </h2>
              </div>
              {previewWarning ? (
                <p className="mx-6 mt-4 rounded-lg bg-warning-light px-3 py-2 text-sm text-warning-dark">
                  {previewWarning}
                </p>
              ) : null}
              <div className="overflow-x-auto px-6 py-4">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr>
                      {previewHeaders.map((h) => (
                        <th
                          key={h}
                          className="border-b border-neutral-200 px-2 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, i) => (
                      <tr key={i} className="border-b border-neutral-100 last:border-0">
                        {previewHeaders.map((h) => (
                          <td key={h} className="px-2 py-2 text-neutral-700">
                            {String(row[h])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length > previewRows.length ? (
                  <p className="mt-2 text-xs text-neutral-500">
                    Showing first {previewRows.length} of {rows.length} rows.
                  </p>
                ) : null}
              </div>
              <div className="flex justify-end gap-3 border-t border-neutral-200/70 px-6 py-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setRows([]);
                    setFileName(null);
                  }}
                  disabled={importMutation.isPending}
                >
                  Clear
                </Button>
                <Button onClick={handleSubmit} loading={importMutation.isPending} disabled={rows.length === 0}>
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  Start import ({rows.length})
                </Button>
              </div>
            </section>
          ) : null}
        </>
      ) : (
        <JobStatus job={job} isError={jobQuery.isError} onRetry={() => jobQuery.refetch()} />
      )}

      {isDone ? (
        <div className="flex justify-center">
          <Link href="/admin/scholars">
            <Button>Back to scholars</Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
};

function JobStatus({
  job,
  isError,
  onRetry,
}: {
  job: ImportJob | undefined;
  isError: boolean;
  onRetry: () => void;
}) {
  if (isError || !job) {
    return (
      <ErrorState
        title="Could not check the import"
        message="We couldn't read the job status. Check back later."
        onRetry={onRetry}
      />
    );
  }

  if (job.status === "QUEUED" || job.status === "PROCESSING") {
    return (
      <section className="glass-card rounded-2xl p-8 text-center" aria-live="polite">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-600" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold text-neutral-900">Import in progress</h2>
        <p className="mt-1 text-sm text-neutral-600">
          {job.fileName} is being processed. You can leave this page.
        </p>
      </section>
    );
  }

  if (job.status === "FAILED") {
    return (
      <section className="glass-card rounded-2xl p-8 text-center" aria-live="polite">
        <AlertTriangle className="mx-auto h-8 w-8 text-danger" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold text-neutral-900">Import failed</h2>
        <p className="mt-1 text-sm text-neutral-600">
          {job.errors?.length
            ? `${job.errors.length} row${job.errors.length > 1 ? "s" : ""} had errors.`
            : "Something went wrong processing this file."}
        </p>
      </section>
    );
  }

  const failed = job.failed ?? 0;
  return (
    <section className="glass-card rounded-2xl p-8 text-center" aria-live="polite">
      <CheckCircle2 className="mx-auto h-8 w-8 text-success-dark" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-semibold text-neutral-900">Import complete</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Imported <strong className="tabular-nums">{job.imported}</strong> of{" "}
        <strong className="tabular-nums">{job.totalRows}</strong> scholars.
      </p>
      {failed > 0 ? (
        <ul className="mx-auto mt-4 max-w-md space-y-1 text-left">
          {(job.errors ?? []).slice(0, 5).map((e, i) => (
            <li
              key={i}
              className="rounded-md border border-danger-light bg-danger-light/40 px-3 py-2 text-xs text-danger-dark"
            >
              <strong>Row {e.row}:</strong> {e.email} — {e.message}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}