import { useMutation } from "@tanstack/react-query";
import { bulkImportUsers, getImportJob } from "@/lib/api/admin";
import type { ImportJob } from "@/lib/types";
import { queryKeys } from "./keys";
import { useAsyncTask } from "./useAsyncTask";

export function useBulkImportUsers() {
  return useMutation({
    mutationFn: (input: {
      fileName: string;
      rows: Array<Record<string, unknown>>;
    }) => bulkImportUsers(input),
  });
}

/** Polls an import job until it completes or fails. */
export function useImportJob(jobId: string | null) {
  return useAsyncTask<ImportJob>(
    jobId ? queryKeys.importJob(jobId) : ["admin", "import", "none"],
    getImportJob,
    jobId
  );
}