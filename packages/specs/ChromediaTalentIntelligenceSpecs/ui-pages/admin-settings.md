# Page Spec: Admin Settings

## Route Paths

- `/admin/settings`

## Access Rules

- Auth required.
- Roles: `super_admin`, `admin`.
- User-management sub-tab is `super_admin` only.

## Layout Structure

- `AdminShell`.
- Two-column settings layout:
  - Left tab rail (`UI`, `User`)
  - Right content panel.

## UI Composition

- UI tab:
  - Theme toggle button.
  - Link button to `/design`.
- User tab:
  - Search toolbar.
  - `DataTable` of managed users.
  - Row action popover and management modals.

## Data Dependencies

- UI settings: local only (`useThemePreference`).
- User management APIs:
  - `GET/POST /api/users`
  - `PATCH/DELETE /api/users/:id`
  - `POST /api/users/:id/reset-password`
  - `POST /api/users/:id/set-password`

## Interactions

- Create/edit user.
- Generate and copy reset link.
- Set password directly.
- Delete user with self-delete guard.

## Validation

- Create user email format validation in UI.
- Server-side validation for username/password/role constraints.

## States

- Loading skeleton for user table.
- Empty user list state.
- Error banner with retry.

## Important Copy

- User tab heading: `User Management`
- Self-delete message: `You can’t delete your own account`.

## Acceptance Criteria

- Admin (non-super-admin) can only access UI settings tab.
- User CRUD and reset/set password flows reflect in table and toasts.
- Theme preference persists across reloads.
