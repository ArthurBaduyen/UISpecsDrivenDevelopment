# Page Spec: Admin Candidates

## Route Paths

- `/admin/candidates`

## Access Rules

- Auth required.
- Roles: `super_admin`, `admin`.

## Layout Structure

- `AdminShell`.
- `Toolbar`: expandable search, filter popover, `Add Candidate` CTA.
- `ResourceTable`: sortable candidate list.
- `PaginationControls`.
- `ResourceFormDialog`: Add/Edit candidate modal.
- `ConfirmDialog`: remove candidate.

## UI Composition

- `DataTable` columns: Candidate Name, Role, Technologies, Expected Salary, Available, Status, Actions.
- `StatusChip` for status.
- Row action popover: Edit, Candidate, Copy Link, Remove.
- `AddCandidateModal` with CV upload assist.

## Data Dependencies

- `GET /api/candidates/query` (search/filter/sort/pagination).
- `POST /api/candidates`, `PUT /api/candidates/:id`, `DELETE /api/candidates/:id`.
- `POST /api/candidate-links` (invite token generation).

## Interactions

- Row click -> `/admin/candidates/:candidateId`.
- `Candidate` action opens new tab to `/candidate/:token/start` from generated invite token.
- `Copy Link` copies `/customer/candidates/:id/preview` URL.
- Delete requires modal confirmation.

## Filters/Search/Sort

- Search by name/role/technologies.
- Filters: status, availability, role.
- Sortable columns: name, role, technologies, expectedSalary, available, status.
- Reset restores defaults.

## Validation

- Add/edit modal validates required identity/contact/location/compensation fields.
- Email/phone/salary validations enforced in modal before submit.
- Missing required fields can trigger “Create Draft Candidate” flow.

## States

- Loading: table skeleton.
- Empty: `No candidates found`.
- Error: banner with retry.

## Important Copy

- Primary CTA: `Add Candidate`.
- Delete modal title: `Remove Candidate`.

## UX Notes

- Search icon toggles input and focuses field.
- Copy-to-clipboard has fallback strategy + toast.

## Acceptance Criteria

- Query params and table state produce deterministic server query results.
- Candidate CRUD updates table state and toast feedback.
- Invite link generation failure surfaces actionable error toast.
