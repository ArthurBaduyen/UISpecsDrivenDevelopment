# Page Spec: Candidate Profile (Admin + Shared)

## Route Paths

- `/admin/candidates/:candidateId`
- `/customer/candidates/:candidateId/preview`
- `/shared/:shareToken`

## Access Rules

- Admin routes require auth (`super_admin`, `admin`).
- `/shared/:shareToken` is public tokenized; link must be valid and not expired/revoked.

## Layout Structure

- `AdminShell` with `hideSidebar` (single-page detail layout).
- `ProfileHeader` with candidate identity, compensation, action buttons.
- Left `SectionNav` with anchors.
- Main section stack:
  - About
  - Working As
  - Video Introduction
  - Coderbyte Results
  - Project Experience
  - Education
  - Skills (radar + tracks)
- Multiple `ResourceFormDialog` modals for section edits.

## UI Composition

- Shared components: section headings, project cards, skill track cards, radar chart, confirm delete modal.
- Admin-only actions: edit/add icons, share-to-client button, modal saves.
- Shared view hides edit actions and shows recipient info header.

## Data Dependencies

- Admin view: `GET /api/candidates/:id`, `GET /api/skills`, `GET /api/shared-profiles`.
- Shared view: `GET /api/public-shares/:token/candidate`, `GET /api/public-shares/:token`.
- Mutations:
  - `PUT /api/candidates/:id`
  - `POST /api/shared-profiles`

## Interactions

- In-page navigation scrolls to anchors.
- Section edits persist via modal save and toast feedback.
- Skills toggles in profile use queued autosave with retry.
- Share profile modal validates and creates unique link; copies link to clipboard.
- Delete project uses confirm modal.

## Validation

- Project: required name/role/start/end and end >= start.
- Education: year/degree/school required.
- Share modal: recipient name/email + valid email + non-past expiration + valid custom rate.

## States

- Shared loading: centered `Loading shared profile...`.
- Shared invalid: `Link unavailable` message card.
- Error saves: toast error.

## Important Copy

- Shared invalid subtitle: `This shared profile link is invalid, removed, or expired.`
- Share success toast: `Profile shared successfully`.

## UX Notes

- Unsaved changes guard active while modal/edit state exists.
- Shared mode adds CTA buttons `Email Ryan` and `Schedule a meeting` (non-mutating placeholders).

## Acceptance Criteria

- All section edits are persisted and visible after refresh.
- Shared token route blocks invalid/expired/revoked links.
- Skills toggles eventually persist under intermittent failures (retry behavior).
