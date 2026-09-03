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
