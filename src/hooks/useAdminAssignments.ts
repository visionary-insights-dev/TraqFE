import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminAssignment,
  getAdminAssignment,
  getAdminAssignments,
  getAdminVerificationQueue,
  getSubmissionDetail,
  overrideSubmission,
  publishAdminAssignment,
  requestSubmissionResubmission,
  verifySubmission,
} from "@/lib/api/admin";
import type {
  AdminAssignmentInput,
  OverrideInput,
  VerificationActionInput,
} from "@/lib/types";
import { queryKeys } from "./keys";

export function useAdminAssignments() {
  return useQuery({
    queryKey: queryKeys.adminAssignments,
    queryFn: getAdminAssignments,
  });
}

export function useAdminAssignment(id: string) {
  return useQuery({
    queryKey: queryKeys.adminAssignment(id),
    queryFn: () => getAdminAssignment(id),
    enabled: id.length > 0,
  });
}

export function useCreateAdminAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AdminAssignmentInput) => createAdminAssignment(input),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminAssignments });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
    },
  });
}

export function usePublishAdminAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assignmentId: string) => publishAdminAssignment(assignmentId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminAssignments });
    },
  });
}

export function useAdminVerificationQueue() {
  return useQuery({
    queryKey: queryKeys.adminVerificationQueue,
    queryFn: getAdminVerificationQueue,
  });
}

export function useSubmissionDetail(assignmentId: string, submissionId: string) {
  return useQuery({
    queryKey: queryKeys.submission(assignmentId, submissionId),
    queryFn: () => getSubmissionDetail(assignmentId, submissionId),
    enabled: assignmentId.length > 0 && submissionId.length > 0,
  });
}

function invalidateSubmissionKeys(
  queryClient: ReturnType<typeof useQueryClient>,
  assignmentId?: string,
  submissionId?: string
): void {
  queryClient.invalidateQueries({ queryKey: queryKeys.adminAssignments });
  queryClient.invalidateQueries({ queryKey: queryKeys.adminVerificationQueue });
  queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
  if (assignmentId) {
    queryClient.invalidateQueries({
      queryKey: queryKeys.adminAssignment(assignmentId),
    });
  }
  if (assignmentId && submissionId) {
    queryClient.invalidateQueries({
      queryKey: queryKeys.submission(assignmentId, submissionId),
    });
  }
}

export function useAdminVerifySubmission(
  assignmentId?: string,
  submissionId?: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: VerificationActionInput) => verifySubmission(input),
    onSettled: () => {
      invalidateSubmissionKeys(queryClient, assignmentId, submissionId);
    },
  });
}

export function useAdminRequestResubmission(
  assignmentId?: string,
  submissionId?: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: VerificationActionInput) =>
      requestSubmissionResubmission(input),
    onSettled: () => {
      invalidateSubmissionKeys(queryClient, assignmentId, submissionId);
    },
  });
}

export function useAdminOverrideSubmission(
  assignmentId?: string,
  submissionId?: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: OverrideInput) => overrideSubmission(input),
    onSettled: () => {
      invalidateSubmissionKeys(queryClient, assignmentId, submissionId);
    },
  });
}