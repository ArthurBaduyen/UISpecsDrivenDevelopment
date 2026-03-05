# Domain: Candidate Skill Selection

## Fields

- `candidateId` (required FK).
- `categoryLegacyId` / UI `categoryId`.
- `skillLegacyId` / UI `skillId`.
- `level` (string level label).
- `capabilityId` (stable capability key).
- `text?` (optional capability text fallback).

## Relationships

- Many selections per candidate, grouped by category.
- Referentially coupled to skill taxonomy IDs/capabilities.

## Validation Rules

- Unique composite in DB: `(candidateId, categoryLegacyId, skillLegacyId, capabilityId)`.
- Public payload schema requires non-empty `categoryId`, `skillId`, `level`, `capabilityId`.

## Display Rules

- Used to render:
  - Candidate profile skill track checkmarks.
  - Candidate dashboard funnel/progress.
  - Radar chart values (entry/mid/senior/senior-lead weighting).

## Permissions

- Candidate token flow can update own selection set through invite token endpoint.
- Admin/super-admin can update through profile editor.
