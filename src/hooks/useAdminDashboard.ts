import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "@/lib/api/admin";
import { queryKeys } from "./keys";

export function useAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.adminDashboard,
    queryFn: getAdminDashboard,
  });
}