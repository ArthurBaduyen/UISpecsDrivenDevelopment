# Migration Plan (Normalized)

## Slice 1 (current)

- Auth login/session/logout for admin users.
- Admin shell/navigation + protected routing.
- Candidates CRUD list flow end-to-end (DB + API + UI).

## Slice 2

- Candidate profile detail and invite-tokenized candidate start/skills flow.
- Skills taxonomy CRUD.

## Slice 3

- Shared profiles lifecycle and public shared profile route.
- Dashboard analytics parity.

## Slice 4

- QA feature/test case/test run modules.
- Audit logs and super-admin user management.

## Quality gate per slice

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
