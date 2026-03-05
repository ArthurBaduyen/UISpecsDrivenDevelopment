# Page Spec: Not Found

## Route Paths

- `*` fallback

## Access Rules

- Public.

## Layout Structure

- Centered error card with two navigation actions.

## UI Composition

- `404` label, heading, descriptive copy.
- Buttons: `Go back`, `Login`.

## Interactions

- `Go back` resolves to role default path when authenticated, otherwise `/login`.

## Acceptance Criteria

- Unknown routes always render this page.
- Authenticated users are routed back to valid role home via CTA.
