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
  notificationPreferences?: Partial<NotificationPreferences>;
}
