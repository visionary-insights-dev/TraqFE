import { apiClient, get, patch, post } from "./client";
import type { PaginatedResponse } from "./types";
import type {
  AdminAssignment,
  AdminAssignmentInput,
  AdminCourse,
  AdminDashboardAnalytics,
  AdminMentor,
  AdminScholar,
  AttendanceHistoryEntry,
  AttendanceMeetingSummary,
  AttendanceRoster,
  AttendanceRosterInput,
  AuditLogEntry,
  AuditLogFilters,
  CourseInput,
  ImportJob,
  Invitation,
  InviteInput,
  Meeting,
  MeetingInput,
  MentorAssignmentInput,
  MentorDetail,
  OrgSettings,
  OrgSettingsUpdateInput,
  PeopleStatus,
  Program,
  ProgramInput,
  Report,
  ReportInput,
  ScholarDetail,
  Submission,
  SubmissionDetail,
  VerificationActionInput,
  VerificationItem,
} from "@/lib/types";

export function getAdminDashboard(): Promise<AdminDashboardAnalytics> {
  return get<AdminDashboardAnalytics>("/analytics/dashboard");
}

export function getPrograms(): Promise<Program[]> {
  return get<Program[]>("/programs");
}

export function createProgram(input: ProgramInput): Promise<Program> {
  return post<Program>("/programs", input);
}

export function archiveProgram(programId: string): Promise<Program> {
  return post<Program>(`/programs/${programId}/archive`);
}

export function unarchiveProgram(programId: string): Promise<Program> {
  return post<Program>(`/programs/${programId}/unarchive`);
}

export function getAdminCourses(): Promise<AdminCourse[]> {
  return get<AdminCourse[]>("/courses");
}

export function createCourse(input: CourseInput): Promise<AdminCourse> {
  return post<AdminCourse>("/courses", input);
}

export function updateCourse(
  courseId: string,
  input: CourseInput
): Promise<AdminCourse> {
  return patch<AdminCourse>(`/courses/${courseId}`, input);
}

export function archiveCourse(courseId: string): Promise<AdminCourse> {
  return post<AdminCourse>(`/courses/${courseId}/archive`);
}

export function unarchiveCourse(courseId: string): Promise<AdminCourse> {
  return post<AdminCourse>(`/courses/${courseId}/unarchive`);
}

export function getAdminScholars(): Promise<AdminScholar[]> {
  return get<AdminScholar[]>("/users", { params: { role: "SCHOLAR" } });
}

export function getAdminScholar(id: string): Promise<ScholarDetail> {
  return get<ScholarDetail>(`/users/${id}`);
}

export function getAdminMentors(): Promise<AdminMentor[]> {
  return get<AdminMentor[]>("/users", { params: { role: "MENTOR" } });
}

export function getAdminMentor(id: string): Promise<MentorDetail> {
  return get<MentorDetail>(`/users/${id}`);
}

export function updateUserStatus(
  userId: string,
  status: PeopleStatus
): Promise<{
  id: string;
  name: string;
  email: string;
  status: PeopleStatus;
  mentorName?: string;
}> {
  return post(`/users/${userId}/status`, { status });
}

export function createMentorAssignment(
  input: MentorAssignmentInput
): Promise<{ id: string }> {
  return post<{ id: string }>("/mentor-assignments", input);
}

export function getAdminAssignments(): Promise<AdminAssignment[]> {
  return get<AdminAssignment[]>("/assignments");
}

export function getAdminAssignment(id: string): Promise<AdminAssignment> {
  return get<AdminAssignment>(`/assignments/${id}`);
}

export function createAdminAssignment(
  input: AdminAssignmentInput
): Promise<AdminAssignment> {
  return post<AdminAssignment>("/assignments", input);
}

export function publishAdminAssignment(
  assignmentId: string
): Promise<AdminAssignment> {
  return post<AdminAssignment>(`/assignments/${assignmentId}/publish`);
}

export function getAdminVerificationQueue(): Promise<VerificationItem[]> {
  return get<VerificationItem[]>("/assignments/verification");
}

export function getSubmissionDetail(
  assignmentId: string,
  submissionId: string
): Promise<SubmissionDetail> {
  return get<SubmissionDetail>(
    `/assignments/${assignmentId}/submissions/${submissionId}`
  );
}

export function verifySubmission(
  input: VerificationActionInput
): Promise<Submission> {
  return post<Submission>(`/assignments/${input.submissionId}/verify`, {
    comment: input.comment,
  });
}

export function requestSubmissionResubmission(
  input: VerificationActionInput
): Promise<Submission> {
  return post<Submission>(
    `/assignments/${input.submissionId}/request-resubmission`,
    { comment: input.comment }
  );
}

export function overrideSubmission(
  input: {
    submissionId: string;
    status: "VERIFIED" | "VERIFIED_LATE" | "RESUBMISSION_REQUIRED";
    comment?: string;
  }
): Promise<Submission> {
  return post<Submission>(`/assignments/${input.submissionId}/override`, {
    status: input.status,
    comment: input.comment,
  });
}

export function getAdminMeetings(): Promise<Meeting[]> {
  return get<Meeting[]>("/meetings");
}

export function createMeeting(input: MeetingInput): Promise<Meeting> {
  return post<Meeting>("/meetings", input);
}

export function updateMeeting(
  meetingId: string,
  input: MeetingInput
): Promise<Meeting> {
  return patch<Meeting>(`/meetings/${meetingId}`, input);
}

export function archiveMeeting(meetingId: string): Promise<Meeting> {
  return post<Meeting>(`/meetings/${meetingId}/archive`);
}

export function getAttendanceOverview(): Promise<AttendanceMeetingSummary[]> {
  return get<AttendanceMeetingSummary[]>("/attendance");
}

export function getAttendanceRoster(
  meetingId: string
): Promise<AttendanceRoster> {
  return get<AttendanceRoster>(`/meetings/${meetingId}/attendance`);
}

export function saveAttendanceRoster(
  input: AttendanceRosterInput
): Promise<{ attendance: Array<{ scholarId: string; attendance: AttendanceRoster["scholars"][number]["attendance"] }> }> {
  return post(`/meetings/${input.meetingId}/attendance`, {
    records: input.records,
  });
}

export function getAttendanceHistory(
  meetingId: string
): Promise<AttendanceHistoryEntry[]> {
  return get<AttendanceHistoryEntry[]>(
    `/meetings/${meetingId}/attendance/history`
  );
}

export function getInvitations(): Promise<Invitation[]> {
  return get<Invitation[]>("/invitations");
}

export function inviteUser(input: InviteInput): Promise<Invitation> {
  return post<Invitation>("/users/invite", input);
}

export function resendInvitation(invitationId: string): Promise<Invitation> {
  return post<Invitation>(`/invitations/${invitationId}/resend`);
}

export function revokeInvitation(invitationId: string): Promise<Invitation> {
  return post<Invitation>(`/invitations/${invitationId}/revoke`);
}

export function bulkImportUsers(input: {
  fileName: string;
  rows: Array<Record<string, unknown>>;
}): Promise<ImportJob> {
  return post<ImportJob>("/users/bulk-import", input);
}

export function getImportJob(jobId: string): Promise<ImportJob> {
  return get<ImportJob>(`/users/bulk-import/${jobId}`);
}

export function getReports(): Promise<Report[]> {
  return get<Report[]>("/reports");
}

export function createReport(input: ReportInput): Promise<Report> {
  return post<Report>("/reports", input);
}

export function getReport(reportId: string): Promise<Report> {
  return get<Report>(`/reports/${reportId}`);
}

/**
 * Downloads the generated report as a raw binary blob. Uses apiClient directly
 * (bypassing the unwrap helper) because the 409/404 error paths return the
 * standard error envelope instead of a data payload.
 */
export async function downloadReport(
  reportId: string,
  format: "csv" | "pdf"
): Promise<Blob> {
  const response = await apiClient.get<Blob>(`/reports/${reportId}/download`, {
    params: { format },
    responseType: "blob",
  });
  return response.data;
}

export function getOrgSettings(): Promise<OrgSettings> {
  return get<OrgSettings>("/organization/settings");
}

export function updateOrgSettings(
  input: OrgSettingsUpdateInput
): Promise<OrgSettings> {
  return patch<OrgSettings>("/organization/settings", input);
}

export function getAuditLogs(
  params: AuditLogFilters & { page?: number; limit?: number }
): Promise<PaginatedResponse<AuditLogEntry>> {
  return get<PaginatedResponse<AuditLogEntry>>("/audit-logs", { params });
}