# Reading Tracker

## Overview

A full-stack reading habit tracker for college students. Users log reading sessions with a date and duration, then see weekly summaries, session history, and insights (streaks, averages, weekly bar charts). Designed with a warm, low-pressure aesthetic (Option C from the prototype doc).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/reading-tracker) — served at `/`
- **API framework**: Express 5 (artifacts/api-server) — served at `/api`
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- **Build**: esbuild (CJS bundle)
- **Charts**: Recharts (weekly history bar chart)
- **Routing**: Wouter (frontend)
- **Forms**: react-hook-form + zod

## Pages

| Route | Description |
|---|---|
| `/` | Home landing page (public) |
| `/login` | Login screen — saves username to localStorage |
| `/dashboard` | Weekly summary: sessions, minutes, days read |
| `/add-session` | Form to log a new reading session |
| `/history` | Full list of past sessions with inline edit/delete |
| `/insights` | Avg duration, streak, weekly bar chart |
| `/profile` | Shows username, logout button |

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Database Schema

- `sessions` table: `id`, `date` (YYYY-MM-DD text), `duration_minutes`, `notes` (nullable), `created_at`, `updated_at`

## Auth

Client-side prototype auth: username stored in `localStorage` under key `rt_user`. Protected routes redirect to `/login` if no username found.

## Azure Portability

- No Replit-specific dependencies in application code
- Uses standard PostgreSQL (Azure Database for PostgreSQL compatible)
- `DATABASE_URL` environment variable drives the DB connection
- Frontend builds to static files (Azure Static Web Apps compatible)
- Backend is a standard Node.js/Express app (Azure App Service compatible)

## Notes

- After any OpenAPI spec change, run codegen before using the updated types
- `lib/api-zod/src/index.ts` must only re-export from `./generated/api` (not `./generated/types`) to avoid Orval duplicate-export conflicts
