import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveAttendance } from "@/lib/api/mentor";
import type { AttendanceRosterInput } from "@/lib/types";
import { queryKeys } from "../keys";

export function useRecordAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AttendanceRosterInput) => saveAttendance(input),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorMeetings });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorScholars });
    },
  });
}