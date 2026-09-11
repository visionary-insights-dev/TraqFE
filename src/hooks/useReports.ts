import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReport,
  downloadReport,
  getReport,
  getReports,
} from "@/lib/api/admin";
import type { Report, ReportInput } from "@/lib/types";
import { queryKeys } from "./keys";
import { useAsyncTask } from "./useAsyncTask";

export function useReports() {
  return useQuery({
    queryKey: queryKeys.reports,
    queryFn: getReports,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ReportInput) => createReport(input),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports });
    },
  });
}

/** Polls a single report until it completes or fails. */
export function useReportTask(reportId: string | null) {
  return useAsyncTask<Report>(
    reportId ? queryKeys.report(reportId) : ["admin", "reports", "none"],
    getReport,
    reportId
  );
}

/**
 * Downloads a completed report as a raw Blob. The caller is responsible for
 * triggering the save (object URL + anchor click) so it can supply a filename.
 */
export function useDownloadReport() {
  return useMutation({
    mutationFn: ({ reportId, format }: { reportId: string; format: "csv" | "pdf" }) =>
      downloadReport(reportId, format),
  });
}