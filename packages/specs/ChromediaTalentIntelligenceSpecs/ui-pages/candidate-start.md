# Page Spec: Candidate Invite Start

## Route Paths

- `/candidate/:token/start`

## Access Rules

- Public tokenized route.
- Candidate loaded by invite token.

## Layout Structure

- Centered marketing-style card.
- Hero greeting + CTA.

## UI Composition

- Brand logo.
- Greeting headline `Hi, {candidate}!`.
- CTA button `Start adding skills`.

## Data Dependencies

- `GET /api/public-candidate/:token`

## Interactions

- CTA navigates to `/candidate/:token/skills`.

## States

- Candidate fallback name shown while loading (`Candidate`).
- No explicit error UI; token failures result in empty/fallback content.

## Acceptance Criteria

- Valid token resolves candidate name.
- CTA always targets same token’s skill form route.
