import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReport, getReport, getReports } from "@/lib/api/admin";
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