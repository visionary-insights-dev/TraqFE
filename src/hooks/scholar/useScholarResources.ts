import { useQuery } from "@tanstack/react-query";
import { getResources } from "@/lib/api/scholar";
import { queryKeys } from "../keys";

export function useScholarResources(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.scholarResources(filters),
    queryFn: getResources,
  });
}