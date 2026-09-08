import { useQuery } from "@tanstack/react-query";
import { getMyAssignments } from "@/lib/api/scholar";
import { queryKeys } from "../keys";

export function useScholarAssignments(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.scholarAssignments(filters),
    queryFn: getMyAssignments,
  });
}