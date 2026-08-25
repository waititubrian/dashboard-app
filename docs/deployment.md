# Deployment Guide

## Architecture

- **App:** Next.js 16 (App Router, TypeScript), deployed on **Vercel**. Vercel is a
  verified Next.js deployment adapter, so no custom build/adapter config is
  required — Vercel detects the framework and runs `npm install` then
  `npm run build` automatically.
- **Database:** managed PostgreSQL on **Neon** in production. Neon was chosen
  over self-managing RDS/a VM because:
  - it speaks plain Postgres wire protocol, so the existing `pg` +
    `@prisma/adapter-pg` setup needs zero code changes;
  - it gives a **pooled** connection string (for many concurrent short-lived
    serverless function connections) and a separate **direct** connection
    string (best for running schema migrations) — see [Environment
    variables](#environment-variables) below;
  - it has a first-party Vercel integration that can auto-populate env vars;
  - free tier and scale-to-zero are a good fit for a personal dashboard app.
  Supabase is a reasonable alternative if you later want auth/storage/realtime
  from the same provider — the app itself doesn't care which one you pick, as
  long as it's Postgres.
- **Local development:** unchanged — PostgreSQL runs via `docker-compose.yml`.
  Production never talks to this database.
- **Prisma:** schema/migrations live in `prisma/`. The generated client is
  committed to `src/generated/prisma` (this project's chosen Prisma 7
  workflow — see `prisma/schema.prisma`'s `generator` block). `npm run build`
  now runs `prisma migrate deploy` before `next build`, so every deployment
  (Preview or Production) applies any pending migrations to whichever
  database its `DATABASE_URL`/`DIRECT_URL` point at.

## Local development setup

1. `cp .env.example .env` and leave the default `DATABASE_URL` as-is (it
   matches `docker-compose.yml`).
2. `docker compose up -d` — starts local Postgres on `localhost:5432`.
3. `npm install` — also runs `prisma generate` via `postinstall`.
4. `npm run db:migrate:dev` — applies migrations to your local database
   (use this instead of `db:migrate:deploy` locally; it can create new
   migrations interactively).
5. `npm run dev` — starts the app at http://localhost:3000.

## Git branch workflow

- `feature/*` — day-to-day development. Branch off `main`, open a PR back
  into `main` when ready. Every push gets its own Vercel **Preview**
  deployment URL automatically.
- `main` — integration/testing. Merged feature branches land here first.
  Also deploys as a Vercel Preview (not Production).
- `prod` — production. Configured as the Vercel **Production Branch**
  (see below). Merge `main` into `prod` (or fast-forward it) when you want
  to ship what's currently on `main`.

None of this required deleting or rewriting `main` — `prod` and the initial
`feature/*` branch were created from the current tip of `main`.

## Production deployment process

One-time setup (manual, see [What you need to do manually](#what-you-need-to-do-manually)):

1. Create a Vercel project from the `waititubrian/dashboard-app` GitHub repo.
2. In **Project Settings → Git**, set **Production Branch** to `prod`
   (instead of the GitHub default branch, `main`). This is what makes `prod`
   represent the production version of the app, per the requested workflow.
3. In **Project Settings → Environment Variables**, add `DATABASE_URL` (and
   `DIRECT_URL` if your provider gives you a separate one) scoped to the
   **Production** environment, pointing at your production Neon database.
   Add a second set scoped to **Preview** (and optionally **Development**)
   pointing at a separate non-production database — e.g. a Neon branch — so
   that `prisma migrate deploy` running on `main`/`feature/*` previews never
   touches production data.
4. Push `prod` to GitHub. Vercel builds and deploys it to the Production
   URL (`<project>.vercel.app` until a custom domain is attached).

Ongoing deploys: merge into `prod` and push. Vercel builds automatically —
`prisma migrate deploy` runs first, then `next build`.

## Environment variables

See `.env.example` for the authoritative template.

| Variable       | Required | Used by                              | Notes                                                                |
| -------------- | -------- | ------------------------------------- | --------------------------------------------------------------------- |
| `DATABASE_URL` | Yes      | App runtime (`src/lib/prisma.ts`) and Prisma CLI fallback | Use the **pooled** connection string in production. |
| `DIRECT_URL`   | No       | Prisma CLI only (`prisma.config.ts`), used for `migrate deploy`/`migrate dev` | Use the **unpooled/direct** connection string if your provider offers one. Falls back to `DATABASE_URL` if unset. |

Never commit `.env` or any `.env.local`/`.env.production` file — only
`.env.example` is tracked (see `.gitignore`).

## Prisma / database migrations

- Schema changes: edit `prisma/schema.prisma`, then run
  `npm run db:migrate:dev` locally to create and apply a new migration file
  under `prisma/migrations/`. Commit the generated migration folder.
- Production migrations are **not** run manually — `npm run build` (which
  Vercel runs) executes `prisma migrate deploy` first, applying any new
  migrations before the app builds. `migrate deploy` only applies pending
  migrations; it never generates or prompts, so it's safe in CI.
- `npm run db:studio` opens Prisma Studio against whatever `DATABASE_URL`
  is currently set in your shell/`.env`.

## Custom domain

1. Vercel dashboard → your project → **Settings → Domains** → add your
   domain.
2. Vercel shows the exact DNS record(s) to add (typically an `A`/`ALIAS`
   record for an apex domain, or a `CNAME` for a subdomain like
   `app.example.com`) — add them at your domain registrar/DNS provider.
3. Once DNS propagates, Vercel issues a certificate automatically and the
   domain serves whatever is deployed on the **Production Branch** (`prod`).

## Rolling back a deployment

- **Fastest:** Vercel dashboard → project → **Deployments** → find the last
  good deployment → **⋯ → Instant Rollback**. This re-points the Production
  alias at a previous build with no rebuild needed.
- **Via git:** `git revert` the offending commit(s) on `prod` and push — this
  triggers a normal new deployment with the reverted code.
- **Database:** rolling back app code does **not** roll back schema
  migrations that already ran. Keep migrations backward-compatible
  (additive) so an old build can still run against a newer schema. If a
  migration truly needs undoing, write and apply a new forward migration
  that reverses it — Prisma does not generate down-migrations automatically.

## What you need to do manually

These require access this assistant doesn't have:

- Create the Neon (or other) Postgres project/database and get its
  connection string(s).
- Create the Vercel account/project and connect the GitHub repo.
- Set the Vercel **Production Branch** to `prod`.
- Add the environment variables in Vercel (scoped per environment).
- Push the `prod` and `feature/*` branches to GitHub (this session created
  them locally; confirm before pushing if that wasn't already done).
- Add and verify a custom domain's DNS records.
- Review `src/app/api/test-db/route.ts` — it returns every user row with no
  auth check. It was left in place (removing working functionality wasn't
  part of this change), but it should not ship reachable in production
  as-is: add auth, gate it behind an env check, or delete it.
- Optionally upgrade `next` off the pinned `16.2.12` to pick up the
  `postcss`/`sharp` security fixes flagged by `npm audit` — deferred here
  since it's a version bump outside this task's scope.
