# UI System Specification

## Visual Language

- Dense B2B admin interface, white cards over light gray app canvas (`#f1f5f9`).
- Typography: mostly medium/semi-bold sans with compact headings and small helper text.
- Common spacing rhythm: 4/8/12/16 px; table/list pages use tight row spacing.
- Borders/shadows: subtle borders (`#dbe3ea`/`#eaecf0`) and soft card shadows.
- Color semantics:
  - Primary action: cyan/blue (`#1595d4`).
  - Success/active: green tones.
  - Warning/expired: amber/orange tones.
  - Danger/delete/error: red tones.

## Reusable Layout Patterns

- `AdminShell` acts as AppFrame/AppShell with sticky left sidebar and scrollable main panel.
- Page structure pattern for list pages:
  - Sticky top toolbar/header.
  - Search toggle + filter popover.
  - Primary CTA button.
  - `DataTable` + `PaginationControls`.
- Detail/editor pattern (candidate profile):
  - Large content canvas with left in-page section nav.
  - Section blocks with edit/add actions.
  - Modal-driven editing for fields and nested data.

## Common Interaction Patterns

- Context row actions via `RowActionsButton` + `FloatingPopover` menu.
- Confirm-destructive flows:
  - Modal confirmation (candidate delete, user delete).
  - `window.confirm` in QA test case delete.
- Forms are modal-centric (`ModalShell`) with inline field errors.
- Candidate skill public flow:
  - Autosave with retry + unsaved-change guard.
  - Progress side rail + keyboard shortcuts (`Alt/Cmd + ArrowLeft/ArrowRight`).

## Standard States

- Loading:
  - Route-level “Loading...” for protected route readiness.
  - Table/list skeletons (`TableSkeleton`) and placeholder cards on dashboard.
- Empty:
  - `EmptyState` component with concise title + guidance message.
- Error:
  - Inline `QueryErrorBanner` with retry button.
  - Toast errors for mutations and action failures.

## Toast / Alert Patterns

- Global toast stack at top-right.
- Variants: `success`, `error`, `info`.
- Auto-dismiss ~2.8s; manual dismiss button.
- Used for CRUD feedback, copy-link results, save/retry failures, and permission-protective notices.

## Theming / Dark Mode

- Theme preference toggled in Settings UI and persisted locally.
- Design system page reflects current theme token state.
- No deep dark-mode-specific page redesign; mostly token-level theme switch.
