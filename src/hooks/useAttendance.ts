import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAttendanceHistory,
  getAttendanceOverview,
  getAttendanceRoster,
  saveAttendanceRoster,
} from "@/lib/api/admin";
import type { AttendanceRosterInput } from "@/lib/types";
import { queryKeys } from "./keys";

export function useAttendanceOverview() {
  return useQuery({
    queryKey: queryKeys.attendanceOverview,
    queryFn: getAttendanceOverview,
  });
}

export function useAttendanceRoster(meetingId: string) {
  return useQuery({
    queryKey: queryKeys.attendanceRoster(meetingId),
    queryFn: () => getAttendanceRoster(meetingId),
    enabled: meetingId.length > 0,
  });
}

export function useSaveAttendanceRoster() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AttendanceRosterInput) => saveAttendanceRoster(input),
    onSettled: (_data, _error, input) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendanceRoster(input.meetingId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.attendanceOverview });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminMeetings });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminScholars });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
    },
  });
}

export function useAttendanceHistory(meetingId: string) {
  return useQuery({
    queryKey: queryKeys.attendanceHistory(meetingId),
    queryFn: () => getAttendanceHistory(meetingId),
    enabled: meetingId.length > 0,
  });
}