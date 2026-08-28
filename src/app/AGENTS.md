# src/app — Next.js App Router Pages

## Route Groups
- `(auth)/` — Login, magic link, onboarding. No layout shell. Full-screen mobile views.
- `(scholar)/` — Scholar experience. Mobile-first. Bottom nav layout.
- `(mentor)/` — Mentor experience. Not yet started — waiting on Figma.
- `(admin)/` — Admin experience. Desktop-first. Sidebar layout. Not yet started — waiting on Figma.

## Each Route Should Have
- `page.tsx` — thin, just renders the View component
- `loading.tsx` — skeleton UI (Suspense boundary)
- `error.tsx` — error boundary with "Try again" button
- The actual UI logic lives in `src/components/{role}/{ScreenName}View/`

## Do Not
- Do not put business logic or API calls in page.tsx
- Do not share layout components between role groups
- Do not add middleware bypass — auth is enforced in middleware.ts at the root

## Current State
See PROGRESS.md at the project root for which pages are built.
