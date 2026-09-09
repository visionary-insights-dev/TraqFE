import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMeeting,
  getMeetings,
  getOrgsCourses,
} from "@/lib/api/mentor";
import type { MeetingInput } from "@/lib/types";
import { queryKeys } from "../keys";

export function useMentorMeetings() {
  return useQuery({
    queryKey: queryKeys.mentorMeetings,
    queryFn: getMeetings,
  });
}

export function useMentorCourses() {
  return useQuery({
    queryKey: queryKeys.mentorCourses,
    queryFn: getOrgsCourses,
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: MeetingInput) => createMeeting(input),
    onSuccess: (created) => {
      queryClient.setQueryData(queryKeys.mentorMeetings, (old: unknown) =>
        Array.isArray(old) ? [...old, created] : old
      );
    },
  });
}