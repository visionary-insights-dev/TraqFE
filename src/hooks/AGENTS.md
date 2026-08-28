# src/hooks — Custom React Hooks

## Purpose
All TanStack Query hooks live here. Components never call the API directly.

## Naming Convention
- `useX()` — data fetching hook (useAssignments, useScholarDashboard, etc.)
- `useMutateX()` — mutation hook (useMutateAssignment, useMarkAsDone, etc.)
- `useXStore()` — store accessor hook

## Rules
- Every hook that fetches data must handle: loading, error, empty states
- Mutations must invalidate relevant queries on success
- Never put UI logic in hooks
- Query keys must be consistent — define them as constants, not inline strings
