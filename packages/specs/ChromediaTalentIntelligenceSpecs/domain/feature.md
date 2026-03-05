# Domain: QA Feature

## Fields

- `id`, `name`, `description?`.
- `rolesInvolved[]`, `platforms[]`, `browsersOrDevices[]`.
- `hasApi` (boolean), timestamps.

## Relationships

- 1:many `TestCase`.
- 1:many `TestRun`.

## Validation Rules

- `name` required on create.

## Display Rules

- Feature selector drives QA test case and run context.

## Permissions

- CRUD: `super_admin`, `admin`.
