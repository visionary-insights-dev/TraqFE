# TRAQ Landing Page Handoff

## Implemented

The root route now renders the TRAQ public landing page from `src/components/shared/LandingPageView/index.tsx`, with the thin App Router entry point retained in `src/app/page.tsx`. The page follows the supplied desktop and mobile references: compact violet TRAQ navigation, two-column hero, capability strip, six capability cards, workspace image section, role-based cards, CTA band, mobile menu, and stacked mobile footer.

## Exact assets

The visual references supplied in `Traq(3).zip` were used as the source. The hero and workspace photographs were cropped deterministically from the supplied desktop reference and are stored at `public/landing/hero-programs.jpg` and `public/landing/workspace-program.jpg`. The image panels use fixed aspect-ratio containers with `next/image` fill mode and `object-cover`, so the source images fill their placeholders without distortion. No generated substitute image was used.

## Current routes

The landing page is available at `/`. Primary actions currently point to the valid `#get-started` CTA anchor so the scaffold has no broken navigation dead ends. When the official authentication route is added, these links can be changed to `/login`.

## Validation

The implementation passed `npm run lint`, `npm run type-check`, `npm test`, and `env -u NODE_ENV npm run build` in the development environment. The build uses `env -u NODE_ENV` because the sandbox can inject a non-standard `NODE_ENV`; on a normal Windows terminal, run the repository commands from the README.

## Next integration steps

Create or confirm the official authentication route before enabling the CTA links. Replace the temporary mailto support link with the approved support address. Confirm the final landing-page copy, legal URLs, image licensing, and Figma node references with the product manager before merge.
