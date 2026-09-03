**Bizna Ops** — a Next.js + TypeScript dashboard app for managing users,
products, and orders, with a revenue overview, using Prisma over
PostgreSQL.

## Features

- **Dashboard** — at-a-glance stats (users, products, orders, revenue) and
  a recent-orders table.
- **Users / Products / Orders** — full CRUD for each, with order creation
  automatically reserving product stock (and releasing it again if an
  order is cancelled or refunded).
- **Revenue** — totals, average order value, and a breakdown by product,
  computed from completed orders.
- Shared navigation across all pages, and a light/dark theme toggle.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Prisma](https://www.prisma.io) over PostgreSQL
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Vercel](https://vercel.com) for hosting, [Neon](https://neon.tech) for
  managed Postgres in production

## Getting started

Local development uses PostgreSQL via Docker Compose, not the production
database.

```bash
cp .env.example .env      # defaults already match docker-compose.yml
docker compose up -d      # start local Postgres
npm install                # also runs `prisma generate`
npm run db:migrate:dev    # apply migrations locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Available scripts

| Command                    | Description                              |
| --------------------------- | ----------------------------------------- |
| `npm run dev`               | Start the local dev server               |
| `npm run build`              | Run pending migrations and build for production |
| `npm run start`              | Start the production server              |
| `npm run lint`               | Lint the codebase                        |
| `npm run db:migrate:dev`     | Create/apply a migration locally         |
| `npm run db:migrate:deploy`  | Apply pending migrations (used in CI/production) |
| `npm run db:studio`          | Open Prisma Studio                       |
