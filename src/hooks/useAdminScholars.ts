import { useQuery } from "@tanstack/react-query";
import { getAdminScholar, getAdminScholars } from "@/lib/api/admin";
import { queryKeys } from "./keys";

export function useAdminScholars() {
  return useQuery({
    queryKey: queryKeys.adminScholars,
    queryFn: getAdminScholars,
  });
}

export function useAdminScholar(id: string) {
  return useQuery({
    queryKey: queryKeys.adminScholar(id),
    queryFn: () => getAdminScholar(id),
    enabled: id.length > 0,
  });
}