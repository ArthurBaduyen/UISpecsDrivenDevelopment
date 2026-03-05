# Domain: QA Test Run

## Fields

- `id`, `featureId`, `name`, `tester?`, `notes?`.
- `status` (`InProgress|Completed`), `startedAt`, `completedAt?`, timestamps.
- Derived summary in API response: `total/pass/fail/blocked/notRun`.

## Relationships

- Belongs to `Feature`.
- 1:many `TestRunResult`.

## Validation Rules

- Run name required on create.

## Permissions

- CRUD and status updates: `super_admin`, `admin`.

## Lifecycle

- Starts `InProgress`.
- Can transition to `Completed` (typically with `completedAt` set).
