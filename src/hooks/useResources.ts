import { useQuery } from "@tanstack/react-query";
import { getResources } from "@/lib/api/scholar";
import { queryKeys } from "./keys";

export function useResources() {
  return useQuery({
    queryKey: queryKeys.resources,
    queryFn: getResources,
  });
}
