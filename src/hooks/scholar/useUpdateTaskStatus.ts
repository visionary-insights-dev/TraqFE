import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "@/lib/api/scholar";
import type { AssignmentStatusInput } from "@/lib/types";
import { queryKeys } from "../keys";

/**
 * Toggles an assignment between NOT_STARTED and IN_PROGRESS. The dashboard
 * (active tasks) and course list (recent tasks) render the same status, so all
 * three lists are optimistically patched and invalidated together.
 */
export function useUpdateTaskStatus(assignmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: AssignmentStatusInput["status"]) =>
      updateTaskStatus(assignmentId, status),
    onMutate: async (status) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.scholarAssignments(),
      });

      queryClient.setQueriesData<Array<{ id: string; status?: string }>>(
        { queryKey: queryKeys.scholarAssignments() },
        (old) =>
          old?.map((a) =>
            a.id === assignmentId ? { ...a, status } : a
          )
      );

      queryClient.setQueriesData<{
        activeTasks?: Array<{ id: string; status?: string }>;
      }>(
        { queryKey: queryKeys.scholarDashboard },
        (old) =>
          old
            ? {
                ...old,
                activeTasks:
                  old.activeTasks?.map((a) =>
                    a.id === assignmentId ? { ...a, status } : a
                  ) ?? [],
              }
            : old
      );

      queryClient.setQueriesData<
        Array<{ recentTasks?: Array<{ id: string; status?: string }> }>
      >(
        { queryKey: queryKeys.scholarCourses },
        (old) =>
          old?.map((course) => ({
            ...course,
            recentTasks:
              course.recentTasks?.map((a) =>
                a.id === assignmentId ? { ...a, status } : a
              ) ?? [],
          }))
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.scholarAssignments() });
      queryClient.invalidateQueries({ queryKey: queryKeys.scholarDashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.scholarCourses });
    },
  });
}