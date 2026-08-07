# CLAUDE.md - Frontend (Jorge)

> Auto-loaded by Claude Code and other LLM IDE tools when working in `frontend/`. Defines conventions, recommended skills, and recommended MCP servers for the Frontend Lead role.

## Role context

You are pair-programming with **Jorge**, the Frontend Lead. Jorge owns:

- All code under `frontend/` (Next.js 14 App Router, components, hooks).
- TanStack Query data fetching layer.
- Supabase Auth integration on the client.
- Consuming shared TS types from `packages/types/`.
- Translating Edwin's Figma designs into production UI.

## Architecture

| Concern              | Where                                           |
| -------------------- | ----------------------------------------------- |
| Routes               | `src/app/(public|dashboard)/.../page.tsx`       |
| Design tokens + theme| `src/theme/tokens.ts`, `src/theme/theme.ts`, `src/theme/ThemeRegistry.tsx` |
| UI primitives (MUI)  | `src/components/ui/` (wrappers over `@mui/material`) |
| Feature modules      | `src/modules/<feature>/`                        |
| Feature components   | `src/components/<feature>/`                     |
| Layout shells        | `src/components/layout/` (Header, Footer)       |
| Data fetching hooks  | `src/hooks/use*.ts` (TanStack Query)            |
| HTTP client          | `src/lib/api-client.ts` (axios + Supabase JWT)  |
| Supabase client      | `src/lib/supabase-client.ts`                    |
| Query client config  | `src/lib/query-client.ts`                       |
| Shared TS types      | `@pcr/types` -> `../packages/types/`            |

## Auth flow (Supabase)

1. User submits sign-up / login via the Supabase JS client (`supabase.auth.signUp`, `supabase.auth.signInWithPassword`).
2. Supabase returns a session with `access_token` (JWT). The client persists it in `localStorage`.
3. `api-client.ts` reads `supabase.auth.getSession()` on every request and attaches `Authorization: Bearer <token>`.
4. Middleware in `src/middleware.ts` (when added) checks the session and redirects unauthenticated users away from `/dashboard/*`.

> Never call the FastAPI auth endpoints to sign in. Sign-in is direct frontend-to-Supabase.

## Conventions

- **Components:** PascalCase, one per file. Server Components by default; add `"use client"` only when you need state, effects, or browser APIs.
- **Hooks:** `use<Feature>` in `src/hooks/`. Each hook returns the TanStack Query result.
- **Imports:** absolute via `@/...` and `@pcr/types`. No deep relative `../../..` paths.
- **Styling (MUI only):** no Tailwind/CSS modules/styled-components. All design values live in `src/theme/tokens.ts` and flow through the MUI theme (`src/theme/theme.ts`). Reference the theme in `sx` (`color: 'primary.main'`, `borderRadius: 2`, `p: 3`) — never hardcode a hex, px, or font name. Global button/input/card styling belongs in theme `components` overrides, not repeated `sx`.
- **Lint/format:** Prettier runs automatically via lint-staged. ESLint via `next lint` must pass in CI.
- **Type safety:** `tsc --noEmit` must pass. Don't use `any`. Use `@pcr/types` for the API contract.

## Recommended ECC skills

Invoke via `/skill-name`:

- **`frontend-patterns`** - composition, render props, container/presentational, state management.
- **`frontend-design`** - building distinctive, production-grade UI (avoid template look).
- **`accessibility`** - WCAG 2.2 compliance, keyboard nav, screen reader semantics.
- **`nextjs-turbopack`** - Next.js 14+ patterns, App Router, RSC vs Client.
- **`e2e-testing`** - Playwright Page Object Model patterns.
- **`design-system`** - generate or audit design tokens, theming.
- **`ai-regression-testing`** - regression for AI-generated UI changes.

## Recommended MCP servers

| MCP server         | Why                                                                 |
| ------------------ | ------------------------------------------------------------------- |
| **`context7`**     | Pull up-to-date Next.js / TanStack Query / MUI + Emotion / Supabase JS docs. |
| **`playwright`**   | Drive a real browser to verify pages and screenshot for review.     |
| **`github`**       | Open PRs, link to ClickUp tickets, comment on review threads.       |
| **`figma`**        | (If installed) read Figma designs from the same session.            |

## Cheat sheet (Jorge)

```bash
# Dev server (without docker)
cd frontend
npm install
npm run dev

# Lint, type-check, test
npm run lint
npm run type-check
npm test

# Build
npm run build

# Open API docs (when backend is up)
open http://localhost:8000/docs

# Generate Supabase TS types from your dev project (manual)
npx supabase gen types typescript \
  --project-id YOUR-PROJECT-REF \
  --schema public > src/lib/supabase-types.ts
```

## Common LLM prompts to use here

- "Create a `useListings` TanStack Query hook that calls `GET /api/v1/listings` with the filter type from `@pcr/types/listing`."
- "Build a `<ListingCard>` component using the `Listing` type from `@pcr/types`. Style with MUI + the theme, no template look."
- "Add a Next.js middleware that redirects unauthenticated users from `/dashboard/*` to `/login` using Supabase session."
- "Generate a Playwright test for the login flow using `supabase.auth.signInWithPassword`."
- "Refactor `<ListingForm>` to use `react-hook-form` + zod schema derived from `@pcr/types/listing`."

## State management policy

PRD v1.1 §7 + ADR (evaluation §1 row 6) pin the FE state strategy:

- **Server state:** TanStack Query v5 (`@tanstack/react-query`). All API data lives here.
- **Component state:** React `useState` / `useReducer`.
- **Shareable state (filters, sort, pagination, active tab, search):** URL search params via `useSearchParams` / `usePathname`.
- **Form state:** `react-hook-form` + zod schemas derived from `@pcr/types`.
- **No global client-state store.** Zustand, Redux, Jotai, etc. are explicitly OUT until a concrete need surfaces (cross-route shared mutable UI state that doesn't fit URL or React Query). New stores require a PR + Tech Lead approval.

## Don'ts

- Don't roll your own JWT handling. Use `supabase-client.ts` and let `api-client.ts` attach the token.
- Don't import a backend type from `@/...` - cross-package types live in `@pcr/types`.
- Don't use `any` to silence TS errors. Type it properly or generate the type from Supabase if needed.
- Don't store tokens in `sessionStorage` manually - Supabase handles persistence.
- Don't mix client and server logic in the same file. RSC defaults; opt into client with `"use client"`.
- **Don't add Zustand / Redux / Jotai / any global client store** without a PR justifying it (see "State management policy" above).
