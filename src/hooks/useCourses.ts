import { useQuery } from "@tanstack/react-query";
import { getMyCourses } from "@/lib/api/scholar";
import { queryKeys } from "./keys";

export function useCourses() {
  return useQuery({
    queryKey: queryKeys.courses,
    queryFn: getMyCourses,
  });
}
