import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminScholar, getAdminScholars, updateUserStatus } from "@/lib/api/admin";
import type { PeopleStatus } from "@/lib/types";
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

export function useAdminUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: PeopleStatus }) =>
      updateUserStatus(userId, status),
    onSettled: () => {
      // Prefix match invalidates both the list and the individual scholar detail.
      queryClient.invalidateQueries({ queryKey: ["admin", "scholars"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
    },
  });
}