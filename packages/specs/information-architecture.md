# Information Architecture (Normalized)

## Route map

- `/login` public admin sign-in.
- `/admin/dashboard` auth + `super_admin|admin`.
- `/admin/candidates` auth + `super_admin|admin`.
- `/admin/candidates/:candidateId` auth + `super_admin|admin`.
- `/admin/skills` auth + `super_admin|admin`.
- `/admin/shared-profiles` auth + `super_admin|admin`.
- `/admin/test-cases` auth + `super_admin|admin`.
- `/admin/settings` auth + `super_admin|admin`.
- `/admin/account` auth + `super_admin|admin`.
- `/admin/audit-logs` auth + `super_admin` only.
- `/shared/:shareToken` public tokenized.
- `/candidate/:token/start` public tokenized.
- `/candidate/:token/skills` public tokenized.

## Sidebar hierarchy

- Dashboard
- Candidates
- Skills
- Shared Profiles
- QA Test Cases
- Audit Logs (super-admin only)
- Account
- Settings
- Logout

## First vertical slice scope

- `/login`
- `/admin/dashboard` (minimal KPI shell)
- `/admin/candidates` (list + create/edit/delete)
