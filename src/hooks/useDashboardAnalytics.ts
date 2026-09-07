import { useQuery } from "@tanstack/react-query";
import { getDashboardAnalytics } from "@/lib/api/scholar";
import { queryKeys } from "./keys";

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: queryKeys.dashboardAnalytics,
    queryFn: getDashboardAnalytics,
  });
}
