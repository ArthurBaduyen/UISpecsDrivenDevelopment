# Page Spec: Admin Audit Logs

## Route Paths

- `/admin/audit-logs`

## Access Rules

- Auth required.
- Role: `super_admin` only.

## Layout Structure

- `AdminShell`.
- `PageHeader` + search/filter toolbar.
- `ResourceTable`.
- `PaginationControls`.

## UI Composition

- Columns: When, Actor, Action, Entity, Entity ID.
- Search toggle + filter popover (Action, Entity).

## Data Dependencies

- `GET /api/audit-logs/query` with pagination/filter/sort.

## Interactions

- Sorting on all visible columns.
- Reset button returns default filters and sort (`createdAt desc`).

## States

- Loading: `TableSkeleton`.
- Empty: `No audit log entries yet`.
- Error: retry banner.

## Acceptance Criteria

- Non-super-admin users cannot access route.
- Query/sort controls map to backend query parameters consistently.
