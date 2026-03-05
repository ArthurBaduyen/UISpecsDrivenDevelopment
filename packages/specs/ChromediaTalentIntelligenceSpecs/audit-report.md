# Reverse-Engineering Audit Report

## Stack Detection

- Frontend: React + TypeScript + Vite + React Router + Tailwind-style utility classes.
- Backend: Express + TypeScript + Prisma/PostgreSQL + Zod validation.
- Auth: Cookie-based JWT access + refresh token sessions + CSRF cookie/header validation.
- Data layer: REST endpoints consumed via `fetchWithAuth` service wrappers.

## Route Map (Authoritative)

- Public/auth: `/`, `/login`, `/design`, `/shared/:shareToken`, `/candidate/:token/start`, `/candidate/:token/skills`, `*`.
- Admin protected: `/admin/dashboard`, `/admin/candidates`, `/admin/candidates/:candidateId`, `/admin/skills`, `/admin/shared-profiles`, `/admin/test-cases`, `/admin/settings`, `/admin/account`.
- Super-admin only: `/admin/audit-logs`.
- Admin preview: `/customer/candidates/:candidateId/preview` (uses candidate profile view).

## API Surface (Authoritative)

- Auth/admin-user: `/api/auth/*`, `/api/users*`, `/api/health`.
- Admin resources: `/api/candidates*`, `/api/skills*`, `/api/shared-profiles*`, `/api/audit-logs*`, `/api/features*`, `/api/test-cases/:id`, `/api/test-runs/:id*`, `/api/candidate-links`.
- Public tokenized: `/api/public-shares/:token`, `/api/public-shares/:token/candidate`, `/api/public-candidate/:token`, `/api/public-candidate/:token/skills`.

## Entity List (Prisma + DTO)

- `User`
- `AuthSession`
- `PasswordResetToken`
- `Candidate`
- `CandidateAccount`
- `ClientAccount`
- `CandidateInviteLink`
- `CandidateSkillSelection`
- `SharedProfile`
- `AuditLog`
- `SkillTaxonomy`
- `SkillCategory`
- `Skill`
- `Feature`
- `TestCase`
- `TestRun`
- `TestRunResult`

## Key Behavior Findings

- Role matrix is strict and duplicated at UI and API layers.
- Public link validity is date/day-based and revocation-aware.
- List pages consistently implement server-side query pagination/filter/sort conventions.
- Candidate/profile editing heavily uses modal workflows and optimistic-local + refetch/persist patterns.
- QA module is first-class with generated baseline test cases and run/result tracking.

## Open Questions / Assumptions

- Candidate/client first-class authenticated portals are not active in current UI; treated as out of scope for rebuild phase 1-2.
- Some localStorage migration helpers are legacy only; API is treated as source of truth.
