import { useQuery } from "@tanstack/react-query";
import { getMyCourses } from "@/lib/api/scholar";
import { queryKeys } from "../keys";

export function useScholarCourses() {
  return useQuery({
    queryKey: queryKeys.scholarCourses,
    queryFn: getMyCourses,
  });
}