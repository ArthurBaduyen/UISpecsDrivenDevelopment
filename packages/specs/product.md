# Product Overview: Chromedia Talent Intelligence (Monorepo Adaptation)

Chromedia Talent Intelligence is an admin-operated talent operations platform with two surfaces:

1. Authenticated admin backoffice for operations, analytics, and resource management.
2. Public tokenized candidate/client flows for invite-based skill submission and profile sharing.

## Core personas

- `super_admin`: full platform controls including audit logs and managed users.
- `admin`: day-to-day operations (candidates, skills, sharing, QA).
- `candidate`/`client`: tokenized public flows only (no dashboard login).

## Core modules

- Auth/session and protected admin routing.
- Admin shell and role-based navigation.
- Candidates lifecycle and profile management.
- Skills taxonomy.
- Shared profiles lifecycle.
- QA test-case and test-run module.
- Audit logs and super-admin user management.

## Monorepo implementation constraints

- API: NestJS in `apps/api`.
- DB: Prisma in `packages/db`.
- Validation: Zod in `packages/validation`.
- UI composition: `packages/ui` primitives/patterns/blocks.
- Specs authority: `packages/specs/*`.
