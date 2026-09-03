import { get, post, patch, put } from "./client";
import {
  type AttendanceRosterInput,
  type AttendanceStatus,
  type Meeting,
  type MeetingInput,
  type MentorAssignment,
  type MentorProfile,
  type MentorScholar,
  type NotificationPreferences,
  type ProfileUpdateInput,
  type Resource,
  type ResourceUploadInput,
  type ResourceUploadUrl,
  type VerificationActionInput,
  type VerificationItem,
} from "@/lib/types";

export function getMentorScholars(): Promise<MentorScholar[]> {
  return get<MentorScholar[]>("/mentor-assignments");
}

export function getMentorScholar(id: string): Promise<MentorScholar> {
  return get<MentorScholar>(`/mentor-assignments/${id}`);
}

export function getMentorAssignments(): Promise<MentorAssignment[]> {
  return get<MentorAssignment[]>("/assignments");
}

export function getMentorAssignment(id: string): Promise<MentorAssignment> {
  return get<MentorAssignment>(`/assignments/${id}`);
}

export interface CreateAssignmentInput {
  title: string;
  description: string;
  dueAt: string;
  courseId: string;
  audience: string;
}

export function createAssignment(
  input: CreateAssignmentInput
): Promise<MentorAssignment> {
  return post<MentorAssignment>("/assignments", input);
}

export function publishAssignment(
  assignmentId: string
): Promise<MentorAssignment> {
  return post<MentorAssignment>(`/assignments/${assignmentId}/publish`);
}

export function requestChange(
  assignmentId: string,
  message: string
): Promise<{ id: string }> {
  return post<{ id: string }>(
    `/assignments/${assignmentId}/change-requests`,
    { message }
  );
}

export function getVerificationQueue(): Promise<VerificationItem[]> {
  return get<VerificationItem[]>("/assignments/verification");
}

export function verifySubmission(
  input: VerificationActionInput
): Promise<VerificationItem> {
  return post<VerificationItem>(`/assignments/${input.submissionId}/verify`, {
    comment: input.comment,
  });
}

export function requestResubmission(
  input: VerificationActionInput
): Promise<VerificationItem> {
  return post<VerificationItem>(
    `/assignments/${input.submissionId}/request-resubmission`,
    { comment: input.comment }
  );
}

export function getMeetings(): Promise<Meeting[]> {
  return get<Meeting[]>("/meetings");
}

export function createMeeting(input: MeetingInput): Promise<Meeting> {
  return post<Meeting>("/meetings", input);
}

export function saveAttendance(
  input: AttendanceRosterInput
): Promise<{ attendance: Array<{ scholarId: string; attendance: AttendanceStatus }> }> {
  return post(`/meetings/${input.meetingId}/attendance`, {
    records: input.records,
  });
}

export function getResources(): Promise<Resource[]> {
  return get<Resource[]>("/resources");
}

export function getResourceUploadUrl(
  filename: string,
  contentType: string
): Promise<ResourceUploadUrl> {
  return post<ResourceUploadUrl>("/resources/upload-url", {
    filename,
    contentType,
  });
}

export async function uploadResourceFile(
  uploadUrl: string,
  file: File
): Promise<void> {
  await put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
  });
}

export function createResource(
  input: ResourceUploadInput
): Promise<Resource> {
  return post<Resource>("/resources", input);
}

export function getMentorProfile(): Promise<MentorProfile> {
  return get<MentorProfile>("/users/me/profile");
}

export function updateMentorProfile(
  input: ProfileUpdateInput
): Promise<MentorProfile> {
  return patch<MentorProfile>("/users/me/profile", input);
}

export function getOrgsCourses(): Promise<Array<{ id: string; name: string }>> {
  return get<Array<{ id: string; name: string }>>("/courses");
}

export type { NotificationPreferences };
