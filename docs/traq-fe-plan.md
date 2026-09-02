# Traq FE — Complete Build Plan

## What Exists in Figma

| Panel | Viewport | Screen Count |
| --- | --- | --- |
| Landing Page | 1440px desktop + 393px mobile | 2 |
| Auth Flow | 1280px desktop | 8 |
| Scholar Panel | 1280px desktop + 393px mobile | 7 × 2 |
| Mentor Panel | 1280px desktop | 7 |
| Admin Panel | 1440px desktop | 24 |
| **Total** | | **~55 screens** |

---

## All Screens & Figma Node IDs

### Landing Page (node-id: 2247-27)

| Screen | Node ID | Viewport |
| --- | --- | --- |
| Landing Page Desktop | `2247:28` | 1440px |
| Landing Page Mobile | `2247:199` | 393px |

### Auth Screens — shared across all roles (build once)

Auth screens exist in each panel but are identical. Build from Scholar Web panel.

| Screen | Node ID |
| --- | --- |
| Sign In | `2019:6155` |
| Magic Link | `2019:6117` |
| Magic Link Sent | `2019:6334` |
| Forgot Password | `2489:21203` |
| OTP Verification | `2500:21254` |
| New Password Confirmation | `2504:21304` |
| Onboarding: Profile Setup | `2019:6263` |
| Onboarding: Success | `2019:6221` |

### Scholar Panel — Desktop (1280px)

| Screen | Node ID |
| --- | --- |
| Dashboard | `2374:7557` |
| My Courses & Progress | `2374:8399` |
| Assignments | `2374:8679` |
| Resources | `2378:8993` |
| My Cohort | `2378:9325` |
| Chat | `2381:9611` |
| Profile & Settings | `2383:9886` |

### Scholar Panel — Mobile (393px)

| Screen | Node ID |
| --- | --- |
| Dashboard | `2412:13539` |
| My Courses & Progress | `2412:13671` |
| Assignments | `2412:13759` |
| Resources | `2412:13835` |
| My Cohort | `2412:13901` |
| Chat | `2412:14004` |
| Profile & Settings | `2412:14076` |

### Mentor Panel — Desktop (1280px)

| Screen | Node ID |
| --- | --- |
| My Scholars Roster | `2228:21722` |
| Resource Center | `2235:22261` |
| Upload Resource Modal | `2235:22678` |
| Assignments | `2235:23075` |
| Verification Queue | `2235:23289` |
| Meetings & Attendance | `2235:23809` |
| Profile & Settings | `2235:24082` |

### Admin Panel — Desktop (1440px)

| Screen | Node ID |
| --- | --- |
| Super Admin Dashboard | `2074:6608` |
| Programs (Setup) | `2074:7018` |
| Programs (Management) | `2576:39168` |
| Course Management | `2074:7490` |
| Scholar Management | `2074:7935` |
| Scholar Profile | `2529:31945` |
| Mentor Management | `2074:8477` |
| Mentor Profile | `2529:32141` |
| Sort / Pair | `2074:8883` |
| Meetings Management | `2074:9111` |
| Analytics & Reporting | `2074:9517` |
| Settings | `2074:10017` |
| Sub-Settings (Attendance) | `2529:32559` |
| Assignments List | `2529:30152` |
| Assignment Detail | `2529:30342` |
| Create Assignment | `2529:30580` |
| Submission & Verification Queue | `2529:30767` |
| Submission Detail | `2529:30896` |
| Attendance Management | `2529:31047` |
| Attendance Roster | `2529:31294` |
| Attendance Modification History | `2529:31476` |
| Import Users via CSV | `2529:31732` |
| Invitation Management | `2529:32336` |
| Audit Log | `2529:32682` |

---

## User Flows

### Flow 1 — Public Landing

```
/ (Landing Page)
  ├── "Get Started" → /auth/sign-in (or /auth/onboarding if invite link)
  └── "Sign In" → /auth/sign-in
```

### Flow 2 — Authentication

```
/auth/sign-in
  ├── Email + Password → role-based redirect
  │     ├── SUPER_ADMIN → /admin/dashboard
  │     ├── MENTOR → /mentor/scholars
  │     └── SCHOLAR → /scholar/dashboard
  ├── "Get Magic Link" → /auth/magic-link
  │     └── Submit email → /auth/magic-link-sent
  │           └── Click email link → /auth/sign-in (auto-login)
  └── "Forgot Password" → /auth/forgot-password
        └── Submit email → OTP sent
              └── /auth/otp-verification
                    └── Valid OTP → /auth/new-password
                          └── Submit → /auth/sign-in
```

### Flow 3 — Onboarding (first login via invitation)

```
Invitation email link → /auth/sign-in (pre-filled)
  └── First login detected
        └── /auth/onboarding (Profile Setup)
              → Upload photo, full name, phone, role confirmation
              └── Submit → /auth/onboarding/success
                    └── "Go to Dashboard" → role-based dashboard
```

### Flow 4 — Scholar Experience

```
/scholar/dashboard
  ├── Program progress summary
  ├── Upcoming meetings widget
  ├── Active tasks list → /scholar/assignments
  ├── Mentor card
  └── Attendance summary

/scholar/assignments
  ├── Filter by status (All / Pending / Awaiting / Completed)
  ├── Assignment card → assignment detail (inline or modal)
  │     └── "Mark as Done" → status → PENDING_VERIFICATION
  │           └── After 60 min lock → "Request Change" replaces Edit
  └── OVERDUE state shown when past due_at

/scholar/courses
  ├── Course cards
  ├── Progress summary (Tasks + Attendance %)
  └── Assigned Mentor info

/scholar/resources
  ├── Search bar
  └── Resource cards (PDF, links, files)

/scholar/cohort
  └── Cohort members list (no peer progress visible)

/scholar/chat
  └── Conversation list + message thread

/scholar/profile
  ├── Personal information
  ├── Notification preferences
  └── Account & Security
```

### Flow 5 — Mentor Experience

```
/mentor/scholars
  ├── Scholar roster (assigned scholars only)
  └── Scholar row → scholar detail (read-only view)

/mentor/assignments
  ├── Assignments created by this mentor
  ├── Create new assignment → form
  │     └── Set title, description, deadline, course, audience
  │           └── Publish → scholar rows created + jobs queued
  │                 └── 60-min edit window active
  └── Assignment row → detail

/mentor/verification
  ├── Queue of PENDING_VERIFICATION submissions
  ├── Submission detail → view scholar's work
  │     ├── "Verify" → VERIFIED (or VERIFIED_LATE)
  │     ├── "Request Resubmission" → RESUBMISSION_REQUIRED
  │     └── After lock: Change Request workflow
  └── Filters by course / status

/mentor/attendance
  ├── Meeting list
  ├── Meeting row → Attendance Roster
  │     └── Mark each scholar: Present / Absent / Excused
  │           └── Save → attendance rate recalculated
  └── Create new meeting

/mentor/resources
  ├── Resource library
  └── Upload resource (modal) → direct R2 upload

/mentor/profile
  └── Profile + Settings
```

### Flow 6 — Admin Experience

```
/admin/dashboard
  └── Program-wide metrics, at-risk alerts, recent activity

/admin/programs
  ├── Programs list
  ├── Create program → Program Setup form
  └── Program detail → courses, members, progress

/admin/courses
  ├── Courses list
  ├── Create course
  └── Course detail → members, assignments

/admin/scholars
  ├── Scholar directory (all scholars in org)
  ├── Invite scholar → /admin/invitations
  ├── Import via CSV
  └── Scholar row → Scholar Profile
        └── Progress, attendance, assignments, meetings, audit

/admin/mentors
  ├── Mentor directory
  ├── Invite mentor → /admin/invitations
  └── Mentor row → Mentor Profile
        └── Assigned scholars, assignments created, meetings

/admin/pair
  └── Sort or Pair — select scholars, select mentor, pair

/admin/assignments
  ├── All assignments (org-wide)
  ├── Assignment detail
  ├── Create assignment (on behalf of mentor)
  ├── Submission & Verification Queue
  └── Submission detail

/admin/attendance
  ├── Attendance overview
  ├── Meeting roster → mark attendance
  └── Modification history (audit trail)

/admin/meetings
  └── All meetings org-wide

/admin/analytics
  └── Reports — program progress, attendance rates, assignment completion
        └── Generate report → 202 Accepted → poll → download

/admin/invitations
  └── Invite management — pending, expired, resend

/admin/settings
  ├── Organization settings
  │     ├── Progress weights (assignment % + attendance %)
  │     ├── At-risk thresholds
  │     ├── Late submission penalty
  │     └── Assignment edit window (minutes)
  └── Sub-settings (Attendance configuration)

/admin/audit
  └── Audit log — append-only, filterable by entity/actor/date
```

---

## Build Phases

### Phase 0 — Foundation

Set up before any screen. Everything else depends on this.

```
- Next.js App Router project structure
- Tailwind config with design tokens
- Shared layout components:
    TopNavBar (Landing)
    AuthLayout (two-panel: visual left, form right)
    ScholarLayout (sidebar + bottom nav mobile)
    MentorLayout (sidebar)
    AdminLayout (sidebar, wider)
- API client (src/lib/api/client.ts)
- Auth store (src/stores/auth.ts)
- TanStack Query provider
- Route middleware (role-based guards)
- Shared UI primitives:
    Button, Input, Label, Badge, Card,
    EmptyState, ErrorState, LoadingSpinner,
    Modal, Toast/Notification
```

**OpenCode prompt:**

```
Set up the Traq FE foundation following AGENTS.md.

1. Configure tailwind.config.ts with the design system tokens 
   from the Figma Design System page

2. Build shared layout components:
   - src/components/layouts/AuthLayout.tsx (two-panel: visual left, form right 640/640)
   - src/components/layouts/ScholarLayout.tsx (sidebar desktop, bottom nav mobile)
   - src/components/layouts/MentorLayout.tsx (sidebar, 1280px)
   - src/components/layouts/AdminLayout.tsx (sidebar, 1440px)

3. Build base UI primitives in src/components/ui/:
   Button, Input, Label, Badge, Card, Modal,
   EmptyState, ErrorState, LoadingSpinner, Toast

4. Set up route groups in src/app/:
   (public)/ (auth)/ (scholar)/ (mentor)/ (admin)/

5. Create middleware.ts for role-based route protection

Run tsc --noEmit after each step.
```

---

### Phase 1 — Landing Page

Public-facing. No auth required. Desktop + mobile.

**Sections to build:**

- TopNavBar (Logo, nav links, Sign In + Get Started buttons)
- Hero Section (headline, subhead, 2 CTAs)
- Value Strip (4 feature pills)
- Features Bento (6 feature cards in grid)
- Roles Section (Super Admin / Mentor / Scholar cards)
- CTA Section (headline + 2 buttons)
- Footer (links + copyright)
- Mobile version (responsive, hamburger nav, stacked layout)

**OpenCode prompt:**

```
Implement the Traq Landing Page.

Desktop Figma URL: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2247-28
Mobile Figma URL: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2247-199

Use the figma-implementer agent. Build it in src/app/(public)/page.tsx.

Requirements:
- Fully responsive (desktop 1440px → mobile 393px)
- TopNavBar is a shared component (will be reused)
- Footer is a shared component (will be reused)
- "Get Started" → /auth/sign-in
- "Sign In" → /auth/sign-in
- No auth required — fully public
- Smooth scroll to sections for nav links
```

---

### Phase 2 — Auth Flow

Build once. All three roles use the same auth screens.
Use the Scholar Web panel as the design reference (1280px).

**Build order within auth:**

1. Sign In (most critical — everything starts here)
2. Magic Link + Magic Link Sent
3. Forgot Password + OTP Verification + New Password
4. Onboarding: Profile Setup + Onboarding: Success

**OpenCode prompts:**

**Sign In:**

```
Implement the Sign In screen.
Figma URL: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2019-6155

Use the figma-implementer agent. Build in src/app/(auth)/sign-in/.

Requirements:
- Two-panel layout (AuthLayout)
- Email + Password form with validation (Zod)
- "Remember Me" checkbox
- "Get Magic Link" → /auth/magic-link
- "Forgot Password" → /auth/forgot-password
- On success: POST /api/v1/auth/login
  → store access token in memory (not localStorage)
  → redirect based on role:
    SUPER_ADMIN → /admin/dashboard
    MENTOR → /mentor/scholars
    SCHOLAR → /scholar/dashboard
- Error: show inline message for wrong credentials
- Loading state on submit button
```

**Magic Link:**

```
Implement the Magic Link screen.
Figma URL: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2019-6117

Use the figma-implementer agent. Build in src/app/(auth)/magic-link/.

Requirements:
- Email input + "Send Magic Link" button
- "Back to Login" → /auth/sign-in
- On submit: POST /api/v1/auth/magic-link
- On success → /auth/magic-link-sent (pass email in state for display)
```

**Magic Link Sent:**

```
Implement the Magic Link Sent confirmation screen.
Figma URL: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2019-6334

Build in src/app/(auth)/magic-link-sent/.
Show the email address. Include "Resend" button with 60s cooldown.
```

**Forgot Password → OTP → New Password:**

```
Implement the full password reset flow as three screens:

1. Forgot Password
   Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2489-21203
   Path: src/app/(auth)/forgot-password/

2. OTP Verification  
   Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2500-21254
   Path: src/app/(auth)/otp-verification/
   6-digit OTP input. Auto-advance on each digit. Resend with cooldown.

3. New Password Confirmation
   Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2504-21304
   Path: src/app/(auth)/new-password/
   Password + Confirm Password. Validate match. On success → /auth/sign-in.

API calls:
- POST /api/v1/auth/forgot-password
- POST /api/v1/auth/verify-otp
- POST /api/v1/auth/reset-password
```

**Onboarding:**

```
Implement the Onboarding flow for first-time login.

1. Profile Setup
   Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2019-6263
   Path: src/app/(auth)/onboarding/
   - Profile photo upload (direct to R2 via signed URL)
   - Full name input
   - Phone number input
   - On submit → PATCH /api/v1/users/me/profile

2. Success
   Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2019-6221
   Path: src/app/(auth)/onboarding/success/
   - "Go to Dashboard" → role-based redirect

Middleware must redirect to /auth/onboarding if 
user.profileComplete === false after login.
```

---

### Phase 3 — Scholar Experience

Desktop (1280px) + Mobile (393px) for every screen.
Build desktop first, then the mobile version as a separate layout variant.

**Build order:**

1. Dashboard (most important — sets the pattern)
2. Assignments (core daily action)
3. Courses & Progress
4. Resources
5. Cohort
6. Chat
7. Profile & Settings

**OpenCode prompts:**

**Scholar Dashboard:**

```
Implement the Scholar Dashboard — both desktop and mobile.

Desktop Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2374-7557
Mobile Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2412-13539

Use the figma-implementer agent. 
Path: src/app/(scholar)/dashboard/

Components to extract:
- ProgramProgressCard — overall progress % with breakdown
- UpcomingMeetingCard — next meeting date/time/mentor
- ActiveTasksList — 3-5 most urgent assignments
- MentorCard — assigned mentor info
- AttendanceSummary — attendance % this period

Data: GET /api/v1/analytics/dashboard (scholar-scoped)

Rules:
- Progress % must show breakdown (assignments 70% + attendance 30%)
- At-risk: show constructive message if below threshold — 
  "Your attendance is currently below the program target"
  NOT a red label
- Real-time: listen for analytics.course.updated WebSocket event
  → invalidate dashboard query
- Scholar CANNOT see other scholars' data
```

**Scholar Assignments:**

```
Implement the Scholar Assignments screen — desktop and mobile.

Desktop Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2374-8679
Mobile Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2412-13759

Path: src/app/(scholar)/assignments/

Key components:
- AssignmentCard — title, due date, status badge, CTA
- StatusFilterBar — All / Pending / Awaiting / Completed / Overdue
- AssignmentDetail — inline panel or modal with Mark as Done

Status badge colours and labels:
- NOT_STARTED → neutral
- IN_PROGRESS → blue
- PENDING_VERIFICATION → amber
- VERIFIED → green
- VERIFIED_LATE → green with "Late" note
- RESUBMISSION_REQUIRED → orange
- OVERDUE → red

Mark as Done flow:
- Scholar taps button → POST /api/v1/assignments/:id/submissions
- Status changes to PENDING_VERIFICATION immediately (optimistic)
- WebSocket: assignment.status_changed → update card

Rules:
- Status communicated by icon + label (not colour alone)
- Offline: disable Mark as Done if no connectivity
- Excused is an attendance concept — not shown on assignments
```

**Scholar Courses & Progress:**

```
Implement Scholar Courses & Progress — desktop and mobile.

Desktop Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2374-8399
Mobile Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2412-13671

Path: src/app/(scholar)/courses/

Data: GET /api/v1/scholars/me/courses

Show per course:
- Course name + program
- Assignment completion % 
- Attendance %
- Overall progress (weighted: assignment 70%, attendance 30%)
- Assigned mentor name
- Recent tasks list

Rules:
- Progress formula rendered here — must match backend calculation
- If weights are customized by org, use org values
- Never show another scholar's progress
```

**Scholar Resources:**

```
Implement Scholar Resources — desktop and mobile.

Desktop Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2378-8993
Mobile Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2412-13835

Path: src/app/(scholar)/resources/

Data: GET /api/v1/resources (scoped to scholar's courses)

Features: search bar, resource type filter, 
resource cards with file type icon, name, upload date, download link
```

**Scholar Cohort, Chat, Profile (batch prompt):**

```
Implement these three Scholar screens — desktop and mobile for each:

1. My Cohort
   Desktop: node-id=2378-9325 | Mobile: node-id=2412-13901
   Path: src/app/(scholar)/cohort/
   Show: cohort name, member list (name + role only — NO progress/attendance of peers)

2. Chat
   Desktop: node-id=2381-9611 | Mobile: node-id=2412-14004
   Path: src/app/(scholar)/chat/
   Conversation list + message thread
   Real-time via WebSocket room user:{userId}

3. Profile & Settings
   Desktop: node-id=2383-9886 | Mobile: node-id=2412-14076
   Path: src/app/(scholar)/profile/
   Sections: Personal Info, Notification Preferences, Account & Security
   PATCH /api/v1/users/me/profile

Base Figma URL: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq
```

---

### Phase 4 — Mentor Experience

Desktop only (1280px). Mentors use the web app on desktop/tablet.

**Build order:**

1. My Scholars Roster
2. Assignments (create + manage)
3. Verification Queue (critical daily flow)
4. Meetings & Attendance
5. Resource Center
6. Profile & Settings

**OpenCode prompts:**

**My Scholars Roster:**

```
Implement the Mentor My Scholars Roster screen.
Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2228-21722

Path: src/app/(mentor)/scholars/
Data: GET /api/v1/mentor-assignments (mentor's assigned scholars)

Show per scholar: name, photo, course, overall progress %, 
attendance %, assignment completion %, at-risk flag.
Click scholar → read-only scholar profile.
MentorLayout sidebar. 1280px.
```

**Mentor Assignments:**

```
Implement Mentor Assignments screen.
Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2235-23075

Path: src/app/(mentor)/assignments/

Features:
- List of assignments created by this mentor
- Create Assignment button → inline form or modal
  Required: title, description, due date (mandatory), course, audience
  POST /api/v1/assignments
  Then POST /api/v1/assignments/:id/publish
- 60-minute edit window countdown shown on published assignments
- After 60 min: "Edit" replaced by "Request Change"
  POST /api/v1/assignments/:id/change-requests
```

**Verification Queue:**

```
Implement the Mentor Verification Queue screen.
Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2235-23289

Path: src/app/(mentor)/verification/

This is the most critical mentor flow:
1. Queue shows PENDING_VERIFICATION submissions
2. Click submission → detail view with scholar's work
3. Actions:
   - "Verify" → POST /api/v1/assignments/:id/verify
     → status: VERIFIED or VERIFIED_LATE (backend determines)
   - "Request Resubmission" → with comment
     → status: RESUBMISSION_REQUIRED
4. Real-time: assignment.verified WebSocket event 
   → remove from queue
```

**Meetings & Attendance:**

```
Implement Mentor Meetings & Attendance screen.
Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2235-23809

Path: src/app/(mentor)/attendance/

Features:
- Meeting list
- Create meeting → set title, date, course
- Open meeting → Attendance Roster
  Show all scholars in the course
  Toggle per scholar: Present / Absent / Excused
  EXCUSED excluded from attendance rate denominator
  POST /api/v1/meetings/:id/attendance (bulk)
  → attendance rates recalculated on backend
- Real-time: analytics.course.updated → refresh
```

**Mentor Resources + Profile (batch):**

```
Implement Mentor Resource Center and Profile screens.

1. Resource Center
   Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2235-22261
   Path: src/app/(mentor)/resources/
   Upload modal: node-id=2235-22678
   Upload flow: POST /resources/upload-url → PUT to R2 → POST /resources
   Max 20MB. Validate type + extension.

2. Profile & Settings
   Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2235-24082
   Path: src/app/(mentor)/profile/
```

---

### Phase 5 — Admin Experience

Desktop only (1440px). High information density.
AdminLayout: sidebar navigation, full-width content.

**Build order — critical path first:**

1. Dashboard
2. Scholar Management + Scholar Profile
3. Programs + Courses
4. Assignments (full flow)
5. Attendance (full flow)
6. Mentor Management + Pairing
7. Invitations + Import
8. Analytics & Reports
9. Settings + Audit Log

**OpenCode prompts:**

**Admin Dashboard:**

```
Implement the Super Admin Dashboard.
Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2074-6608

Path: src/app/(admin)/dashboard/
AdminLayout. 1440px. High density — tables + metric cards.

Data: GET /api/v1/analytics/dashboard (admin-scoped)
Real-time: organization:{orgId}:admins WebSocket room

Show: program-wide metrics, at-risk scholars list, 
recent activity feed, quick action shortcuts
```

**Programs:**

```
Implement Program Management screens.

1. Programs List
   Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2576-39168
   Path: src/app/(admin)/programs/

2. Program Setup (Create)
   Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2074-7018
   Path: src/app/(admin)/programs/new/

API: GET/POST /api/v1/programs, POST /api/v1/programs/:id/archive
Archive: show confirmation explaining historical data is preserved.
```

**Course Management:**

```
Implement Course Management screen.
Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2074-7490

Path: src/app/(admin)/courses/
CRUD for courses. Link courses to programs.
Archive confirmation required. Historical data preserved.
```

**Scholar Management + Profile:**

```
Implement Scholar Management screens.

1. Scholar Directory
   Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2074-7935
   Path: src/app/(admin)/scholars/
   Table: name, email, course, mentor, progress %, at-risk flag
   Actions: View Profile, Invite New Scholar

2. Scholar Profile (Admin View)
   Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2529-31945
   Path: src/app/(admin)/scholars/[id]/
   Full profile: assignments, attendance, progress chart, meetings, audit trail

API: GET /api/v1/users?role=SCHOLAR, GET /api/v1/users/:id
```

**Mentor Management + Pairing:**

```
Implement Mentor Management and Sort/Pair screens.

1. Mentor Directory
   Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2074-8477
   Path: src/app/(admin)/mentors/

2. Mentor Profile (Admin View)
   Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2529-32141
   Path: src/app/(admin)/mentors/[id]/

3. Sort / Pair
   Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2074-8883
   Path: src/app/(admin)/pair/
   Select scholars (multi-select) → select mentor → confirm pairing
   POST /api/v1/mentor-assignments
```

**Assignments (full admin flow):**

```
Implement Admin Assignment Management — 4 screens.

1. Assignments List
   Figma: node-id=2529-30152 | Path: src/app/(admin)/assignments/

2. Create Assignment
   Figma: node-id=2529-30580 | Path: src/app/(admin)/assignments/new/
   Can create on behalf of a mentor.
   Deadline is mandatory (cannot publish without it).

3. Assignment Detail
   Figma: node-id=2529-30342 | Path: src/app/(admin)/assignments/[id]/
   Overview card + submission progress panel side by side.

4. Submission & Verification Queue
   Figma: node-id=2529-30767 | Path: src/app/(admin)/assignments/verification/

5. Submission Detail
   Figma: node-id=2529-30896 | Path: src/app/(admin)/assignments/[id]/submissions/[submissionId]/

Base: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq
Admin can verify, request resubmission, or override any assignment.
```

**Attendance (full admin flow):**

```
Implement Admin Attendance Management — 3 screens.

1. Attendance Overview
   Figma: node-id=2529-31047 | Path: src/app/(admin)/attendance/

2. Attendance Roster (per meeting)
   Figma: node-id=2529-31294 | Path: src/app/(admin)/attendance/[meetingId]/
   Present / Absent / Excused per scholar.
   EXCUSED excluded from rate denominator.

3. Modification History
   Figma: node-id=2529-31476 | Path: src/app/(admin)/attendance/[meetingId]/history/
   Audit trail of who changed what and when.

Base: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq
```

**Meetings Management:**

```
Implement Meetings Management (Admin).
Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2074-9111
Path: src/app/(admin)/meetings/
Org-wide view of all meetings. Create, edit, archive.
```

**Invitations + Import CSV:**

```
Implement Invitation Management and CSV Import screens.

1. Invitation Management
   Figma: node-id=2529-32336 | Path: src/app/(admin)/invitations/
   List pending / sent / expired invitations.
   Resend, revoke. 
   POST /api/v1/users/invite → sends email → 48hr expiry.

2. Import Users via CSV
   Figma: node-id=2529-31732 | Path: src/app/(admin)/scholars/import/
   Upload CSV → validate → preview → confirm import
   POST /api/v1/users/bulk-import → 202 Accepted → poll status

Base: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq
```

**Analytics & Reports:**

```
Implement Analytics & Reporting screen.
Figma: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2074-9517
Path: src/app/(admin)/analytics/

Generate report flow:
POST /api/v1/reports → 202 Accepted → poll GET /api/v1/reports/:id
On COMPLETED → show download button
On FAILED → show error with retry

Display: program progress charts, attendance rates by course,
assignment completion rates, at-risk scholar list.
```

**Settings + Audit Log:**

```
Implement Settings and Audit Log screens.

1. Organization Settings
   Figma: node-id=2074-10017 | Path: src/app/(admin)/settings/

   Critical validations:
   - Assignment weight + Attendance weight MUST sum to 100%
     → show inline error immediately on change
     → block save until valid
   - At-risk thresholds (attendance %, assignment %, overdue count)
   - Late submission penalty %
   - Assignment edit window (minutes)
   PATCH /api/v1/organization/settings

2. Sub-Settings (Attendance)
   Figma: node-id=2529-32559 | Path: src/app/(admin)/settings/attendance/

3. Audit Log
   Figma: node-id=2529-32682 | Path: src/app/(admin)/audit/
   Append-only. Filter by: entity type, actor, date range, event type.
   GET /api/v1/audit-logs (paginated)
   Admins only. No edit/delete actions exposed.

Base: https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq
```

---

## Summary — Total Screens

| Phase | Screens | Priority |
| --- | --- | --- |
| 0 — Foundation | Layouts + UI primitives | P0 |
| 1 — Landing Page | 2 (desktop + mobile) | P1 |
| 2 — Auth Flow | 8 screens (shared) | P0 |
| 3 — Scholar Experience | 14 (7 desktop + 7 mobile) | P0 |
| 4 — Mentor Experience | 7 | P0 |
| 5 — Admin Experience | 24 | P0 |
| **Total** | **~55 screens** | |

## Build Order Rule

Always build in this order per screen:

1. Desktop layout and data wiring
2. Loading state
3. Empty state (true empty + filtered empty)
4. Error state
5. Offline handling (write actions only)
6. Mobile responsive variant
7. Tests (component + E2E)
8. Accessibility audit
9. Update PROGRESS.md
10. PR + review
