import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrgSettings, updateOrgSettings } from "@/lib/api/admin";
import type { OrgSettingsUpdateInput } from "@/lib/types";
import { queryKeys } from "./keys";

export function useOrgSettings() {
  return useQuery({
    queryKey: queryKeys.orgSettings,
    queryFn: getOrgSettings,
  });
}

export function useUpdateOrgSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: OrgSettingsUpdateInput) => updateOrgSettings(input),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orgSettings });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
    },
  });
}