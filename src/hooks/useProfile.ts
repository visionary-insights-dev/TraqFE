import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getMyProfile, updateProfile } from "@/lib/api/scholar";
import type { ProfileUpdateInput } from "@/lib/types";
import { queryKeys } from "./keys";

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: getMyProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProfileUpdateInput) => updateProfile(input),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.profile, data);
    },
  });
}
