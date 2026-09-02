# src/app — Next.js App Router Pages

## Route Structure
- `/` — Selling landing page (public). Stored under `(public)/`.
- `/auth/*` — Login, magic link, onboarding. Two-panel AuthLayout shell. Full-screen mobile views.
- `/scholar/*` — Scholar experience. Mobile-first. ScholarLayout (sidebar + bottom nav).
- `/mentor/*` — Mentor experience. MentorLayout (sidebar).
- `/admin/*` — Admin experience. Desktop-first. AdminLayout (sidebar, wider).

Note: real path segments (`/scholar`, `/mentor`, `/admin`) are used rather than
bare route groups because route groups do not contribute URL segments — bare
groups for `/scholar/dashboard` and `/admin/dashboard` would collide as `/dashboard`.

## Auth in Route Segments
- `auth/layout.tsx` — AuthLayout shell
- `scholar/layout.tsx` — ScholarLayout shell
- `mentor/layout.tsx` — MentorLayout shell
- `admin/layout.tsx` — AdminLayout shell

Route protection is enforced in `src/middleware.ts` (reads the HTTP-only
`refresh_token` cookie, decodes the role with `jose`).

## Each Route Should Have
- `page.tsx` — thin, just renders the View component
- `loading.tsx` — skeleton UI (Suspense boundary)
- `error.tsx` — error boundary with "Try again" button
- The actual UI logic lives in `src/components/{role}/{ScreenName}View/`

## Do Not
- Do not put business logic or API calls in page.tsx
- Do not share layout components between role segments
- Do not add middleware bypass — auth is enforced in middleware.ts at the root

## Current State
See PROGRESS.md at the project root for which pages are built.
