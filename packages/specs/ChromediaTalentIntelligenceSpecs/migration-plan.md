# Migration Plan (Spec + UI Driven Monorepo)

## Phase 1: Auth, App Shell, Navigation

- Implement cookie-based auth/session in `apps/api` (`/auth/login`, `/auth/session`, `/auth/refresh`, `/auth/logout`) with CSRF.
- Build `apps/web` `AppShell` and protected-route role guard.
- Implement route map skeleton and sidebar parity.
- Ship login, 404, and minimal dashboard shell.

### Definition of Done

- [ ] Login/logout/session refresh works with cookies + CSRF.
- [ ] Protected routes enforce role access and redirect behavior.
- [ ] Sidebar/navigation matches IA including super-admin conditional item.
- [ ] Error boundary + toast provider + query state primitives integrated.

## Phase 2: Core CRUD Resources

- Build candidates list + add/edit/delete + invite link generation.
- Build candidate profile editor with modal workflows and share modal.
- Build skills taxonomy 3-level drilldown with full-state persistence.
- Build shared profiles list and revoke/adjust flows.

### Definition of Done

- [ ] Candidate CRUD + filters/sorts/pagination match source behavior.
- [ ] Candidate profile section edits and skill toggles persist.
- [ ] Skills taxonomy CRUD persists and validates uniqueness/structure.
- [ ] Shared profile lifecycle (create/update/revoke/query) complete.
- [ ] Audit logs appended for candidate/skills/share/auth actions.

## Phase 3: Dashboards and QA Module

- Implement dashboard analytics cards/charts/tables from candidates/skills/shares.
- Build QA feature/test case/test run/test result resources and UI.
- Add baseline test case generation endpoint and CSV export.

### Definition of Done

- [ ] Dashboard KPIs and deep links reconcile with backend datasets.
- [ ] QA CRUD flows and run-result recording functional end-to-end.
- [ ] Baseline generation and bundle toggles implemented.
- [ ] CSV export parity achieved.

## Phase 4: Roles, User Management, Edge Cases

- Build settings user-management tab (super-admin only) with full user lifecycle.
- Enforce API-level role policy and lockout behavior.
- Finalize tokenized public flows (`/shared/:shareToken`, `/candidate/:token/*`) with expiration/revoke edge handling.
- Harden retries, loading/error/empty states, and destructive confirmations.

### Definition of Done

- [ ] Super-admin-only APIs/routes verified.
- [ ] User CRUD/reset/set-password flows complete.
- [ ] Tokenized links correctly handle invalid/expired/revoked states.
- [ ] Unsaved-changes guard and autosave retry behavior tested.
- [ ] Comprehensive acceptance test pass for all page specs.
