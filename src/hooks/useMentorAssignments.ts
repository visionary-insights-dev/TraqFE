import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAssignment,
  getMentorAssignments,
  publishAssignment,
  requestChange,
  type CreateAssignmentInput,
} from "@/lib/api/mentor";
import type { MentorAssignment } from "@/lib/types";
import { queryKeys } from "./keys";

export function useMentorAssignments() {
  return useQuery({
    queryKey: queryKeys.mentorAssignments,
    queryFn: getMentorAssignments,
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAssignmentInput) => createAssignment(input),
    onSuccess: (created) => {
      queryClient.setQueryData<MentorAssignment[]>(
        queryKeys.mentorAssignments,
        (old) => (old ? [created, ...old] : [created])
      );
    },
  });
}

export function usePublishAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assignmentId: string) => publishAssignment(assignmentId),
    onSuccess: (updated) => {
      queryClient.setQueryData<MentorAssignment[]>(
        queryKeys.mentorAssignments,
        (old) => old?.map((a) => (a.id === updated.id ? { ...a, ...updated } : a))
      );
    },
  });
}

export function useRequestChange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { assignmentId: string; message: string }) =>
      requestChange(vars.assignmentId, vars.message),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorAssignments });
    },
  });
}
