import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveMeeting,
  createMeeting,
  getAdminMeetings,
  updateMeeting,
} from "@/lib/api/admin";
import { getOrgsCourses } from "@/lib/api/mentor";
import type { MeetingInput } from "@/lib/types";
import { queryKeys } from "./keys";

export function useAdminMeetings() {
  return useQuery({
    queryKey: queryKeys.adminMeetings,
    queryFn: getAdminMeetings,
  });
}

export function useAdminCreateMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: MeetingInput) => createMeeting(input),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminMeetings });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
    },
  });
}

export function useAdminUpdateMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ meetingId, input }: { meetingId: string; input: MeetingInput }) =>
      updateMeeting(meetingId, input),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminMeetings });
    },
  });
}

export function useAdminArchiveMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (meetingId: string) => archiveMeeting(meetingId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminMeetings });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
    },
  });
}

export function useAdminCoursesForSelect() {
  return useQuery({
    queryKey: queryKeys.mentorCourses,
    queryFn: getOrgsCourses,
  });
}