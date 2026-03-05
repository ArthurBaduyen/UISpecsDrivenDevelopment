# Page Spec: Admin Dashboard

## Route Paths

- `/admin/dashboard`

## Access Rules

- Auth required.
- Roles: `super_admin`, `admin`.

## Layout Structure

- `AdminShell` (sidebar app shell).
- `PageHeader`: title `Dashboard` + subtitle.
- Sections:
  - `KpiCardGrid` (At a Glance)
  - `WeeklyDeltaCards`
  - `FunnelChart` + `SharedPerformanceChart`
  - `ResourceTable` blocks for completeness and role gap.

## UI Composition

- Card metrics (clickable deep links).
- Custom SVG charts (funnel + line/bar combo).
- `DataTable` + `PaginationControls`.
- `QueryErrorBanner`, `TableSkeleton`, `EmptyState`.

## Data Dependencies

- `GET /api/candidates`
- `GET /api/skills`
- `GET /api/shared-profiles`

## Interactions

- KPI chip clicks navigate to filtered pages (`/admin/candidates` with query params, `/admin/shared-profiles`, `/admin/skills`).
- Funnel stage click opens candidates with corresponding `progress` filter.

## States

- Loading: card placeholders + table skeleton.
- Empty: `No dashboard data yet` when candidates dataset empty.
- Error: per-resource `QueryErrorBanner` with retry.

## Important Copy

- `At a Glance`, `Week-over-Week`, `Candidate Funnel`, `Shared Profile Performance`, `Profile Completeness`, `Role Demand vs Availability`.

## Acceptance Criteria

- Dashboard metrics reconcile with source list data.
- Navigation deep-links preserve expected filter query params.
- Error/retry can recover each failing data source independently.
