import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getInvitations,
  inviteUser,
  resendInvitation,
  revokeInvitation,
} from "@/lib/api/admin";
import type { InviteInput } from "@/lib/types";
import { queryKeys } from "./keys";

export function useInvitations() {
  return useQuery({
    queryKey: queryKeys.invitations,
    queryFn: getInvitations,
  });
}

export function useInviteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: InviteInput) => inviteUser(input),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminScholars });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminMentors });
    },
  });
}

export function useResendInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) => resendInvitation(invitationId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations });
    },
  });
}

export function useRevokeInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) => revokeInvitation(invitationId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations });
    },
  });
}