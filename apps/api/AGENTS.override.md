# API Agent Override

- Keep Nest controllers minimal and move logic to services.
- Validate external input with Zod schemas from `packages/validation`.
- Use `@saas/db` Prisma client wrapper instead of creating ad-hoc database clients.
- For new REST endpoints, update `packages/specs/openapi.yaml` in the same change.
