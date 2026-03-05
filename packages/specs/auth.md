# Auth Spec (Normalized)

Slice 1 implements admin cookie-session auth:

- `POST /auth/login`
- `GET /auth/session`
- `POST /auth/logout`

Role gating for admin surfaces:

- allowed: `super_admin`, `admin`
- denied: `candidate`, `client`

See `packages/specs/domain/auth-session.md` and `packages/specs/api/openapi.yaml`.
