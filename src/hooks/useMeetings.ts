import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMeeting,
  getMeetings,
  getOrgsCourses,
  saveAttendance,
} from "@/lib/api/mentor";
import type { AttendanceRosterInput, MeetingInput } from "@/lib/types";
import { queryKeys } from "./keys";

export function useMeetings() {
  return useQuery({
    queryKey: queryKeys.meetings,
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
      queryClient.setQueryData(queryKeys.meetings, (old: unknown) =>
        Array.isArray(old) ? [...old, created] : old
      );
    },
  });
}

export function useSaveAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AttendanceRosterInput) => saveAttendance(input),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorScholars });
    },
  });
}
