# UI System (Normalized)

All pages must compose from `packages/ui`.

## Primitive layer

- Button, Card, Dialog, Input, Form, Table, Badge, Tabs, Select, Checkbox, Skeleton, Toast.

## Pattern layer

- AppFrame/AppShell
- PageLayout
- PageHeader
- Toolbar
- Section
- EmptyState / LoadingState / ErrorState

## Block layer

- ResourceTable
- ResourceFormDialog
- ResourceListPage
- StatCard / StatsRow

## Styling and theming

- Tailwind class-based styling.
- Dark mode is class-driven (`darkMode: 'class'`).
- No page-level bespoke layout systems.
