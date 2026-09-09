import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { archiveProgram, createProgram, getPrograms } from "@/lib/api/admin";
import type { ProgramInput } from "@/lib/types";
import { queryKeys } from "./keys";

export function usePrograms() {
  return useQuery({
    queryKey: queryKeys.programs,
    queryFn: getPrograms,
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProgramInput) => createProgram(input),
    onSuccess: (created) => {
      queryClient.setQueryData(queryKeys.programs, (old: unknown) =>
        Array.isArray(old) ? [...old, created] : old
      );
    },
  });
}

export function useArchiveProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (programId: string) => archiveProgram(programId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
    },
  });
}