# AGENTS

## Stack summary

- Monorepo tooling: pnpm workspaces + Turborepo
- Frontend: Next.js App Router, TypeScript, Tailwind, Auth.js scaffolding
- Backend: NestJS, Prisma, PostgreSQL
- Design system: shared UI package at `packages/ui` (shadcn-style Radix components)
- Shared contracts: Zod schemas in `packages/validation`, OpenAPI in `packages/specs/openapi.yaml`

## Commands

- Install: `pnpm install`
- Start infra: `docker compose up -d`
- Dev: `pnpm dev`
- Build: `pnpm build`
- Test: `pnpm test`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- DB migrate: `pnpm db:migrate`
- DB seed: `pnpm db:seed`
- DB studio: `pnpm db:studio`

## Coding conventions

- TypeScript everywhere
- Prefer Zod schemas from `packages/validation` for request/response validation
- Keep domain logic in API services (controllers stay thin)
- Keep shared types/utilities in `packages/shared`
- Frontend components must come from `packages/ui`
- Keep OpenAPI contract and markdown specs aligned with implemented behavior

## UI Rules

- All UI must use `packages/ui` (`primitives/`, `patterns/`, `blocks/`)
- Pages must not create bespoke layouts; compose `patterns/` and `blocks/`
- CRUD list pages must use `ResourceListPage`
- Tables must use `ResourceTable` (or `DataTable` alias only for compatibility)
- Dialog forms must use `ResourceFormDialog` (or `FormDialog` alias only for compatibility)
- Page titles must use `PageHeader`
- If a new UI need arises, add/extend components in `packages/ui` instead of hand-rolling in pages

## Definition of done

- `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` pass
- OpenAPI stays in sync with implemented endpoints
- Specs in `packages/specs` are updated whenever behavior changes
