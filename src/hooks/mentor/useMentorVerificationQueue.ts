import { useQuery } from "@tanstack/react-query";
import { getVerificationQueue } from "@/lib/api/mentor";
import { queryKeys } from "../keys";

export function useMentorVerificationQueue() {
  return useQuery({
    queryKey: queryKeys.verificationQueue,
    queryFn: getVerificationQueue,
  });
}