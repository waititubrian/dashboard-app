A Next.js + TypeScript dashboard app, using Prisma over PostgreSQL.

## Getting started (local development)

Local development uses PostgreSQL via Docker Compose, not the production
database.

```bash
cp .env.example .env      # defaults already match docker-compose.yml
docker compose up -d      # start local Postgres
npm install                # also runs `prisma generate`
npm run db:migrate:dev    # apply migrations locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The app deploys to Vercel with a managed Postgres database (Neon) in
production. See [docs/deployment.md](./docs/deployment.md) for the full
architecture, the `feature/*` → `main` → `prod` git workflow, environment
variables, migrations, custom domains, and rollback steps.

## UI and functional improvements

The UI is built on [shadcn/ui](https://ui.shadcn.com). See
[docs/ui-and-functional-improvements.md](./docs/ui-and-functional-improvements.md)
for what was migrated and why, plus a set of functional bug fixes (order
stock accounting, user API error handling) made in the same pass.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
