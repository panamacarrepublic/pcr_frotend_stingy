# Jorge — Frontend Lead Onboarding

> **Audience:** Jorge (Frontend Lead) and any LLM agent working in `frontend/` on his behalf.
> **Author:** Uriel (Tech Lead). Last updated 2026-05-06.
> **This doc is the day-1 handoff. Once §3–§5 are done, archive it under `infra/docs/handoffs/` and we treat `frontend/CLAUDE.md` as the steady-state guide.**

---

## §1. Your role

You are the **Frontend Lead**. You own:

- Everything under `frontend/` — Next.js 14 App Router app, React components, hooks, lib utilities, styles.
- The **design system** — translating Edwin's Figma into tokens (colors, typography, spacing, motion) → Tailwind config + CSS custom properties → reusable components.
- **Accessibility** — WCAG 2.1 AA on every public page (PRD §6).
- **Performance budget** — Core Web Vitals targets per PRD §2 (LCP < 2.5s, INP < 200ms, CLS < 0.1). The Lighthouse CI budget is the gate.
- **Spanish (Panama) UI copy.** No English in user-facing strings without an explicit reason.
- **Frontend Sentry + PostHog instrumentation** — error reporting, perf, product events per ADR 004.

You do **not** own (talk to Uriel/Kumar instead):

- Backend endpoints, Pydantic schemas, DB schema — Kumar.
- API contract definitions in `packages/types/` — co-owned with Kumar; you consume the types, never re-declare them.
- Vercel project setup, deploy hooks, env-var routing per environment — Uriel.
- GitHub Actions config, branch protection, secret values — Uriel.

---

## §2. Read these in order before writing any code

| # | Path | Why |
|---|------|-----|
| 1 | `README.md` (root) | Stack, repo layout, daily commands |
| 2 | `CONTRIBUTING.md` (root) | Branching, commits, **Definition of Done**, coverage gate (70%), social-enforcement note |
| 3 | `infra/docs/PRD.md` | Single source of product truth — focus on §3 (personas), §5 (features), §6 (non-functional incl. accessibility), §13 (KPIs / events) |
| 4 | `infra/docs/adr/004-analytics-pipeline.md` | The 11 events you must wire. Cookie banner is your task |
| 5 | `infra/docs/adr/002-supabase-auth-and-db.md` | Frontend talks to Supabase Auth directly; backend gets the JWT in `Authorization: Bearer` |
| 6 | `infra/docs/adr/003-ai-provider-and-cost-controls.md` | Streaming SSE rendering for AI description (Fase 6) — set expectations now |
| 7 | `frontend/CLAUDE.md` | Your LLM role guide — ECC skills and MCP servers to install |
| 8 | The Figma file | Edwin's design — get edit access from him, view-only is not enough since you'll annotate components |

> **Estimated read time:** 60–90 minutes for docs + 30 min Figma walkthrough with Edwin. Block this. Don't skim.

---

## §3. Day 1 — environment verification (≈1 hour)

Goal: prove the frontend boots, lints clean, and produces a passing production build on your laptop.

### 3.1 Clone and checkout

```bash
git clone https://github.com/panamacarrepublic/panama-car-republic.git
cd panama-car-republic
git checkout develop
```

### 3.2 Install dependencies

```bash
cd frontend
npm install
```

### 3.3 Env file (placeholder values are fine for boot test)

```bash
cp .env.example .env.local
# Open .env.local. Leave defaults; Kumar will give you real Sentry + PostHog values in §4.
```

### 3.4 Verify lint, types, build

```bash
npm run lint        # ESLint with next/core-web-vitals — must pass
npx tsc --noEmit    # TypeScript strict — silent success means OK
npm run build       # Production build — must succeed
```

Sentry warnings about OpenTelemetry are **expected** and benign. A failing build for any other reason is a stop-the-line bug; tell Uriel.

### 3.5 Boot the dev server

```bash
npm run dev
```

Visit http://localhost:3000 — the placeholder home page should render.

✅ **Acceptance for Day 1:** lint, typecheck, and build all pass. Dev server renders the home page without console errors.

---

## §4. Day 2 — Figma MCP + frontend credentials (≈2 hours)

This is the hand-off that unlocks your **first real task**: converting the Figma design into React code.

### 4.1 Get credentials from Kumar

Kumar provisions Sentry and PostHog as part of his onboarding (`backend/ONBOARDING.md` §4). Once he's done, ping him for these values and put them in `frontend/.env.local`:

```env
NEXT_PUBLIC_SENTRY_DSN=                       # frontend project DSN (NOT backend's)
SENTRY_AUTH_TOKEN=                            # for source-map upload during build
SENTRY_ORG=panama-car-republic
SENTRY_PROJECT=pcr-frontend

NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED=true

NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_ENV=development
```

> **Save these in your password manager too** under "PCR — staging — frontend." Uriel will mirror them as GitHub Actions secrets in the pairing session described in Kumar's onboarding §5 — you don't need to do that part.

### 4.2 Install the Figma MCP server in Claude Code

The Figma MCP lets Claude Code read your Figma file directly — pull frames, components, tokens, exported assets. This is your primary code-generation lever.

1. **Get a Figma personal access token:**
   - Figma → top-right avatar → Settings → Account → Personal access tokens → "Generate new token"
   - Name: `pcr-claude-code`
   - Scopes: `File content` (read), `Library content` (read), `Variables` (read)
   - **Copy the token now** — Figma won't show it again. Save in password manager under "PCR — Figma MCP token."

2. **Install the MCP server.** In Claude Code (project root):
   - Run `/mcp` and pick "Add new MCP server", or edit `.claude.json` directly.
   - Use a Figma MCP server (the ECC marketplace and the broader MCP ecosystem both list options — pick one that supports `files`, `variables`, and `images` endpoints).
   - Configure it with your access token as an environment variable, **not** as a literal in the config file.

3. **Confirm it works.** In a Claude Code session in `frontend/`, ask: *"Using the Figma MCP, list the top-level frames in file `<your-figma-file-key>`."* You should get a list back. If you don't, the token scope is wrong or the server isn't connected.

> **Get the Figma file key from Edwin** — it's in the URL: `https://www.figma.com/design/<FILE-KEY>/...`.

### 4.3 Walk the Figma file with Edwin (30 min)

Before you write code, sit with Edwin and walk through the design. Ask:
- Which frames are MVP (Sprint 1) vs. later sprints?
- What's the responsive strategy for each page (where do mobile/desktop frames diverge)?
- Are design tokens defined as Figma Variables (preferred) or hard-coded styles? If hard-coded, plan to extract them in §5.1.
- What components are reusable vs. one-off? You'll build the reusable ones first.
- Any motion/animation specs? Document them — most teams forget animation until it's painful to retrofit.

✅ **Acceptance for Day 2:** Sentry shows your first manual error event from a `npm run dev` test throw, PostHog shows a `page_viewed` event from your local browser, the Figma MCP returns frame data on demand, and you've walked the file with Edwin and have a written list of "MVP frames" pinned somewhere shared.

---

## §5. Day 3+ — Sprint 1 work queue (v0.2.0-beta — month 1)

Open one PR per chunk. Branch naming: `feature/fe-<scope>` per CONTRIBUTING §Parallel-Team Workflow.

### 5.1 Design tokens from Figma → code — `feature/fe-design-tokens`

The foundation. Everything else depends on this.

**What to extract from Figma:**
- Colors: surface, text, accent, semantic (success/warning/danger/info), with light/dark variants if applicable.
- Typography: font families, scale (display, h1–h6, body, small, caption), line-heights, letter-spacing.
- Spacing scale: probably a 4px or 8px base.
- Radii, shadows, elevations.
- Motion: standard durations and easings.
- Breakpoints (320, 375, 768, 1024, 1440, 1920 — confirm with Edwin).

**Where to put it:**
- CSS custom properties in `frontend/src/styles/tokens.css` (single source). Use `oklch()` for colors so theme math is sane.
- `frontend/tailwind.config.ts` references the CSS variables — never duplicate values.
- Typography tokens applied as Tailwind utility classes via `@layer base` and a small helper plugin if needed.

**Anti-patterns to avoid (per `~/.claude/rules/web/design-quality.md`):**
- Don't ship default Tailwind/shadcn-looking UI. Make it specific to PCR's brand.
- No template card grids with uniform spacing and zero hierarchy.
- Hover/focus/active states must be designed, not afterthoughts.

**Acceptance:** all subsequent components reference tokens, never raw hex/px values. ESLint rule `no-restricted-syntax` against literal hex codes is something Uriel can add later if drift becomes a problem.

### 5.2 Layout shell — `feature/fe-layout-shell`

Header (logo, nav, auth state CTA), footer, mobile nav drawer. Uses tokens from §5.1.

- Use semantic HTML: `<header>`, `<nav aria-label="Main">`, `<main>`, `<footer>`. No generic `<div>` stacks where a semantic element exists.
- Mobile-first. Test at 320, 375, 768, 1024, 1440 widths.
- Wire `<Analytics />` from `@vercel/analytics` and PostHog provider in `frontend/src/app/providers.tsx`.

**Acceptance:** Lighthouse CI passes the existing budget in `lighthouserc.js`. Keyboard navigation works (Tab through every interactive element with visible focus).

### 5.3 Foundational components — `feature/fe-component-library`

Build only what Sprint 1 pages need:
- `<Button>` — variants: primary, secondary, ghost, destructive. Sizes: sm, md, lg. Loading state. Disabled state.
- `<Input>` / `<Textarea>` / `<Select>` — with label, helper text, error state.
- `<Card>` / `<Surface>` — for listing tiles and content blocks.
- `<Badge>` — for category/status pills.
- `<Avatar>` — fallback to initials.
- `<Spinner>` / `<Skeleton>` — for loading states.

Each component:
- TypeScript strict, props typed via interface.
- Forward refs where it makes sense (inputs, buttons).
- Composed from primitives, not monolithic.
- Storybook is **optional** and **not in MVP scope**. Document props with TSDoc comments instead.
- ≤ 200 lines per component file (CONTRIBUTING §Code Style).

**Acceptance:** all pages built in §5.4–§5.6 reuse these components; no one-off styled buttons.

### 5.4 Auth pages — `feature/fe-auth-pages`

Three routes under App Router:
- `/auth/signup` — email + password + role selector (private seller / dealer). Calls `supabase.auth.signUp()`. On success, fire PostHog `user_registered`. Redirect to email-verification-pending screen.
- `/auth/signin` — email + password. Calls `supabase.auth.signInWithPassword()`. Stores session via Supabase JS client. Redirect to listings index.
- `/auth/callback` — handles the email-verification redirect from Supabase. Fires PostHog `email_verified` with `seconds_since_register` property (compute from `user.created_at`).

**Acceptance:** can sign up + verify + sign in end-to-end against staging Supabase. PostHog shows both events.

### 5.5 Public listings index — `feature/fe-listings-index`

`/listings` (public, no auth required).

- Server Component (RSC) by default. Fetch from `${NEXT_PUBLIC_API_URL}/api/v1/listings` with filters from URL search params (per `~/.claude/rules/web/patterns.md` §URL As State — filters live in the URL).
- Filter UI (client component): make, model, year range, price max, category. Updates URL search params on change.
- Sort: newest, price ascending/descending.
- Pagination: cursor-based per Kumar's API choice (sync with him).
- Listing tile uses `<Card>` from §5.3.
- Empty state, loading skeleton, error state.

**Acceptance:** page loads under 2.5s LCP on a 4G simulation, filter changes don't trigger a full reload (use `router.replace` with `scroll: false`).

### 5.6 Listing detail page — `feature/fe-listing-detail`

`/listings/[id]`.

- RSC fetches listing from `${NEXT_PUBLIC_API_URL}/api/v1/listings/{id}`.
- Image gallery (lazy load, AVIF/WebP per `~/.claude/rules/web/performance.md`).
- WhatsApp click button (PRD §5.5) — pre-fills message: `Hola, me interesa tu publicación: <listing.title> — <full-URL>`. Opens `https://wa.me/<seller-phone>?text=<encoded>` in new tab.
- On click, fire PostHog `whatsapp_contact_clicked` with `{ listing_id, seller_role }`.
- 404 if listing is not `published` and viewer isn't the owner.

**Acceptance:** WhatsApp link opens correctly on iOS Safari and Android Chrome. Event fires in PostHog.

### 5.7 Cookie consent banner — `feature/fe-cookie-banner` (assigned to you per ADR 004)

Non-blocking banner (does not gate page content) for first-time visitors. Persists choice in `localStorage`. **Spanish copy** — coordinate with Edwin.

**Acceptance:** banner appears once, "Aceptar" persists; PostHog only fires events after consent.

### Deferred (Sprint 2 / v0.3.0-beta)
- Image upload UI for listings.
- Subscription checkout flow (Pagalo Facil redirect).
- Admin moderation queue.

---

## §6. Definition of Done (your version)

Per `CONTRIBUTING.md` §Definition of Done, plus these frontend specifics:

- [ ] `npm run lint` — clean.
- [ ] `npx tsc --noEmit` — clean.
- [ ] `npm run build` — succeeds locally.
- [ ] Unit tests for utilities, hooks, data transforms (≥ 70% coverage on touched files).
- [ ] **Visual regression** screenshots taken at 320, 768, 1024, 1440 for any UI-heavy PR (per `~/.claude/rules/web/testing.md`).
- [ ] **Accessibility** — keyboard navigation, focus rings, color contrast, `prefers-reduced-motion` respected.
- [ ] Design tokens used (no literal hex/px in component code).
- [ ] PostHog events fire when the PR adds a step on the canonical funnel (per ADR 004).
- [ ] If consuming a new endpoint: `packages/types/` already has the type (Kumar's PR was first or co-merging).
- [ ] No real secrets in code or commits — `.env.local` only.
- [ ] CHANGELOG `## [Unreleased]` updated for user-visible changes.

---

## §7. LLM agent setup (Claude Code)

When you open `frontend/` in Claude Code, the agent auto-loads `frontend/CLAUDE.md`. That file lists which ECC skills and MCP servers to install:

- **Skills:** `frontend-patterns`, `frontend-design`, `e2e-testing`, `nextjs-turbopack`, `accessibility`.
- **MCP servers:** `context7` (Next.js / TanStack Query / React docs), `playwright` (E2E generation), `github`, **and the Figma MCP from §4.2**.

The Figma MCP is your superpower — instead of pixel-pushing manually, ask the agent to read a frame and scaffold the React + Tailwind component, then refine. **Always verify the output against the actual Figma render** — LLMs can hallucinate spacing or colors when frames are dense. Use the visual regression screenshot tooling to catch drift.

For commits, follow `CONTRIBUTING.md` §Commit Convention exactly. Bad messages will block merge once Uriel wires commit-lint into CI.

---

## §8. Communication protocol

- **Daily 15-min sync** with Uriel + Kumar before opening new branches.
- **Weekly sync with Edwin** — design review of what shipped, what's next.
- **Block on Kumar** for: API contract changes (you both touch `packages/types/`), pagination strategy, error-response shape.
- **Block on Uriel** for: Vercel project setup, env-var routing, branch protection issues, security review of auth flows.
- **Block on Edwin** for: missing Figma frames, copy in Spanish, accessibility-affecting design choices.
- **Async questions** → team channel. Tag the owner; don't `@here`.
- **Stuck > 2 hours on the same problem?** Escalate. Don't burn a day in silence.

---

## §9. Glossary cheats

- **App Router / RSC:** routes live in `frontend/src/app/`. Server Components by default. Mark `"use client"` only when you need state, effects, or browser APIs.
- **Server state:** TanStack Query v5 — never duplicate into a client store.
- **Client state:** local component state for ephemeral UI; URL search params for shareable filters; tiny zustand slice only if absolutely necessary.
- **Auth:** Supabase JS client manages the session in browser. JWT auto-attached to API calls via a custom fetch wrapper in `frontend/src/lib/api.ts` (build this in §5.4 if it doesn't exist).
- **Forms:** React Hook Form + Zod schema validation. Schemas can be shared with backend if Kumar exposes them via `packages/types/`.
- **Error boundary:** wrap the app shell in a Sentry-aware error boundary. Sentry captures errors automatically; surface a user-friendly fallback.
- **Telemetry without PII:** never put email/phone/name in PostHog properties (per ADR 004 §Privacy). Only `user_id` (Supabase UUID).

---

## §10. When you finish §3–§5

Tell Uriel "Frontend onboarded, design system live." He'll archive this doc to `infra/docs/handoffs/2026-05-jorge-onboarding.md` and you switch to steady state — `frontend/CLAUDE.md` is your daily reference from then on.

Your superpower from day 2 onward is the Figma MCP. Use it ruthlessly. Welcome aboard. 🇵🇦
