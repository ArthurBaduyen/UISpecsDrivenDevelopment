# Auth and Session Model

## Approach

- Auth.js (NextAuth) session-based auth in `apps/web`
- Credentials provider placeholder for local development scaffolding

## Session Model

- Session includes user id and active organization id
- Active organization can be switched via UI placeholder and persisted in session

## RBAC

- Membership role per organization: `OWNER`, `ADMIN`, `MEMBER`
- API authorization (future): evaluate role + organization scope per request
