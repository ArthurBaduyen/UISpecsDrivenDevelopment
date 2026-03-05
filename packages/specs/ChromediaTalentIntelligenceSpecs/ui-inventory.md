# UI Inventory and Mapping

## Tables

- Candidate list table
  - Columns: name, role, technologies, expected salary, available, status, actions.
  - Mapping: `packages/ui` -> `ResourceListPage` + `ResourceTable` + `RowActionsMenu`.
- Skills category/skills/capabilities tables
  - Mapping: `ResourceTable` + `ResourceHierarchyPage`.
- Shared profiles table
  - Columns include status/open metrics and actions.
  - Mapping: `ResourceListPage` + `StatusBadge` + `RowActionsMenu`.
- Audit logs table
  - Mapping: `AuditLogTable` pattern using `ResourceTable`.
- QA test case table
  - Mapping: `ResourceTable` with inline action button group.
- Dashboard mini tables (completeness, role gap)
  - Mapping: `Card` + embedded `ResourceTable` + `PaginationControls`.

## Forms

- Login form + reset-password form
  - Mapping: `AuthCard` + `FormInputField` + `PrimaryButton`.
- Add/Edit candidate modal (multi-section form + CV upload)
  - Mapping: `ResourceFormDialog` + grouped field blocks.
- Share profile modal
  - Mapping: `ResourceFormDialog` with preset/custom rate selector.
- Skills add/edit modals (category/skill/capability)
  - Mapping: `ResourceFormDialog` small/medium variants.
- QA test case editor modal
  - Mapping: `ResourceFormDialog` large variant + multiline/JSON fields.
- User management modals (create/edit/reset/set-password/delete)
  - Mapping: `ResourceFormDialog` + `ConfirmDialog`.

## Dialogs / Modals

- Confirm delete candidate/project/user.
- Share history modal.
- Candidate profile section edit modals.
- Candidate flow completion/add-more overlays.
- Mapping: `ConfirmDialog`, `ResourceFormDialog`, `InfoDialog`.

## Cards

- Dashboard KPI cards.
- Shared profile performance/funnel/chart cards.
- Design system demo cards.
- Mapping: `StatCard`, `ChartCard`, `ContentCard`.

## Charts

- Candidate funnel (horizontal segment bars).
- Shared profile performance (bars + line).
- Skills radar chart in profile.
- Mapping: `ChartCard` + custom chart blocks (or Recharts wrappers preserving shape and labels).

## Navigation / Shell

- Sidebar app shell with top/bottom nav zones.
- Page-level toolbar pattern with search toggle + filter popover + CTA.
- Mapping: `AppShell`, `PageHeader`, `Toolbar`, `FilterPopover`.

## Standard States

- Loading table skeletons.
- Empty state panel with title/message.
- Error banner with retry.
- Toast notifications (success/error/info).
- Mapping: `ResourceLoadingState`, `ResourceEmptyState`, `ResourceErrorState`, `ToastHost`.
