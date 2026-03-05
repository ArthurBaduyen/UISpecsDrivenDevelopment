# Domain: Candidate Invite Link

## Fields

- `id`
- `candidateId`
- `tokenHash`
- `expiresAt`
- `revokedAt?`
- `accessCount`
- `lastAccessedAt?`
- timestamps

## Behavior

- Created by admins via `/api/candidate-links`.
- Consumed by public candidate token routes in later slices.
