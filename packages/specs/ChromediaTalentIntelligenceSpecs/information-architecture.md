# Information Architecture

## Sitemap / Route Map

- `/`
  - Purpose: root redirect.
  - Behavior: if authenticated admin role -> default admin route; else -> `/login`.
- `/login`
  - Purpose: admin/super-admin sign-in and password reset completion (`?resetToken=`).
  - Access: public.
- `/design`
  - Purpose: internal design system reference page.
  - Access: public in current app.
- `/admin/dashboard`
  - Purpose: operations analytics dashboard.
  - Access: `super_admin`, `admin`.
- `/admin/candidates`
  - Purpose: candidate listing, filtering, sorting, add/edit/delete actions.
  - Access: `super_admin`, `admin`.
- `/admin/candidates/:candidateId`
  - Purpose: full candidate profile editor/view.
  - Access: `super_admin`, `admin`.
- `/admin/skills`
  - Purpose: skill category/skill/capability taxonomy management.
  - Access: `super_admin`, `admin`.
- `/admin/shared-profiles`
  - Purpose: shared profile listing, status tracking, revoke/adjust/history.
  - Access: `super_admin`, `admin`.
- `/admin/test-cases`
  - Purpose: QA features, test case CRUD, generation, runs/results.
  - Access: `super_admin`, `admin`.
- `/admin/audit-logs`
  - Purpose: full audit log listing/filtering.
  - Access: `super_admin` only.
- `/admin/settings`
  - Purpose: UI settings; user management tab (super-admin only).
  - Access: `super_admin`, `admin`.
- `/admin/account`
  - Purpose: placeholder account page.
  - Access: `super_admin`, `admin`.
- `/customer/candidates/:candidateId/preview`
  - Purpose: admin preview of client-facing candidate profile layout.
  - Access: `super_admin`, `admin`.
- `/shared/:shareToken`
  - Purpose: client-facing shared profile view via token.
  - Access: public tokenized route.
- `/candidate/:token/start`
  - Purpose: candidate invite start screen.
  - Access: public tokenized route.
- `/candidate/:token/skills`
  - Purpose: candidate skill-selection wizard.
  - Access: public tokenized route.
- `*`
  - Purpose: 404 page.

## Navigation Hierarchy

- Admin sidebar top section:
  - Dashboard
  - Candidates
  - Skills
  - Shared Profiles
  - QA Test Cases
  - Audit Logs (only for `super_admin`)
- Admin sidebar bottom section:
  - Account
  - Settings
  - Logout

## Per-Route Access Control

- Protected routes use role whitelist at route layer.
- API enforcement mirrors UI route protection using `requireAuth` + `requireRole`.
- Additional API restrictions:
  - `/api/users*` and `/api/audit-logs*` require `super_admin`.
  - `/api/public-*` endpoints bypass auth and depend on link validity.

## Cross-Links Between Pages

- Dashboard cards deep-link to pre-filtered candidates/shared profile pages using query params.
- Candidate list row click -> candidate profile route.
- Candidate actions include open invite link (`/candidate/:token/start`) and copy preview (`/customer/candidates/:id/preview`).
- Candidate profile “Share to client” creates shared link consumed by `/shared/:shareToken`.
- Settings UI tab links to `/design`.
- 404 page routes authenticated users back to role-default admin route.
