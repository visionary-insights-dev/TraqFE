import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitAssignment } from "@/lib/api/scholar";
import { queryKeys } from "../keys";

/**
 * Marks an assignment as done. Lists live under the ["scholar","assignments"]
 * prefix, so the optimistic update applies to every filter variant and the
 * invalidate refetches them all.
 */
export function useMarkAsDone(assignmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => submitAssignment(assignmentId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.scholarAssignments(),
      });
      queryClient.setQueriesData<Array<{ id: string; status: string }>>(
        { queryKey: queryKeys.scholarAssignments() },
        (old) =>
          old?.map((a) =>
            a.id === assignmentId
              ? { ...a, status: "PENDING_VERIFICATION" as const }
              : a
          )
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.scholarAssignments(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.scholarDashboard });
    },
  });
}