# API Contract

## Base

- Base prefix: `/api`
- Transport: JSON over HTTPS/HTTP
- Auth cookies: `chromedia_access`, `chromedia_refresh`, `chromedia_csrf`

## Auth / Session Scheme

- Access token in HTTP-only cookie; required for protected routes.
- Refresh token in HTTP-only cookie; `/auth/session` and `/auth/refresh` rotate/reissue tokens.
- CSRF required for non-safe methods except explicit exemptions:
  - `/api/auth/login`
  - `/api/auth/refresh`
  - `/api/auth/reset-password`
  - `/api/public-candidate/*`
- CSRF check: header `x-csrf-token` must match CSRF cookie.

## Error Format

- Primary error shape: `{ "message": string }`
- Common statuses:
  - `400` validation/business rule failure
  - `401` unauthenticated/expired session
  - `403` forbidden / CSRF invalid
  - `404` missing resource / invalid tokenized link
  - `429` login lockout/rate limit
  - `500` unexpected server error

## Pagination / Filter / Sort Convention

- Query endpoints return:
  - `{ items: T[], total: number, page: number, pageSize: number, totalPages: number }`
- Common query params:
  - `page`, `pageSize`, `q`, plus resource-specific filters.
- Sort pattern:
  - `sortBy=<field>`
  - `sortDir=asc|desc`

## Endpoints

### Health/Auth

- `GET /health`
- `POST /auth/login` body: `{ email, password, otpCode? }`
- `GET /auth/session`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/reset-password` body: `{ token, password }`

### User Management (super-admin)

- `GET /users?q=`
- `POST /users` body: `{ email, username, role, password }`
- `PATCH /users/:id` body: `{ username?, role?, isEnabled? }`
- `POST /users/:id/reset-password`
- `POST /users/:id/set-password` body: `{ password }`
- `DELETE /users/:id`

### Candidates

- `GET /candidates`
- `GET /candidates/:id`
- `POST /candidates` body: full candidate payload
- `PUT /candidates/:id` body: candidate payload without `id`
- `DELETE /candidates/:id`
- `GET /candidates/query` filters:
  - `q`, `status`, `availability`, `role`, `progress`, `sortBy`, `sortDir`, pagination
- `POST /candidate-links` body: `{ candidateId, expirationDate? }`

### Skills

- `GET /skills`
- `PUT /skills` body: `{ taxonomyVersion?, updatedAt?, categories[] }`
- `GET /skills/query`
  - `scope=categories|skills`
  - `categoryId` (required for `skills` scope)
  - `q`, `sortBy`, `sortDir`, pagination

### Shared Profiles

- `GET /shared-profiles`
- `POST /shared-profiles` body: full shared profile payload
- `PUT /shared-profiles/:id` body: shared profile payload without `id`
- `DELETE /shared-profiles/:id`
- `POST /shared-profiles/:id/revoke`
- `GET /shared-profiles/query` filters:
  - `q`, `status`, `sortBy`, `sortDir`, pagination

### Audit Logs (super-admin)

- `GET /audit-logs`
- `GET /audit-logs/query` filters:
  - `q`, `action`, `entity`, `sortBy`, `sortDir`, pagination

### QA Features / Test Cases / Runs

- `GET /features`
- `POST /features` body: `{ name, description?, rolesInvolved?, platforms?, browsersOrDevices?, hasApi? }`
- `GET /features/:id/test-cases` filters: `type`, `priority`, `isAutomatable`, `q`
- `POST /features/:id/test-cases`
- `PUT /test-cases/:id`
- `DELETE /test-cases/:id`
- `POST /features/:id/test-cases/generate` body: bundle selection + `persist`
- Alias also supported: `POST /features/:id/test-cases:generate`
- `GET /features/:id/test-runs`
- `POST /features/:id/test-runs`
- `PUT /test-runs/:id`
- `GET /test-runs/:id/results`
- `PUT /test-runs/:id/results/:testCaseId`

### Public Tokenized Endpoints

- `GET /public-shares/:token`
- `GET /public-shares/:token/candidate`
- `GET /public-candidate/:token`
- `PUT /public-candidate/:token/skills` body: `{ skillSelections: [{ categoryId, selectedSubSkills[] }] }`

## Background Jobs / Webhooks

- No external webhook surface detected.
- Background-like behavior is synchronous request-time processing (test case generation, session rotation, audit append).
