import { useQuery } from "@tanstack/react-query";
import { getResources } from "@/lib/api/mentor";
import { queryKeys } from "../keys";

export function useMentorResources() {
  return useQuery({
    queryKey: queryKeys.mentorResources,
    queryFn: getResources,
  });
}