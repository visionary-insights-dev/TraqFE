import { useQuery } from "@tanstack/react-query";
import { getCohort } from "@/lib/api/scholar";
import { queryKeys } from "./keys";

export function useCohort() {
  return useQuery({
    queryKey: queryKeys.cohort,
    queryFn: getCohort,
  });
}
