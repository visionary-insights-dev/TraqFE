import { useQuery } from "@tanstack/react-query";
import { getDashboardAnalytics } from "@/lib/api/scholar";
import { queryKeys } from "../keys";

export function useScholarDashboard() {
  return useQuery({
    queryKey: queryKeys.scholarDashboard,
    queryFn: getDashboardAnalytics,
  });
}