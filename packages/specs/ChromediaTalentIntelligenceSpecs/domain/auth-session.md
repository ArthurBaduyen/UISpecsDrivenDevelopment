# Domain: Auth Session

## Fields

- `id` (UUID), `tokenHash` (refresh token hash), `role`, `email`, `name`.
- `userId?`, `candidateId?`.
- `expiresAt`, `revokedAt?`, `lastSeenAt?`, timestamps.

## Session Scheme

- Access token: short-lived JWT in HTTP-only cookie.
- Refresh token: rotating token in HTTP-only cookie, persisted as hashed session row.
- CSRF token: cookie mirrored in `x-csrf-token` header for non-safe methods.

## Permissions / Behavior

- `/api/auth/session` returns active session if access token valid, else attempts refresh.
- `/api/auth/refresh` rotates refresh token and issues new access+csrf tokens.
- `/api/auth/logout` revokes refresh session and clears cookies.
- Candidate/client roles cannot use normal admin login route; receive 403.
