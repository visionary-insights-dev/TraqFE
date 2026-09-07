import { useQuery } from "@tanstack/react-query";
import { getMentorScholars } from "@/lib/api/mentor";
import { queryKeys } from "./keys";

export function useMentorScholars() {
  return useQuery({
    queryKey: queryKeys.mentorScholars,
    queryFn: getMentorScholars,
  });
}
