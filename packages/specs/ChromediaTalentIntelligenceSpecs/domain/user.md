# Domain: Managed User

## Fields

- `id`, `email`, `username`, `role`, `isEnabled`.
- `name` (display), `lastLoginAt?`, `createdAt`, `updatedAt`.
- Password is write-only via create/set/reset flows.

## Relationships

- 1:many to auth sessions.
- Optional relation to candidate/client account mapping tables.

## Validation Rules

- Create: valid email, username length 3-64, role in `super_admin|admin`, password min 8.
- Patch: at least one of username/role/isEnabled must be provided.
- Set/reset password: password min 8.

## Display Rules

- User management table columns: Name, Email, Username, Role, Last Login, Status.
- Row actions: Edit, Reset Link, Set Password, Delete.

## Permissions

- All `/api/users*` endpoints: `super_admin` only.
- UI user-management tab shown only for `super_admin`.
- Self-delete is blocked in UI logic.

## Lifecycle

- Enabled/disabled via patch.
- Soft-delete supported (`deletedAt`) and revokes active sessions.
