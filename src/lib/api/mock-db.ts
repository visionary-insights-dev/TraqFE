import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-only-insecure-secret"
);

export async function signToken(payload: Record<string, unknown>, expiresIn = "24h") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET, { algorithms: ["HS256"] });
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function success<T>(data: T, meta?: Record<string, unknown>) {
  const body: Record<string, unknown> = { success: true, data };
  if (meta) body.meta = meta;
  return Response.json(body);
}

export function error(code: string, message: string, status = 400) {
  return Response.json(
    { success: false, error: { code, message } },
    { status }
  );
}

export function unauthorized() {
  return error("UNAUTHORIZED", "Authentication required", 401);
}

function extractBearer(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export async function getUser(request: Request) {
  const token = extractBearer(request);
  if (!token) return null;
  return verifyToken(token);
}

export async function requireUser(request: Request) {
  const user = await getUser(request);
  if (!user) return null;
  return user;
}

function uid() {
  return crypto.randomUUID().slice(0, 8);
}

export { uid as mockId };

/* ───────── In-memory data store ───────── */

import type { UserRole } from "@/stores/types";
import type {
  AssignmentStatus,
  AttendanceStatus,
  InvitationStatus,
  PeopleStatus,
  ProgramStatus,
  ReportStatus,
  ImportStatus,
  AuditLogEntry,
} from "@/lib/types";

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  avatarUrl: string;
  profileComplete: boolean;
  phone: string;
  title?: string;
  status: PeopleStatus;
  password: string;
}

export interface MockAssignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  programId: string;
  dueAt: string;
  status: AssignmentStatus;
  published: boolean;
  publishedAt?: string;
  audience: "ALL" | "COURSE" | "PROGRAM";
  mentorId: string;
  createdAt: string;
}

export interface MockSubmission {
  id: string;
  assignmentId: string;
  scholarId: string;
  submittedAt: string;
  status: AssignmentStatus;
  late: boolean;
  creditPct: number;
  comment?: string;
  verificationComment?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  history: Array<{ status: AssignmentStatus; at: string; by?: string; note?: string }>;
}

export interface MockMeeting {
  id: string;
  title: string;
  startsAt: string;
  endsAt?: string;
  courseId?: string;
  archived: boolean;
}

export interface MockAttendanceRecord {
  meetingId: string;
  scholarId: string;
  attendance: AttendanceStatus;
}

export interface MockProgram {
  id: string;
  name: string;
  description?: string;
  status: ProgramStatus;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface MockCourse {
  id: string;
  name: string;
  code?: string;
  programId?: string;
  archived: boolean;
  createdAt: string;
}

export interface MockMentorAssignment {
  scholarId: string;
  mentorId: string;
}

export interface MockInvitation {
  id: string;
  email: string;
  role: "SCHOLAR" | "MENTOR";
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  invitedByName?: string;
  courseId?: string;
}

export interface MockResource {
  id: string;
  name: string;
  type: string;
  courseId?: string;
  uploadedAt: string;
  url: string;
  uploadedBy: string;
  visibility: "PUBLIC" | "PRIVATE";
}

export interface MockReport {
  id: string;
  name: string;
  status: ReportStatus;
  programId?: string;
  includeAtRisk: boolean;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  errorMessage?: string;
}

export interface MockImportJob {
  id: string;
  fileName: string;
  status: ImportStatus;
  totalRows: number;
  imported: number;
  failed: number;
  errors: Array<{ row: number; email: string; message: string }>;
  createdAt: string;
}

export interface MockOrgSettings {
  assignmentWeight: number;
  attendanceWeight: number;
  atRisk: { attendancePct: number; assignmentPct: number; overdueCount: number };
  lateSubmissionPenaltyPct: number;
  assignmentEditWindowMinutes: number;
  attendance: { excusedAllowed: boolean; requireExcuseReason: boolean; reminderHoursBefore: number };
}

/* ── Seed data ── */

const ORG_ID = "org-tmf-001";

export const db = {
  users: [
    {
      id: "usr-admin-01",
      email: "admin@scholarlink.dev",
      name: "Admin User",
      role: "SUPER_ADMIN" as UserRole,
      organizationId: ORG_ID,
      avatarUrl: "",
      profileComplete: true,
      phone: "+234-800-000-0001",
      status: "ACTIVE" as PeopleStatus,
      password: "password123",
    },
    {
      id: "usr-mentor-01",
      email: "mentor@scholarlink.dev",
      name: "Mentor User",
      role: "MENTOR" as UserRole,
      organizationId: ORG_ID,
      avatarUrl: "",
      profileComplete: true,
      phone: "+234-800-000-0002",
      title: "Senior Mentor",
      status: "ACTIVE" as PeopleStatus,
      password: "password123",
    },
    {
      id: "usr-scholar-01",
      email: "scholar@scholarlink.dev",
      name: "Scholar User",
      role: "SCHOLAR" as UserRole,
      organizationId: ORG_ID,
      avatarUrl: "",
      profileComplete: false,
      phone: "+234-800-000-0003",
      status: "ACTIVE" as PeopleStatus,
      password: "password123",
    },
    {
      id: "usr-scholar-02",
      email: "ada.okafor@scholarlink.dev",
      name: "Ada Okafor",
      role: "SCHOLAR" as UserRole,
      organizationId: ORG_ID,
      avatarUrl: "",
      profileComplete: true,
      phone: "+234-800-000-0004",
      status: "ACTIVE" as PeopleStatus,
      password: "password123",
    },
    {
      id: "usr-scholar-03",
      email: "tunde.adeyemi@scholarlink.dev",
      name: "Tunde Adeyemi",
      role: "SCHOLAR" as UserRole,
      organizationId: ORG_ID,
      avatarUrl: "",
      profileComplete: true,
      phone: "+234-800-000-0005",
      status: "ACTIVE" as PeopleStatus,
      password: "password123",
    },
    {
      id: "usr-mentor-02",
      email: "chi.nwosu@scholarlink.dev",
      name: "Chi Nwosu",
      role: "MENTOR" as UserRole,
      organizationId: ORG_ID,
      avatarUrl: "",
      profileComplete: true,
      phone: "+234-800-000-0006",
      title: "Course Mentor",
      status: "ACTIVE" as PeopleStatus,
      password: "password123",
    },
  ] as MockUser[],

  programs: [
    {
      id: "prog-001",
      name: "Tech Foundations 2026",
      description: "12-week introductory program",
      status: "ACTIVE" as ProgramStatus,
      startDate: "2026-01-15",
      endDate: "2026-04-15",
      createdAt: "2026-01-10T10:00:00Z",
    },
    {
      id: "prog-002",
      name: "Advanced Leadership",
      description: "Leadership skills for cohort leads",
      status: "ACTIVE" as ProgramStatus,
      startDate: "2026-03-01",
      endDate: "2026-06-01",
      createdAt: "2026-02-20T10:00:00Z",
    },
  ],

  courses: [
    {
      id: "crs-001",
      name: "Intro to Web Development",
      code: "WEB101",
      programId: "prog-001",
      archived: false,
      createdAt: "2026-01-12T10:00:00Z",
    },
    {
      id: "crs-002",
      name: "Data Structures",
      code: "DS201",
      programId: "prog-001",
      archived: false,
      createdAt: "2026-01-12T10:00:00Z",
    },
    {
      id: "crs-003",
      name: "Soft Skills Workshop",
      code: "SS101",
      programId: "prog-002",
      archived: false,
      createdAt: "2026-02-22T10:00:00Z",
    },
  ],

  mentorAssignments: [
    { scholarId: "usr-scholar-01", mentorId: "usr-mentor-01" },
    { scholarId: "usr-scholar-02", mentorId: "usr-mentor-01" },
    { scholarId: "usr-scholar-03", mentorId: "usr-mentor-02" },
  ] as MockMentorAssignment[],

  assignments: [
    {
      id: "asgn-001",
      title: "Build a Landing Page",
      description: "Create a responsive landing page using HTML/CSS.",
      courseId: "crs-001",
      programId: "prog-001",
      dueAt: "2026-09-20T23:59:00Z",
      status: "IN_PROGRESS" as AssignmentStatus,
      published: true,
      publishedAt: "2026-09-01T10:00:00Z",
      audience: "ALL" as const,
      mentorId: "usr-mentor-01",
      createdAt: "2026-09-01T10:00:00Z",
    },
    {
      id: "asgn-002",
      title: "Implement a Linked List",
      description: "Write a singly-linked list in your language of choice.",
      courseId: "crs-002",
      programId: "prog-001",
      dueAt: "2026-09-25T23:59:00Z",
      status: "NOT_STARTED" as AssignmentStatus,
      published: true,
      publishedAt: "2026-09-05T10:00:00Z",
      audience: "ALL" as const,
      mentorId: "usr-mentor-01",
      createdAt: "2026-09-05T10:00:00Z",
    },
    {
      id: "asgn-003",
      title: "Public Speaking Practice",
      description: "Record a 3-minute introduction video.",
      courseId: "crs-003",
      programId: "prog-002",
      dueAt: "2026-09-15T23:59:00Z",
      status: "PENDING_VERIFICATION" as AssignmentStatus,
      published: true,
      publishedAt: "2026-09-08T10:00:00Z",
      audience: "ALL" as const,
      mentorId: "usr-mentor-02",
      createdAt: "2026-09-08T10:00:00Z",
    },
  ] as MockAssignment[],

  submissions: [
    {
      id: "sub-001",
      assignmentId: "asgn-001",
      scholarId: "usr-scholar-02",
      submittedAt: "2026-09-10T14:30:00Z",
      status: "PENDING_VERIFICATION" as AssignmentStatus,
      late: false,
      creditPct: 100,
      history: [
        { status: "PENDING_VERIFICATION" as const, at: "2026-09-10T14:30:00Z" },
      ],
    },
    {
      id: "sub-002",
      assignmentId: "asgn-003",
      scholarId: "usr-scholar-01",
      submittedAt: "2026-09-12T09:00:00Z",
      status: "PENDING_VERIFICATION" as AssignmentStatus,
      late: false,
      creditPct: 100,
      history: [
        { status: "PENDING_VERIFICATION" as const, at: "2026-09-12T09:00:00Z" },
      ],
    },
    {
      id: "sub-003",
      assignmentId: "asgn-001",
      scholarId: "usr-scholar-03",
      submittedAt: "2026-09-22T10:00:00Z",
      status: "VERIFIED_LATE" as AssignmentStatus,
      late: true,
      creditPct: 80,
      verificationComment: "Good work but submitted after deadline.",
      verifiedBy: "usr-mentor-02",
      verifiedAt: "2026-09-22T12:00:00Z",
      history: [
        { status: "PENDING_VERIFICATION" as const, at: "2026-09-22T10:00:00Z" },
        { status: "VERIFIED_LATE" as const, at: "2026-09-22T12:00:00Z", by: "usr-mentor-02" },
      ],
    },
  ] as MockSubmission[],

  meetings: [
    {
      id: "mtg-001",
      title: "Week 1 Check-in",
      startsAt: "2026-09-05T15:00:00Z",
      endsAt: "2026-09-05T16:00:00Z",
      courseId: "crs-001",
      archived: false,
    },
    {
      id: "mtg-002",
      title: "Code Review Session",
      startsAt: "2026-09-12T15:00:00Z",
      endsAt: "2026-09-12T16:00:00Z",
      courseId: "crs-001",
      archived: false,
    },
    {
      id: "mtg-003",
      title: "Leadership Workshop",
      startsAt: "2026-09-18T14:00:00Z",
      endsAt: "2026-09-18T16:00:00Z",
      courseId: "crs-003",
      archived: false,
    },
  ] as MockMeeting[],

  attendance: [
    { meetingId: "mtg-001", scholarId: "usr-scholar-01", attendance: "PRESENT" as AttendanceStatus },
    { meetingId: "mtg-001", scholarId: "usr-scholar-02", attendance: "PRESENT" as AttendanceStatus },
    { meetingId: "mtg-001", scholarId: "usr-scholar-03", attendance: "ABSENT" as AttendanceStatus },
    { meetingId: "mtg-002", scholarId: "usr-scholar-01", attendance: "PRESENT" as AttendanceStatus },
    { meetingId: "mtg-002", scholarId: "usr-scholar-02", attendance: "EXCUSED" as AttendanceStatus },
    { meetingId: "mtg-002", scholarId: "usr-scholar-03", attendance: "PRESENT" as AttendanceStatus },
    { meetingId: "mtg-003", scholarId: "usr-scholar-01", attendance: "PRESENT" as AttendanceStatus },
    { meetingId: "mtg-003", scholarId: "usr-scholar-02", attendance: "ABSENT" as AttendanceStatus },
    { meetingId: "mtg-003", scholarId: "usr-scholar-03", attendance: "PRESENT" as AttendanceStatus },
  ] as MockAttendanceRecord[],

  resources: [
    {
      id: "res-001",
      name: "HTML Cheatsheet.pdf",
      type: "PDF",
      courseId: "crs-001",
      uploadedAt: "2026-09-01T10:00:00Z",
      url: "https://storage.scholarlink.dev/resources/html-cheat.pdf",
      uploadedBy: "usr-mentor-01",
      visibility: "PUBLIC",
    },
    {
      id: "res-002",
      name: "CSS Flexbox Guide",
      type: "LINK",
      courseId: "crs-001",
      uploadedAt: "2026-09-02T10:00:00Z",
      url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
      uploadedBy: "usr-mentor-01",
      visibility: "PUBLIC",
    },
    {
      id: "res-003",
      name: "Leadership Talk Recording",
      type: "VIDEO",
      courseId: "crs-003",
      uploadedAt: "2026-09-10T10:00:00Z",
      url: "https://storage.scholarlink.dev/resources/leadership.mp4",
      uploadedBy: "usr-mentor-02",
      visibility: "PRIVATE",
    },
  ] as MockResource[],

  invitations: [
    {
      id: "inv-001",
      email: "new.scholar@test.com",
      role: "SCHOLAR" as const,
      status: "PENDING" as InvitationStatus,
      expiresAt: new Date(Date.now() + 48 * 3600_000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
      invitedByName: "Admin User",
      courseId: "crs-001",
    },
    {
      id: "inv-002",
      email: "new.mentor@test.com",
      role: "MENTOR" as const,
      status: "SENT" as InvitationStatus,
      expiresAt: new Date(Date.now() + 24 * 3600_000).toISOString(),
      createdAt: new Date(Date.now() - 24 * 3600_000).toISOString(),
      invitedByName: "Admin User",
    },
  ] as MockInvitation[],

  auditLogs: (() => {
    const logs: AuditLogEntry[] = [];
    const events = [
      "SCHOLAR_JOINED", "MENTOR_PAIRED", "ASSIGNMENT_PUBLISHED",
      "ASSIGNMENT_SUBMITTED", "ASSIGNMENT_VERIFIED", "MEETING_SCHEDULED",
      "ATTENDANCE_UPDATED", "SETTINGS_UPDATED", "SCHOLAR_INVITED",
      "PROGRAM_ARCHIVED", "COURSE_ARCHIVED", "REPORT_GENERATED",
    ];
    const entityTypes: Record<string, string> = {
      SCHOLAR_JOINED: "USER",
      SCHOLAR_INVITED: "INVITATION",
      PROGRAM_ARCHIVED: "PROGRAM",
      COURSE_ARCHIVED: "COURSE",
      REPORT_GENERATED: "REPORT",
    };
    for (let i = 0; i < 50; i++) {
      const evt = events[i % events.length];
      const actors = ["Admin User", "Mentor User", "Chi Nwosu"];
      logs.push({
        id: `audit-${String(i + 1).padStart(3, "0")}`,
        entityType: entityTypes[evt] ?? (evt.includes("ASSIGNMENT") ? "ASSIGNMENT" : evt.includes("MEETING") ? "MEETING" : "USER"),
        entityId: `entity-${i}`,
        entityLabel: `Entity ${i + 1}`,
        eventType: evt,
        actorName: actors[i % actors.length],
        actorRole: (i % 3 === 0 ? "SUPER_ADMIN" : i % 3 === 1 ? "MENTOR" : "SCHOLAR") as UserRole,
        action: evt.replace(/_/g, " ").toLowerCase(),
        detail: `Automated log entry for ${evt}`,
        at: new Date(Date.now() - (50 - i) * 3600_000).toISOString(),
      });
    }
    return logs;
  })(),

  reports: [] as MockReport[],

  importJobs: [] as MockImportJob[],

  orgSettings: {
    assignmentWeight: 70,
    attendanceWeight: 30,
    atRisk: { attendancePct: 60, assignmentPct: 50, overdueCount: 3 },
    lateSubmissionPenaltyPct: 20,
    assignmentEditWindowMinutes: 60,
    attendance: { excusedAllowed: true, requireExcuseReason: false, reminderHoursBefore: 24 },
  } as MockOrgSettings,

  conversations: [
    {
      id: "conv-001",
      name: "Mentor User",
      avatarUrl: "",
      lastMessage: { text: "How's the landing page coming along?", at: "2026-09-10T12:00:00Z", fromMe: false },
      unreadCount: 1,
      scholarId: "usr-scholar-01",
      mentorId: "usr-mentor-01",
    },
  ],

  messages: [
    {
      id: "msg-001",
      conversationId: "conv-001",
      senderId: "usr-mentor-01",
      senderName: "Mentor User",
      text: "Hi! Let me know if you need help with the HTML assignment.",
      sentAt: "2026-09-10T11:00:00Z",
    },
    {
      id: "msg-002",
      conversationId: "conv-001",
      senderId: "usr-scholar-01",
      senderName: "Scholar User",
      text: "Thanks! I'm making good progress.",
      sentAt: "2026-09-10T11:30:00Z",
    },
    {
      id: "msg-003",
      conversationId: "conv-001",
      senderId: "usr-mentor-01",
      senderName: "Mentor User",
      text: "How's the landing page coming along?",
      sentAt: "2026-09-10T12:00:00Z",
    },
  ],
};

/* ── Helper: compute scholar stats ── */

export function computeScholarStats(scholarId: string) {
  const submissions = db.submissions.filter((s) => s.scholarId === scholarId);
  const assignments = db.assignments.filter((a) => a.published);
  const totalAssignments = assignments.length || 1;
  const verifiedCount = submissions.filter((s) =>
    ["VERIFIED", "VERIFIED_LATE"].includes(s.status)
  ).length;
  const assignmentPct = Math.round((verifiedCount / totalAssignments) * 100);

  const records = db.attendance.filter((a) => a.scholarId === scholarId);
  const presentCount = records.filter((r) => r.attendance === "PRESENT").length;
  const excusedCount = records.filter((r) => r.attendance === "EXCUSED").length;
  const totalCount = records.length || 1;
  const excusedAllowed = db.orgSettings.attendance.excusedAllowed;
  const effectiveTotal = excusedAllowed ? totalCount - excusedCount : totalCount;
  const attendancePct =
    effectiveTotal > 0 ? Math.round((presentCount / effectiveTotal) * 100) : 100;

  const aw = db.orgSettings.assignmentWeight / 100;
  const attw = db.orgSettings.attendanceWeight / 100;
  const overall = Math.round(assignmentPct * aw + attendancePct * attw);

  const overdueCount = submissions.filter((s) => s.status === "VERIFIED_LATE").length +
    assignments.filter((a) => {
      const sub = submissions.find((s) => s.assignmentId === a.id);
      return !sub && new Date(a.dueAt) < new Date();
    }).length;

  const thresholds = db.orgSettings.atRisk;
  const atRisk =
    assignmentPct < thresholds.assignmentPct ||
    attendancePct < thresholds.attendancePct ||
    overdueCount >= thresholds.overdueCount;

  return { assignmentPct, attendancePct, overall, overdueCount, atRisk, effectiveTotal: totalCount };
}

export function getSyllabus() {
  return { assignmentWeight: db.orgSettings.assignmentWeight, attendanceWeight: db.orgSettings.attendanceWeight };
}

/**
 * Per-scholar task status overrides so that "Not started"/"In progress"
 * toggling on one scholar never mutates the shared assignment record.
 */
export const scholarStatusOverrides = new Map<string, AssignmentStatus>();

export function getScholarTaskStatus(
  scholarId: string,
  assignmentId: string,
  fallback: AssignmentStatus
): AssignmentStatus {
  return scholarStatusOverrides.get(`${scholarId}:${assignmentId}`) ?? fallback;
}

/**
 * Records an audit log entry on the in-memory store. New entries are newest-first.
 */
export function recordAuditLog(entry: Omit<AuditLogEntry, "id" | "at"> & { at?: string; id?: string }) {
  const log: AuditLogEntry = {
    id: entry.id ?? `audit-${uid()}`,
    ...entry,
    at: entry.at ?? new Date().toISOString(),
  };
  db.auditLogs.unshift(log);
  return log;
}
