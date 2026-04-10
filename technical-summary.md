# Technical Summary

## Overview

GLD Issues is a Next.js 16 (App Router) application that provides a custom task-management UI backed by GitHub Issues. The app reads issues/labels from a configured repository and allows issue mutations (create/update/close) through internal API routes that call GitHub via Octokit.

## Tech Stack

- Runtime/framework: Next.js 16, React 19, TypeScript 5
- Authentication: NextAuth (Google provider)
- GitHub integration: Octokit REST API
- State management: Zustand (client access-level state)
- Styling: Tailwind CSS 4
- Tooling: ESLint 9, Prettier

## High-Level Architecture

- Server-rendered entrypoint in `src/app/page.tsx` determines whether to render login or the task UI.
- `src/auth/auth.ts` centralizes auth/session helpers and access-level resolution.
- `src/components/github/useIssues/useIssues.tsx` manages client data lifecycle:
  - Fetches issues and labels from internal API routes.
  - Normalizes issue payloads.
  - Caches issue state in `sessionStorage` (`gitHubIssues`) with metadata.
  - Exposes refresh/mutation operations to UI components.
- API routes in `src/app/api/**` act as a server-side integration layer for GitHub.

## Authentication And Authorization

### Authentication

- NextAuth is configured with Google OAuth in `src/auth/auth.ts` and exposed at `src/app/api/auth/[...nextauth]/route.ts`.
- Session retrieval is performed with `getServerSession` wrappers.

### Access levels

`showLoginPage()` computes:

- `dev`: email matches `DEV_EMAIL_A` or `DEV_EMAIL_B`
- `auth`: email domain/user is allowlisted via auth env vars
- `public`: fallback

Behavior:

- Non-production bypasses login page.
- Production enforces allowlist-based access for UI visibility.

### Mutation guard

`src/middleware.ts` protects issue mutation endpoints:

- Scope: `POST`/`PATCH` under `/api/makeGithubIssues/*`
- Uses JWT token from NextAuth.
- Only `dev` emails are allowed to mutate issues.
- Returns `401` for unauthenticated and `403` for authenticated-but-forbidden users.

## API Surface

### `GET /api/getGithubIssues/[slug]`

- `slug = tasks` (or missing): returns combined open + closed issue list.
- `slug = <issue_number>`: returns a single issue.
- Uses Octokit pagination for list retrieval.

### `GET /api/getGithubLabels`

- Returns repository labels.

### `POST /api/makeGithubIssues/[slug]`

- Creates a GitHub issue from request payload.
- Labels are split from comma-separated strings.

### `PATCH /api/makeGithubIssues/[slug]`

- `slug = close`: toggles issue state open/closed.
- `slug = patchTodo`: applies generic issue updates.

Error handling includes translated responses for common GitHub failures (credentials/repo not found), with fallback `500`.

## Data Model Notes

- GitHub issues are the source of truth.
- Labels are used for category/grouping behavior in UI.
- `gitIssues.config.ts` excludes selected labels from category/filter generation (currently `awaiting`, `priority`).
- Client cache object shape includes:
  - `issues`
  - `labels`
  - `metadata.lastUpdated`

## Environment Variables

Required values inferred from code:

- GitHub:
  - `GH_PAT`
  - `GH_USER`
  - `GH_REPO`
- NextAuth/Google:
  - `NEXTAUTH_SECRET`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
- Access control:
  - `DEV_EMAIL_A`
  - `DEV_EMAIL_B`
  - `AUTH_EMAIL_DOMAIN`
  - `AUTH_EMAIL_A`
  - `AUTH_EMAIL_B`

## Local Development

- `npm run dev`: start local development server
- `npm run build`: production build
- `npm run start`: run production server
- `npm run lint`: lint code

## Current Design Tradeoffs

- App-level authorization logic exists both in server-rendered page gating and API middleware; this is deliberate defense-in-depth for mutations.
- Issue cache is session-scoped (`sessionStorage`), reducing GitHub calls during a browser session while avoiding stale persistent local storage.
- GitHub issue title/label conventions power task semantics, keeping backend simple at the cost of convention coupling.
