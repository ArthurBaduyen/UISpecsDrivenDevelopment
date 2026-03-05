# Domain: User

Managed user for admin backoffice.

## Fields

- `id`
- `email` (unique)
- `username`
- `name`
- `role` (`super_admin|admin|candidate|client`)
- `isEnabled`
- `passwordHash`
- `lastLoginAt?`
- timestamps

## Rules

- Dashboard access only for `super_admin|admin`.
- Candidate/client users cannot use admin login.
