# Page Spec: Admin QA Test Cases

## Route Paths

- `/admin/test-cases`

## Access Rules

- Auth required.
- Roles: `super_admin`, `admin`.

## Layout Structure

- `AdminShell`.
- Header action bar (export/generate/add/start run/complete run).
- Feature + filter control section.
- Main QA resource table.
- Modals:
  - Test case editor
  - Start test run
  - Record test result

## UI Composition

- Table columns: Title, Type, Priority, Automatable, Tags, Run Status, Actions.
- Form controls for feature creation and query filters.
- Run summary panel (total/pass/fail/blocked/not-run).

## Data Dependencies

- Features: `GET/POST /api/features`
- Test cases: `GET/POST /api/features/:id/test-cases`, `PUT/DELETE /api/test-cases/:id`
- Baseline generation: `POST /api/features/:id/test-cases/generate`
- Runs/results: `GET/POST /api/features/:id/test-runs`, `PUT /api/test-runs/:id`, `GET/PUT /api/test-runs/:id/results*`

## Interactions

- Create/edit test cases with validation.
- Delete test case requires confirm dialog.
- Generate baseline cases with disabled bundle toggles.
- Start run, mark run complete, and record per-test-case execution result.
- Export current table rows to CSV.

## Validation

- Test case editor:
  - title required
  - priority/type required
  - at least one step and expected result
  - testData must be valid JSON
- Run creation requires run name.

## States

- Loading state while fetching feature/testcase/run data.
- Empty row message: `No test cases found.`
- Errors via toasts.

## Acceptance Criteria

- Selected feature context governs all test case and run operations.
- Run result updates are reflected in table and run summary.
- CSV export includes key test case fields and normalized line formatting.
