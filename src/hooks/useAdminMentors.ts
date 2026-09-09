import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMentorAssignment,
  getAdminMentor,
  getAdminMentors,
} from "@/lib/api/admin";
import type { MentorAssignmentInput } from "@/lib/types";
import { queryKeys } from "./keys";

export function useAdminMentors() {
  return useQuery({
    queryKey: queryKeys.adminMentors,
    queryFn: getAdminMentors,
  });
}

export function useAdminMentor(id: string) {
  return useQuery({
    queryKey: queryKeys.adminMentor(id),
    queryFn: () => getAdminMentor(id),
    enabled: id.length > 0,
  });
}

export function useCreateMentorAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: MentorAssignmentInput) => createMentorAssignment(input),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminScholars });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminMentors });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
    },
  });
}