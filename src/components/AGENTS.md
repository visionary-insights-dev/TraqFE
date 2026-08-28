# src/components — UI Components

## Structure
- `ui/` — Base design system primitives (Button, Input, Card, Badge, etc.)
- `shared/` — Cross-role components (Providers, TopNavBar, BottomNav, EmptyState, ErrorState)
- `scholar/` — Scholar-specific components (mobile-first)
- `mentor/` — Mentor-specific components (not yet started)
- `admin/` — Admin-specific components (not yet started)

## Every Component Folder Contains
- `index.tsx` — the component
- `types.ts` — props interface
- `ComponentName.test.tsx` — tests
- `index.ts` — barrel export

## Rules
- No raw hex colours — use Tailwind tokens only
- No inline styles
- All props typed in types.ts — no inline type definitions
- Tailwind only for styling — no CSS modules, no styled-components
- Mobile touch targets min 44×44px on interactive elements
- Scholar components must never expose peer data

## Current State
See PROGRESS.md at the project root for which components are built.
