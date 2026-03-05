# Page Spec: Admin Skills

## Route Paths

- `/admin/skills`

## Access Rules

- Auth required.
- Roles: `super_admin`, `admin`.

## Layout Structure

- `AdminShell`.
- `Toolbar`: search toggle + context-sensitive primary action.
- Hierarchical drilldown views:
  - Category list
  - Skills list for selected category
  - Capability entries for selected skill
- Breadcrumb header when drilled in.

## UI Composition

- `DataTable` for categories and skills.
- Inline row edit/delete actions.
- Capability tables grouped by level.
- Modals:
  - `AddSkillCategoryModal`
  - `AddSkillModal`
  - `AddCapabilityModal`

## Data Dependencies

- `GET /api/skills`
- `GET /api/skills/query?scope=categories...`
- `GET /api/skills/query?scope=skills&categoryId=...`
- `PUT /api/skills` (entire taxonomy state replace)

## Interactions

- Row click drills down to next hierarchy level.
- Create/edit/delete operations mutate in-memory state then persist full state.
- On persist failure, UI rolls back to previous state and toasts error.

## Filters/Search/Sort

- Search applies to active scope (category/skill/capability).
- Sort:
  - categories: name/skillsCount/updatedAt
  - skills: name/capabilityCount/updatedAt

## States

- Loading: skeleton on category root.
- Empty: scope-specific empty states.
- Error: global skills query error banner with retry.

## Important Copy

- Root CTA: `New Skills Category`
- Skills-level CTA: `Add New Skill`
- Capability-level CTA: `Add New Capability`

## Acceptance Criteria

- Taxonomy integrity is preserved after edits (no accidental level loss).
- Drilldown and breadcrumbs always reflect selected category/skill.
- Persist failures restore prior UI state reliably.
