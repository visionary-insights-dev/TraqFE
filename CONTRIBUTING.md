# Contributing to Traq FE

Welcome! This guide covers how to set up the project, use the AI tooling, and ship work cleanly.

---

## Prerequisites

- **Node 22** and **npm**
- **[opencode](https://opencode.ai)** installed (`npm i -g opencode-ai`)
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** (optional — configs are mirrored in `.claude/`)
- A **Figma** account with access to the Traq file (key: `LOwDLoSh0qxmDH1VHuLO7w`)

---

## Setup

```bash
git clone https://github.com/visionary-insights-dev/TraqFE.git
cd TraqFE
npm ci
```

Then unzip the shared AI config into the project root:

```bash
unzip traq-ai-setup.zip
```

This restores `.opencode/`, `.claude/`, `opencode.json`, `AGENTS.md`, `CLAUDE.md`, and `PROGRESS.md`. The `opencode.json` MCP block for Figma requires one-time OAuth (see [Pulling from Figma](#pulling-from-figma)).

Start coding:

```bash
npm run dev
```

---

## How the AI setup works

- **`opencode.json`** — sets the model (`anthropic/claude-sonnet-4-6`), auto-injects `AGENTS.md` as instructions, and enforces `no_main_branch_edits`.
- **`AGENTS.md`** — project rules, stack, code rules, API contract, key business rules, and the file structure. Read it first.
- **`PROGRESS.md`** — the shared task board. It is the single source of truth for what is done, in progress, and next.
- Nested `src/*/AGENTS.md` files carry area-specific rules (e.g., `src/app/AGENTS.md`).

---

## Agents

Agents auto-delegate when your prompt matches their description, or invoke one explicitly with `@name`:

| Agent | Trigger | Example prompt |
|---|---|---|
| `figma-implementer` | "implement this Figma design", "build this from Figma", paste a Figma URL or node ID | `@figma-implementer implement 2412:13539` |
| `component-builder` | "build a … component", "scaffold a …" | `@component-builder build a StatusBadge` |
| `test-writer` | "write tests for …", "add test coverage" | `@test-writer write tests for the Sign In screen` |
| `a11y-auditor` | "audit accessibility", "check a11y" | `@a11y-auditor audit the Scholar Dashboard` |

All agents follow the rules in `AGENTS.md` and use named exports, strict TypeScript, Tailwind tokens, and TanStack Query for data.

---

## Commands (type in the TUI)

| Command | What it does |
|---|---|
| `/new-component Name [role]` | Scaffolds a typed, tested component with a barrel export (`shared`, `admin`, `mentor`, `scholar`) |
| `/new-page` | Creates a new route page in the correct role group |
| `/review <file\|diff>` | Runs the ScholarLink security + correctness checklist |
| `/deploy` | Runs the pre-deployment verification checklist |

---

## Skills (auto-load by task)

Skills activate automatically when you phrase a request that matches their trigger — no install needed. Say the trigger phrase and the skill guides the agent:

| Skill | Trigger |
|---|---|
| `figma-design-to-code` | "implement this Figma design", "turn this Figma into code" |
| `code-review` | "review this before I merge", "is this code safe?" |
| `accessibility-review` | "audit accessibility", "check a11y", "is this accessible?" |
| `testing-strategy` | "how should we test", "test strategy for …", "what tests do we need" |
| `design-system` | "audit the design system", "check naming inconsistencies" |
| `frontend-design` | "design this screen", "help with the visual design" |
| `tech-debt` | "tech debt", "what should we refactor", "code health" |
| `standup` | "standup", "prepare my standup update" |
| `deploy-checklist` | "deploy checklist", "pre-deployment verification" |

---

## Pulling from Figma

The Figma MCP is configured in `opencode.json` (remote, OAuth). On first run, opencode will prompt you to authenticate with Figma — follow the flow in the TUI.

**Workflow:**

1. Find the screen's node ID in the **Figma Reference** table of `PROGRESS.md`.
2. Build the node URL: `https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq?node-id=2412%3A13539`
3. Hand the URL or node ID to the `figma-implementer` agent — it loads the `figma-design-to-code` skill first, then calls `get_design_context` to pull a reference React + Tailwind output, a screenshot, and hints.

**Rules when implementing from Figma:**

- Treat the output as a **reference, not final code** — adapt it to ScholarLink's stack and tokens.
- **Reuse** existing components and design tokens in `src/components/ui/` before creating new ones.
- **Icons/images** come from exported asset URLs (`/api/mcp/asset/…`) that expire in ~7 days — download and commit them, don't hand-write SVGs.
- Never reach for `get_metadata` / `get_screenshot` as a substitute for `get_design_context`.

**Troubleshooting:**

- The URL must contain a `node-id`. A file-only URL? Ask the designer for the specific node.
- Timeout? Retry against a smaller node or selection.
- Desktop-app fallback: if you prefer the local Dev Mode MCP, enable it in Figma Desktop → Preferences → MCP and change `opencode.json` to `"type": "local", "command": ["npx","-y","figma-developer-mcp","--stdio"]`. The file must be open in Figma.

---

## Development workflow

1. **Claim** an item in `PROGRESS.md` — move it to **What's In Progress**, add your name and date.
2. Build the screen/screen component using the agents and commands above.
3. Follow the code rules in `AGENTS.md` (strict TypeScript, no `any`, TanStack Query, Tailwind tokens, no `organizationId` on the client).
4. **Run the quality gates** locally before committing (see [Quality gates & CI](#quality-gates--ci)).
5. Update `PROGRESS.md`: check the item off, move it to **What's Done**.
6. Commit with a conventional message and push.

Never edit files directly on `main`.

---

## Quality gates & CI

Run these locally before opening a PR — they match the GitHub Actions pipeline:

```bash
npm run lint          # ESLint
npm run type-check    # tsc --noEmit
npm run test          # Jest (--passWithNoTests until specs exist)
npm run test:e2e      # Playwright (--pass-with-no-tests until specs exist)
npm run build         # next build
```

**CI** (`.github/workflows/ci.yml`) runs on every push to `main` and every PR:

- **`checks`** job — lint → type-check → unit tests → build. Publishes the `.next/` build artifact.
- **`e2e`** job (needs `checks`) — restores the build, installs Chromium, runs Playwright. Uploads `playwright-report/` as an artifact if it fails.
- Concurrency: superseded runs on the same branch are cancelled automatically.

Don't push broken code — a failing `checks` job blocks the `e2e` job and vice versa.

---

## Testing

**Unit tests** (Jest + React Testing Library):

- Colocate tests: `src/components/foo/Button.test.tsx`
- Use `@testing-library/react` + `@testing-library/user-event`
- Mock the API with **MSW** (never hit the real API in unit tests)
- Import shared types from `@scholarlink/types`
- Run with `npm run test`

**E2E tests** (Playwright):

- Under `tests/e2e/{auth,scholar}/…` — mirrors the screen structure
- Use **shared fixtures** from `tests/fixtures/` — never hardcode IDs or emails
- The four critical flows (from `tests/e2e/AGENTS.md`) must pass before any deploy:
  1. Invitation → Registration → First login → Dashboard
  2. Scholar: View assignment → Mark as done → Status changes to Pending Verification
  3. Scholar: Cannot access `/mentor` or `/admin` routes
  4. Attendance rate displays correctly (excused excluded from denominator)
- Run a single group: `npm run test:e2e -- --grep "auth"`

---

## Accessibility

ScholarLink targets **WCAG 2.1 AA**. Key points:

- Scholar screens are **mobile-first at 393px** — ensure touch targets are sized correctly.
- Use semantic HTML and ARIA attributes where visual patterns exist.
- Keyboard navigation must work end-to-end; verify focus order and visible focus rings.
- Run the **a11y-auditor** agent (`@a11y-auditor audit …`) before handing off any screen.

---

## PROGRESS.md etiquette

`PROGRESS.md` is the team brain — keep it accurate:

- **Pick up** an item → move it to **What's In Progress**, write your name and the date.
- **Done** → check the box, move it to **What's Done**.
- **Decisions** → log them in the **Decisions Made** table (date, decision, why).
- **Blockers** → log them in **Known Gaps / Blockers** with owner and status.
- **Figma nodes** → keep the Figma Reference table up to date.
- Commit `PROGRESS.md` with every PR so the next dev picks up exactly where you left off.

---

## Quick reference

```bash
# Dev / build / test
npm run dev
npm run build && npm run start
npm run lint && npm run type-check && npm run test && npm run test:e2e

# AI
@figma-implementer  …
@component-builder  …
@test-writer        …
@a11y-auditor       …
/new-component Name role
/new-page
/review <path|diff>
/deploy

# Figma file key
LOwDLoSh0qxmDH1VHuLO7w
https://www.figma.com/design/LOwDLoSh0qxmDH1VHuLO7w/Traq
```
