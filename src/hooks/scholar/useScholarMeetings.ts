import { useQuery } from "@tanstack/react-query";
import { getScholarMeetings } from "@/lib/api/scholar";
import { queryKeys } from "../keys";

export function useScholarMeetings() {
  return useQuery({
    queryKey: queryKeys.scholarMeetings,
    queryFn: getScholarMeetings,
  });
}