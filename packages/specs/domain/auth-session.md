# Domain: Auth Session

## Fields

- `id`
- `tokenHash`
- `userId`
- `role`
- `expiresAt`
- `revokedAt?`
- `lastSeenAt?`
- timestamps

## Behavior

- Cookie-based auth for web requests.
- Server validates session token against non-revoked, non-expired session rows.
