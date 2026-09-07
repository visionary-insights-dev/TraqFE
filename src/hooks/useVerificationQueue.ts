import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getVerificationQueue,
  requestResubmission,
  verifySubmission,
} from "@/lib/api/mentor";
import type { VerificationActionInput, VerificationItem } from "@/lib/types";
import { queryKeys } from "./keys";

export function useVerificationQueue() {
  return useQuery({
    queryKey: queryKeys.verificationQueue,
    queryFn: getVerificationQueue,
  });
}

function useVerificationMutation(
  mutationFn: (input: VerificationActionInput) => Promise<VerificationItem>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (updated, vars) => {
      queryClient.setQueryData<VerificationItem[]>(
        queryKeys.verificationQueue,
        (old) =>
          old
            ?.map((v) =>
              v.id === updated.id ? { ...v, ...updated } : v
            )
            .filter(
              (v) =>
                v.status !== "VERIFIED" &&
                v.status !== "VERIFIED_LATE" &&
                v.status !== "RESUBMISSION_REQUIRED"
            )
      );
      if (vars.submissionId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.mentorAssignments,
        });
      }
    },
  });
}

export function useVerifySubmission() {
  return useVerificationMutation(verifySubmission);
}

export function useRequestResubmission() {
  return useVerificationMutation(requestResubmission);
}
