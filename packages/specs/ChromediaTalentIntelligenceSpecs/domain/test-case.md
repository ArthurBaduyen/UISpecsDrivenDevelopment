# Domain: QA Test Case

## Fields

- `id`, `featureId`, `title`.
- `preconditions`, `testData` (JSON), `steps[]`, `expectedResults[]`, `postConditions`.
- `priority` (`P0|P1|P2`), `type` (`Smoke|Functional|Negative|Regression|API|Integration|UI|Security|Performance`).
- `isAutomatable`, `automationNotes`, `tags[]`, timestamps.

## Validation Rules

- Title required.
- Steps min 1.
- Expected results min 1.
- Priority and type required enums.
- `testData` must be valid JSON when present (UI validation).

## Display Rules

- QA table columns: Title, Type, Priority, Automatable, Tags, Run Status, Actions.

## Permissions

- CRUD + generation: `super_admin`, `admin`.
