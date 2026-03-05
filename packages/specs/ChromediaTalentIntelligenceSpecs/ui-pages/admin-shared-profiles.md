# Page Spec: Admin Shared Profiles

## Route Paths

- `/admin/shared-profiles`

## Access Rules

- Auth required.
- Roles: `super_admin`, `admin`.

## Layout Structure

- `AdminShell`.
- `Toolbar`: expandable search + status filter popover.
- `ResourceTable` with row action menu.
- `PaginationControls`.
- Dialogs:
  - Share history
  - Adjust shared profile

## UI Composition

- `DataTable` columns:
  - Profile
  - Shared With
  - Rate
  - Link Availability
  - Status
  - Opened
  - Shared On
  - Actions
- Action menu: Copy Link, Resend, Adjust/Extend, History, Revoke.

## Data Dependencies

- `GET /api/shared-profiles/query`
- `PUT /api/shared-profiles/:id`
- `POST /api/shared-profiles/:id/revoke`
- Audit history source for modal: `/api/audit-logs` (filtered client-side by entity id).

## Interactions

- Copy/Resend copies public share URL.
- Revoke updates row status immediately.
- Adjust/Extend modal edits rate + expiration.
- History modal shows chronological share events.

## Filters/Search/Sort

- Search by candidate or recipient metadata.
- Status filter: all/active/expired/revoked.
- Sort by candidate, recipient, rate, expiration, status, opened count, shared date.

## Validation

- Adjust modal requires non-empty rate and expiration.

## States

- Loading: table skeleton.
- Empty: `No shared profiles yet`.
- Error: retry banner.

## Acceptance Criteria

- Revoked links immediately reflect `Revoked` state and disabled revoke action.
- Availability text correctly derives remaining days/expired state.
- History modal contains share-related audit events for selected link.
