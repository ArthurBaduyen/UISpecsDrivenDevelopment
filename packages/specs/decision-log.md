# Decision Log

## 2026-03-05: Extracted spec file mismatch

- Conflict: The extracted directory did not include `auth.md`, `data-model.md`, or `openapi.yaml` at the expected root paths.
- Decision: Use the extracted authoritative files (`api/api-contract.md`, `domain/*.md`, `ui-pages/*.md`) plus existing monorepo spec files as canonical inputs, then normalize into `packages/specs/*`.
- Why: Keeps behavior intent intact while matching this monorepo’s spec structure.
- Follow-up: Keep normalized `packages/specs/api/openapi.yaml` authoritative for implementation.

## 2026-03-05: Auth stack convention vs extracted app stack

- Conflict: Extracted system references cookie JWT + refresh + CSRF in an Express app, while this monorepo web uses Next.js and previously had Auth.js scaffolding.
- Decision: Implement cookie-based auth endpoints in `apps/api` and use them from `apps/web` pages/middleware; keep Auth.js files as non-authoritative legacy scaffolding for now.
- Why: Preserves UX/behavioral intent and aligns with this monorepo architecture (Nest + Next App Router).
- Follow-up: Remove legacy Auth.js scaffolding after full migration to avoid dual-auth confusion.

## 2026-03-05: UI architecture rule

- Conflict: Extracted specs mention legacy components (`AdminShell`, `ModalShell`, etc.) from the old codebase.
- Decision: Map those behaviors to `packages/ui` primitives/patterns/blocks (`AppFrame`, `PageHeader`, `Toolbar`, `ResourceListPage`, `ResourceFormDialog`, `ResourceTable`).
- Why: Project UI conventions are source of truth and must be reused consistently.
- Follow-up: Add missing UI blocks only in `packages/ui`; keep pages composition-only.

## 2026-03-05: Domain scope for first vertical slice

- Conflict: Full extracted domain includes QA, shared profiles, tokenized candidate flows, audit logs, and admin user management.
- Decision: First vertical slice implements the smallest meaningful core flow: `Login -> Admin shell -> Candidates CRUD (+ candidate invite-link creation endpoint)`.
- Why: Satisfies incremental runnable delivery and de-risks architecture before broader modules.
- Follow-up: Implement remaining entities/modules in subsequent slices per `migration-plan.md`.

## 2026-03-05: Dashboard dependency gap vs available domain modules

- Conflict: Dashboard spec references `skills` and `shared profiles` data sources, but those entities/endpoints are not yet implemented in this monorepo slice.
- Decision: Implement dashboard summary from available canonical data (`Candidate`) with deep links and role/completeness analytics, and defer skills/shared-profile charts to a later slice.
- Why: Preserves UX intent for admin operational visibility while keeping deliverables incremental and runnable.
- Follow-up: Add `skills` and `shared profiles` domain + API modules, then expand `/api/dashboard/summary` and dashboard UI sections.

## 2026-03-05: Skills taxonomy persistence strategy

- Conflict: Skills UI spec expects local tree editing and persistence via full taxonomy replace, while our existing API style commonly uses per-entity CRUD routes.
- Decision: Implement `PUT /api/skills` as canonical full-state replace (taxonomy snapshot), plus query helpers (`GET /api/skills/query`) for table scopes.
- Why: Matches spec behavior/UX and keeps future client-side optimistic editing straightforward.
- Follow-up: Add audit history/versioning for taxonomy updates in a later slice.

## 2026-03-05: Shared profile history dependency

- Conflict: Shared profile page spec expects an audit-history modal sourced from `/api/audit-logs`, but the audit module is not implemented in current slices.
- Decision: Implement core shared-profile workflows first (query/create/adjust/revoke/copy/public token read) and defer history modal content until audit logs are added.
- Why: Preserves core business flow and keeps this slice runnable without blocking on super-admin/audit domain.
- Follow-up: When audit-log module lands, wire history modal data source and event timeline rendering.
