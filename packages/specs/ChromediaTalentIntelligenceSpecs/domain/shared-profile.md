# Domain: Shared Profile

## Fields

- `id` (string, required).
- `shareToken` (string, required; public URL key).
- `candidateId`, `candidateName`, `candidateRole` (required).
- `sharedWithName`, `sharedWithEmail` (required).
- `rateLabel` (required string).
- `expirationDate` (required date/time string).
- `sharedAt` (required date/time string).
- `revokedAt?`, `accessCount?`, `lastAccessedAt?`.

## Relationships

- Belongs to candidate.
- Optionally attributed to sharing user (`sharedByUser`).
- Audit logs track create/update/revoke/open events.

## Validation Rules

- Recipient name/email required; email must be valid.
- Expiration required and must be today or later (UI).
- Optional custom rate must parse to positive amount.

## Display Rules

- Shared profiles table columns:
  - Profile (candidate name/role)
  - Shared With (name/email)
  - Rate
  - Link Availability (date + remaining days)
  - Status
  - Opened count + last opened
  - Shared On
- Status derivation:
  - `Revoked` if `revokedAt` set.
  - `Expired` if expiration < today (day granularity).
  - otherwise `Active`.

## Permissions

- `super_admin`, `admin`: list/query/create/update/revoke/delete shared links.
- Public: can fetch shared profile + candidate via token if link usable.

## Lifecycle

- `Active` -> `Expired` by date rollover or `Revoked` by action.
