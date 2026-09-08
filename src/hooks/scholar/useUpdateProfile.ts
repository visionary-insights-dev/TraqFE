import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/lib/api/scholar";
import type { ProfileUpdateInput } from "@/lib/types";
import { queryKeys } from "../keys";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProfileUpdateInput) => updateProfile(input),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.userProfile, data);
    },
  });
}