# Domain: Candidate Invite Link

## Fields

- `id`, `tokenHash`, `candidateId`, `expiresAt`, `revokedAt?`, `accessCount`, `lastAccessedAt?`, timestamps.

## Relationships

- Belongs to a candidate.

## Validation / Rules

- Active link requires:
  - not revoked
  - not deleted
  - not expired (date check)
- Access increments usage counters.

## Permissions

- Create link (`/api/candidate-links`): admin/super-admin.
- Consume link (`/api/public-candidate/:token*`): public tokenized route.

## Lifecycle

- `active` -> `expired` by date or `revoked` by backend state.
