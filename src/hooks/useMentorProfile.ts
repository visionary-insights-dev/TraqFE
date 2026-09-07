import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getMentorProfile, updateMentorProfile } from "@/lib/api/mentor";
import type { ProfileUpdateInput } from "@/lib/types";
import { queryKeys } from "./keys";

export function useMentorProfile() {
  return useQuery({
    queryKey: queryKeys.mentorProfile,
    queryFn: getMentorProfile,
  });
}

export function useUpdateMentorProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProfileUpdateInput) => updateMentorProfile(input),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.mentorProfile, data);
    },
  });
}
