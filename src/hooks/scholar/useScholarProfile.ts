import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/lib/api/scholar";
import { queryKeys } from "../keys";

export function useScholarProfile() {
  return useQuery({
    queryKey: queryKeys.userProfile,
    queryFn: getMyProfile,
  });
}