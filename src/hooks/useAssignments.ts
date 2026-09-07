import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyAssignments, submitAssignment } from "@/lib/api/scholar";
import type { Assignment } from "@/lib/types";
import { queryKeys } from "./keys";

export function useAssignments() {
  return useQuery({
    queryKey: queryKeys.assignments,
    queryFn: getMyAssignments,
  });
}

export function useSubmitAssignment(assignmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => submitAssignment(assignmentId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.assignments });
      const previous = queryClient.getQueryData<Assignment[]>(
        queryKeys.assignments
      );
      queryClient.setQueryData<Assignment[]>(
        queryKeys.assignments,
        (old) =>
          old?.map((a) =>
            a.id === assignmentId
              ? { ...a, status: "PENDING_VERIFICATION" as const }
              : a
          )
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.assignments, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboardAnalytics,
      });
    },
  });
}
