# tests/e2e — Playwright End-to-End Tests

## Structure
- `auth/` — Sign in, magic link, onboarding flows
- `scholar/` — Scholar user flows
- `mentor/` — Mentor user flows (not yet started)
- `admin/` — Admin user flows (not yet started)

## Critical Flows (Must Pass Before Any Deploy)
1. Invitation → Registration → First login → Dashboard
2. Scholar: View assignment → Mark as done → Status changes to Pending Verification
3. Scholar: Cannot access /mentor or /admin routes
4. Attendance rate displays correctly (excused excluded from denominator)

## Test Data
Use the shared test fixtures in `tests/fixtures/` — do not hardcode IDs or emails.

## Running Tests
- `npm run test:e2e` — full suite
- `npm run test:e2e -- --grep "auth"` — single group
