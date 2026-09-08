import { useQuery } from "@tanstack/react-query";
import { getCohort } from "@/lib/api/scholar";
import { queryKeys } from "../keys";

export function useScholarCohort() {
  return useQuery({
    queryKey: queryKeys.scholarCohort,
    queryFn: getCohort,
  });
}