# CRUD + Dashboard SaaS Monorepo

This repository is a pnpm + Turborepo workspace for a specs-first SaaS stack:

- `apps/web`: Next.js App Router frontend with auth scaffolding and protected dashboard
- `apps/api`: NestJS backend with Projects CRUD, health check, and Stripe webhook stub
- `packages/db`: Prisma schema, migrations, seed scripts, and generated Prisma client
- `packages/validation`: Shared Zod schemas used by web and api
- `packages/shared`: Shared TypeScript types/utilities
- `packages/ui`: Shared shadcn/Radix-based design system for web pages
- `packages/specs`: Product and API specs (Markdown + OpenAPI)

## Default architectural choices

- Backend framework: NestJS (modular controllers/services)
- ORM: Prisma + PostgreSQL
- Auth scaffolding: Auth.js (NextAuth) in web app (credentials placeholder)
- Multi-tenancy: Organization + Membership model
- Validation: Zod schemas in a shared package, reused by API request handling

## Run

1. `pnpm install`
2. `docker compose up -d`
3. `cp apps/web/.env.example apps/web/.env.local`
4. `cp apps/api/.env.example apps/api/.env`
5. `cp packages/db/.env.example packages/db/.env`
6. `pnpm db:migrate`
7. `pnpm db:seed`
8. `pnpm dev`

## Quality gates

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

Keep `packages/specs/openapi.yaml` in sync with API controllers/routes.
