# Reading Tracker

## Overview

A full-stack reading habit tracker for college students. Users log reading sessions with a date and duration, then see weekly summaries, session history, and insights (streaks, averages, weekly bar charts). Designed with a warm, low-pressure aesthetic (Option C: cream background, sage green, lavender accents).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/reading-tracker) — served at `/`
- **API framework**: Express 5 (artifacts/api-server) — served at `/api`
- **Database**: Supabase PostgreSQL via `@supabase/supabase-js` (replaces Drizzle)
- **State/Data fetching**: `@tanstack/react-query` with `QueryClientProvider` in `main.tsx`
- **Validation**: Zod
- **API codegen**: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- **Build**: esbuild (CJS bundle)
- **Charts**: Recharts (weekly history bar chart)
- **Routing**: Wouter (frontend)
- **Forms**: react-hook-form + zod
- **Animations**: framer-motion (landing page entrance animations)

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, how it works, philosophy, features, bottom CTA |
| `/login` | Login — enter name to open journal (localStorage-based) |
| `/dashboard` | Weekly summary: sessions, minutes, days read + motivational message |
| `/add-session` | Form to log a new reading session |
| `/history` | Full list of past sessions with inline edit/delete (always-visible buttons) |
| `/insights` | Current streak, longest streak, avg session, all-time stats, weekly bar chart |
| `/profile` | Shows username, logout button |

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec

## Database (Supabase)

- Environment secrets: `SUPABASE_URL` (project ref only, e.g. `qzhcoszuytybegmrlcxo`), `SUPABASE_ANON_KEY`
- `lib/supabase.ts` auto-constructs the full URL: `https://{ref}.supabase.co`
- `sessions` table: `id` (BIGINT IDENTITY PK), `date` (TEXT, YYYY-MM-DD), `duration_minutes` (INTEGER), `notes` (TEXT nullable), `created_at`, `updated_at` — RLS disabled
- API routes: `GET/POST /api/sessions`, `PATCH /api/sessions/:id`, `DELETE /api/sessions/:id`, `GET /api/stats/weekly-summary`, `GET /api/stats/weekly-history`, `GET /api/stats/insights`

## Auth

Client-side prototype auth: username stored in `localStorage` under key `rt_user`.
- `useAuth` hook exposes `login`, `logout`, `username`, `isAuthenticated`, `ready`
- `ready` flag prevents redirect race conditions (waits for localStorage to be read in `useEffect`)
- `LoginRoute` redirects to `/dashboard` when `isAuthenticated` is true
- `ProtectedRoute` redirects to `/login` when `isAuthenticated` is false
- Both wait for `ready` before redirecting
- `login()` sets localStorage and username state; navigation handled by `LoginRoute`
- `logout()` clears localStorage + username and does `window.location.href = "/"` (hard nav)

## Accessibility (WCAG 2.1 AA)

- `lang="en"` on `<html>`
- Skip navigation link ("Skip to main content") in layout
- All icon-only interactive elements have `aria-label`
- `aria-current="page"` on active nav items
- `<nav>` elements have `aria-label` attributes
- Color contrast: primary (150 28% 38%) gives ~4.8:1 with white text; muted-foreground (120 10% 38%) gives ~5.5:1 on cream background
- Chart has `role="img"` and descriptive `aria-label`
- Dynamic page `<title>` updates on route change via `useEffect` in Layout

## Azure Portability

- No Replit-specific dependencies in application code
- Uses standard PostgreSQL (Supabase, Azure Database for PostgreSQL compatible)
- Frontend builds to static files (Azure Static Web Apps compatible)
- Backend is a standard Node.js/Express app (Azure App Service compatible)

## Notes

- After any OpenAPI spec change, run codegen before using the updated types
- The `lib/api-zod/src/index.ts` must only export from `./generated/api` (not `./generated/types`) — orval generates both and re-exporting both causes duplicate export errors
- `QueryClientProvider` is set up in `artifacts/reading-tracker/src/main.tsx` — do not remove it
