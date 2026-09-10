import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "@/lib/api/admin";
import type { AuditLogFilters } from "@/lib/types";
import { queryKeys } from "./keys";

export interface UseAuditLogsParams {
  page?: number;
  limit?: number;
  filters?: AuditLogFilters;
}

export function useAuditLogs({ page = 1, limit = 25, filters }: UseAuditLogsParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.auditLogs, { page, limit, filters }] as const,
    queryFn: () => getAuditLogs({ page, limit, ...filters }),
  });
}