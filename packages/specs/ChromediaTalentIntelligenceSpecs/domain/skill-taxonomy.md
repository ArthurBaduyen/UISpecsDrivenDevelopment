# Domain: Skill Taxonomy

## Entities

- `SkillCategory`
  - `id`, `name`, `slug?`, `description?`, `displayOrder`, timestamps.
- `Skill`
  - `id`, `categoryId`, `name`, `code?`, `description?`, `capabilities` (JSON level groups), `displayOrder`, timestamps.

## Capability Shape

- Levels are normalized to:
  - `Entry Level`
  - `Mid Level`
  - `Senior Level`
  - `Senior Lead Level`
- Each level has `entries: string[]`.

## Relationships

- `SkillCategory` 1:many `Skill`.
- Candidate profile selections reference skill/category/capability identifiers.

## Validation Rules

- Category names must be non-empty and unique (case-insensitive).
- Skill names must be non-empty and unique within category.
- Capability entries must be non-empty and unique per level.
- Skill state update rejected on first validation error.

## Display Rules

- Category list table: category name (+ actions).
- Skill list table (within category): skill name (+ actions).
- Capability tables (within skill): one table per level, entries with edit/delete.

## Permissions

- Read (`/api/skills`, `/api/skills/query`): authenticated admin/super-admin.
- Write (`/api/skills` PUT): admin/super-admin.

## Lifecycle

- No explicit status; taxonomy versioning implied via `taxonomyVersion` + timestamps.
