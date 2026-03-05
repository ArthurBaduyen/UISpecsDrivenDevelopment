# UI Inventory Mapping (Normalized)

## CRUD list pages

- Standard composition: `PageHeader + Toolbar + ResourceTable + ResourceFormDialog`.
- Canonical block: `ResourceListPage`.

## Dashboard pages

- Standard composition: `AppFrame + PageHeader + StatsRow + Section`.

## Standard states

- Loading: `LoadingState`/skeleton primitives.
- Empty: `EmptyState`.
- Error: `ErrorState` + retry action.

## Vertical-slice target pages

- Login page (`/login`).
- Admin dashboard (`/admin/dashboard`) minimal data-driven metrics.
- Admin candidates (`/admin/candidates`) list/create/edit/delete.
