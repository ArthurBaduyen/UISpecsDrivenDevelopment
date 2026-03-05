# Page Spec: Candidate Skill Form

## Route Paths

- `/candidate/:token/skills`

## Access Rules

- Public tokenized route.
- Requires active candidate invite link token.

## Layout Structure

- Two-pane layout:
  - Left: category step rail + per-category progress counts.
  - Right: helper bot card, skill capability checklist panel, sticky footer navigation.
- Completion and add-more modals as overlays.

## UI Composition

- Capability checklists grouped by skills within active category.
- Bot guidance messages that adapt to interaction patterns.
- Completion modal with actions (`Add more skills`, `Share with friends`, `Done for now`).

## Data Dependencies

- `GET /api/public-candidate/:token`
- `GET /api/skills`
- `PUT /api/public-candidate/:token/skills` (autosave and explicit save transitions)

## Interactions

- Checkbox toggles update draft selections.
- Autosave triggers after idle delay with retries.
- Keyboard shortcuts: `Alt/Cmd + Left/Right` to move categories.
- LocalStorage remembers last active category per candidate/token.
- `Add more skills` appends additional categories to candidate selection set.

## Validation

- Payload structure validated server-side (`categoryId`, `skillId`, `level`, `capabilityId`).
- Add-more modal requires at least one newly selected category.

## States

- Empty assigned categories state with `Add skills now` action.
- Save failure toast with retry behavior.

## UX Notes

- Unsaved changes guard prevents accidental navigation loss.
- Bot messaging throttled with cooldown to avoid noisy updates.

## Acceptance Criteria

- Selection progress, counts, and completion stats update accurately.
- Autosave eventually persists selections under transient failures.
- Added categories become immediately available in step flow.
