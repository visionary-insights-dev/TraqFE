import { type UserRole } from "@/stores/types";

export const ASSIGNMENT_STATUSES = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "PENDING_VERIFICATION",
  "VERIFIED",
  "VERIFIED_LATE",
  "RESUBMISSION_REQUIRED",
  "OVERDUE",
] as const;

export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

export const RESOURCE_TYPES = ["PDF", "LINK", "FILE", "VIDEO"] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

export type AttendanceStatus = "PRESENT" | "ABSENT" | "EXCUSED";

export interface Mentor {
  id: string;
  name: string;
  avatarUrl?: string;
  title?: string;
}

export interface ProgramProgress {
  overall: number;
  assignmentPct: number;
  attendancePct: number;
  assignmentWeight: number;
  attendanceWeight: number;
}

export interface UpcomingMeeting {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  courseName?: string;
  mentor?: Mentor;
}

export interface ScholarTask {
  id: string;
  title: string;
  courseName?: string;
  dueAt: string;
  status: AssignmentStatus;
}

export interface DashboardAnalytics {
  progress: ProgramProgress;
  attendance: {
    rate: number;
    target: number;
  };
  upcomingMeeting: UpcomingMeeting | null;
  activeTasks: ScholarTask[];
  mentor: Mentor | null;
}

export interface CourseProgress {
  assignmentsCompleted: number;
  assignmentsTotal: number;
  assignmentPct: number;
  attendancePct: number;
  overall: number;
}

export interface Course {
  id: string;
  name: string;
  program: {
    id: string;
    name: string;
  };
  mentor: Mentor | null;
  progress: CourseProgress;
  recentTasks: ScholarTask[];
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  courseName?: string;
  uploadedAt: string;
  url?: string;
}

export interface CohortMember {
  id: string;
  name: string;
  role: "SCHOLAR" | "MENTOR";
  avatarUrl?: string;
}

export interface Cohort {
  id: string;
  name: string;
  members: CohortMember[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseName?: string;
  dueAt: string;
  status: AssignmentStatus;
  submission?: {
    id: string;
    submittedAt: string;
  };
}

export interface Conversation {
  id: string;
  name: string;
  avatarUrl?: string;
  lastMessage?: {
    text: string;
    at: string;
    fromMe: boolean;
  };
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  sentAt: string;
}

export interface NotificationPreferences {
  assignmentReminders: boolean;
  attendanceAlerts: boolean;
  meetingReminders: boolean;
  messages: boolean;
}

export interface ScholarProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: "SCHOLAR";
  notificationPreferences: NotificationPreferences;
}

export interface ProfileUpdateInput {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  title?: string;
  notificationPreferences?: Partial<NotificationPreferences>;
}

export interface MentorScholar {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
  courseName?: string;
  progress: {
    overall: number;
    assignmentPct: number;
    attendancePct: number;
  };
  atRisk: boolean;
}

export type AssignmentEditWindow = {
  minutes: number;
  publishedAt?: string;
  published: boolean;
};

export interface MentorAssignment extends Assignment {
  published: boolean;
  publishedAt?: string;
  audience?: string;
  courseId?: string;
  submissionCount?: number;
  submissionTotal?: number;
}

export interface ChangeRequestInput {
  assignmentId: string;
  message: string;
}

export interface VerificationItem {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  scholarId: string;
  scholarName: string;
  courseName?: string;
  submittedAt: string;
  submissionUrl?: string;
  status: AssignmentStatus;
  late: boolean;
}

export interface VerificationActionInput {
  submissionId: string;
  comment?: string;
}

export interface Meeting {
  id: string;
  title: string;
  startsAt: string;
  endsAt?: string;
  courseName?: string;
}

export interface MeetingInput {
  title: string;
  startsAt: string;
  courseId?: string;
}

export interface AttendanceRecord {
  meetingId: string;
  scholarId: string;
  name: string;
  attendance: AttendanceStatus;
}

export interface AttendanceRosterInput {
  meetingId: string;
  records: Array<{
    scholarId: string;
    attendance: AttendanceStatus;
  }>;
}

export interface ResourceUploadUrl {
  uploadUrl: string;
  fileKey: string;
  publicUrl?: string;
}

export interface ResourceUploadInput {
  name: string;
  type: ResourceType;
  courseId?: string;
  url?: string;
  fileKey?: string;
}

export interface MentorProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  title?: string;
  role: "MENTOR";
  notificationPreferences: NotificationPreferences;
}

/* ---- Auth types ---- */

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  avatarUrl?: string;
  profileComplete: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface OnboardingInput {
  name: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  profileComplete: boolean;
}

/* ---- Admin types ---- */

export const PROGRAM_STATUSES = ["ACTIVE", "ARCHIVED"] as const;
export type ProgramStatus = (typeof PROGRAM_STATUSES)[number];

export interface Program {
  id: string;
  name: string;
  description?: string;
  status: ProgramStatus;
  startDate?: string;
  endDate?: string;
  courseCount: number;
  scholarCount: number;
  createdAt: string;
}

export interface ProgramInput {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface AdminCourse {
  id: string;
  name: string;
  code?: string;
  program: { id: string; name: string } | null;
  scholarCount?: number;
  mentorName?: string;
  createdAt: string;
}

export interface CourseInput {
  name: string;
  code?: string;
  programId?: string;
}

export const PEOPLE_STATUSES = ["ACTIVE", "INVITED", "SUSPENDED"] as const;
export type PeopleStatus = (typeof PEOPLE_STATUSES)[number];

export interface AdminScholar {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  courseName?: string;
  mentorName?: string;
  programName?: string;
  status: PeopleStatus;
  progress: {
    overall: number;
    assignmentPct: number;
    attendancePct: number;
  };
  atRisk: boolean;
  joinedAt?: string;
}

export interface AdminScholarAssignment {
  id: string;
  title: string;
  courseName?: string;
  dueAt: string;
  submittedAt?: string;
  status: AssignmentStatus;
  creditPct?: number;
}

export interface AdminScholarMeeting {
  id: string;
  title: string;
  startsAt: string;
  attendance?: AttendanceStatus;
}

export interface ScholarDetail {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  courseName?: string;
  programName?: string;
  mentor: { id: string; name: string } | null;
  joinedAt: string;
  progress: {
    overall: number;
    assignmentPct: number;
    attendancePct: number;
    assignmentWeight: number;
    attendanceWeight: number;
  };
  attendance: {
    present: number;
    absent: number;
    excused: number;
    rate: number;
  };
  assignments: AdminScholarAssignment[];
  meetings: AdminScholarMeeting[];
  auditTrail: AuditLogEntry[];
}

export interface AdminMentor {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  title?: string;
  status: PeopleStatus;
  scholarCount: number;
  courseCount: number;
  courses: Array<{ id: string; name: string }>;
  joinedAt: string;
}

export interface MentorDetail {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  title?: string;
  joinedAt: string;
  scholars: AdminScholar[];
  assignments: Array<{
    id: string;
    title: string;
    dueAt: string;
    submittedCount: number;
    totalCount: number;
  }>;
  meetings: Array<{ id: string; title: string; startsAt: string }>;
}

export interface MentorAssignmentInput {
  scholarIds: string[];
  mentorId: string;
}

export interface AtRiskScholar {
  id: string;
  name: string;
  email?: string;
  courseName?: string;
  mentorName?: string;
  attendancePct: number;
  assignmentPct: number;
  overdueCount: number;
  reason: string;
}

export const ACTIVITY_TYPES = [
  "SCHOLAR_JOINED",
  "SCHOLAR_INVITED",
  "MENTOR_PAIRED",
  "ASSIGNMENT_PUBLISHED",
  "ASSIGNMENT_SUBMITTED",
  "ASSIGNMENT_VERIFIED",
  "MEETING_SCHEDULED",
  "ATTENDANCE_UPDATED",
  "COURSE_ARCHIVED",
  "PROGRAM_ARCHIVED",
  "REPORT_GENERATED",
  "SETTINGS_UPDATED",
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export interface ActivityItem {
  id: string;
  type: ActivityType | string;
  actorName?: string;
  targetName?: string;
  description: string;
  at: string;
}

export interface AdminDashboardMetrics {
  scholars: number;
  mentors: number;
  activePrograms: number;
  activeCourses: number;
  atRiskScholars: number;
  avgAttendanceRate: number;
  assignmentCompletionRate: number;
  pendingVerification: number;
}

export interface AdminDashboardAnalytics {
  metrics: AdminDashboardMetrics;
  atRiskScholars: AtRiskScholar[];
  recentActivity: ActivityItem[];
}

export const AUDIENCE_TYPES = ["ALL", "COURSE", "PROGRAM"] as const;
export type AudienceType = (typeof AUDIENCE_TYPES)[number];

export interface AdminAssignment extends Assignment {
  courseId?: string;
  programId?: string;
  programName?: string;
  mentor: { id: string; name: string } | null;
  published: boolean;
  publishedAt?: string;
  audience: AudienceType;
  submissionStats: {
    submitted: number;
    verified: number;
    pending: number;
    resubmissionRequired: number;
    overdue: number;
    total: number;
  };
  editWindowMinutes: number;
}

export interface AdminAssignmentInput {
  title: string;
  description: string;
  dueAt: string;
  courseId?: string;
  programId?: string;
  audience: AudienceType;
  mentorId?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  scholarId: string;
  scholarName: string;
  avatarUrl?: string;
  courseName?: string;
  submittedAt: string;
  submissionUrl?: string;
  scholarComment?: string;
  status: AssignmentStatus;
  late: boolean;
  creditPct?: number;
  verificationComment?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface SubmissionStatusHistory {
  status: AssignmentStatus;
  at: string;
  by?: string;
  note?: string;
}

export interface SubmissionDetail extends Submission {
  assignment: { id: string; title: string; dueAt: string };
  history: SubmissionStatusHistory[];
}

export type OverrideStatus = "VERIFIED" | "VERIFIED_LATE" | "RESUBMISSION_REQUIRED";

export interface OverrideInput {
  submissionId: string;
  status: OverrideStatus;
  comment?: string;
}

export interface AttendanceMeetingSummary {
  meetingId: string;
  title: string;
  startsAt: string;
  courseName?: string;
  total: number;
  present: number;
  absent: number;
  excused: number;
  rate: number;
}

export interface AttendanceRosterScholar {
  scholarId: string;
  name: string;
  email?: string;
  attendance: AttendanceStatus;
}

export interface AttendanceRoster {
  meetingId: string;
  title: string;
  startsAt: string;
  courseName?: string;
  scholars: AttendanceRosterScholar[];
}

export const ATTENDANCE_ACTIONS = [
  "MARKED_PRESENT",
  "MARKED_ABSENT",
  "MARKED_EXCUSED",
  "MEETING_SETTLED",
] as const;
export type AttendanceAction = (typeof ATTENDANCE_ACTIONS)[number];

export interface AttendanceHistoryEntry {
  id: string;
  meetingId: string;
  scholarName?: string;
  action: AttendanceAction | string;
  changedFrom?: AttendanceStatus;
  changedTo?: AttendanceStatus;
  changedBy: string;
  at: string;
  note?: string;
}

export const INVITATION_STATUSES = ["PENDING", "SENT", "ACCEPTED", "EXPIRED", "REVOKED"] as const;
export type InvitationStatus = (typeof INVITATION_STATUSES)[number];

export interface Invitation {
  id: string;
  email: string;
  role: "SCHOLAR" | "MENTOR";
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  invitedByName?: string;
  courseName?: string;
}

export interface InviteInput {
  email: string;
  role: "SCHOLAR" | "MENTOR";
  courseId?: string;
}

export interface AtRiskThresholds {
  attendancePct: number;
  assignmentPct: number;
  overdueCount: number;
}

export interface AttendanceOrgSettings {
  excusedAllowed: boolean;
  requireExcuseReason: boolean;
  reminderHoursBefore: number;
}

export interface OrgSettings {
  assignmentWeight: number;
  attendanceWeight: number;
  atRisk: AtRiskThresholds;
  lateSubmissionPenaltyPct: number;
  assignmentEditWindowMinutes: number;
  attendance: AttendanceOrgSettings;
}

export interface OrgSettingsUpdateInput {
  assignmentWeight: number;
  attendanceWeight: number;
  atRisk: AtRiskThresholds;
  lateSubmissionPenaltyPct: number;
  assignmentEditWindowMinutes: number;
  attendance: AttendanceOrgSettings;
}

export const REPORT_STATUSES = ["QUEUED", "PROCESSING", "COMPLETED", "FAILED"] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export interface Report {
  id: string;
  name: string;
  status: ReportStatus;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  errorMessage?: string;
}

export interface ReportInput {
  name: string;
  programId?: string;
  includeAtRisk: boolean;
}

export const IMPORT_STATUSES = ["QUEUED", "PROCESSING", "COMPLETED", "FAILED"] as const;
export type ImportStatus = (typeof IMPORT_STATUSES)[number];

export interface ImportRowError {
  row: number;
  email: string;
  message: string;
}

export interface ImportJob {
  id: string;
  fileName: string;
  status: ImportStatus;
  totalRows: number;
  imported: number;
  failed: number;
  errors?: ImportRowError[];
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  entityType: string;
  entityId?: string;
  entityLabel?: string;
  eventType: string;
  actorName?: string;
  actorRole?: UserRole;
  action: string;
  detail?: string;
  at: string;
}

export interface AuditLogFilters {
  entityType?: string;
  actor?: string;
  eventType?: string;
  from?: string;
  to?: string;
}
