# Domain: QA Test Run Result

## Fields

- `id`, `runId`, `testCaseId`.
- `status` (`NotRun|Pass|Fail|Blocked`).
- `testedBy?`, `notes?`, `defectLink?`, `executedAt?`, timestamps.

## Relationships

- Belongs to `TestRun` and `TestCase`.
- Unique in DB by (`runId`, `testCaseId`).

## Validation Rules

- Upsert requires valid status enum.
- Endpoint verifies test case belongs to same feature as run.

## Display Rules

- Shown inline in test case table for active run.
- Optional defect link rendered when present.

## Permissions

- Upsert/read: `super_admin`, `admin`.
