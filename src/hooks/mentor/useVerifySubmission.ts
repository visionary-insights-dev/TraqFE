import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifySubmission } from "@/lib/api/mentor";
import type { VerificationActionInput, VerificationItem } from "@/lib/types";
import { queryKeys } from "../keys";

export function useVerifySubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: VerificationActionInput) => verifySubmission(input),
    onSuccess: (updated, vars) => {
      queryClient.setQueryData<VerificationItem[]>(
        queryKeys.verificationQueue,
        (old) =>
          old
            ?.map((v) => (v.id === updated.id ? { ...v, ...updated } : v))
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