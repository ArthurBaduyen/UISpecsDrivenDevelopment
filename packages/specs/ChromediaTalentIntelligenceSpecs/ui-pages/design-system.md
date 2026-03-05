# Page Spec: Design System Reference

## Route Paths

- `/design`

## Access Rules

- Public route in current implementation.

## Layout Structure

- Top sticky header.
- Left sticky sidebar with searchable section index.
- Right scrollable documentation sections.

## UI Composition

- Token sections: colors, typography, spacing, radius, shadows.
- Component demo sections: button/input/card/table/layout + auto-discovered design meta docs.
- Copyable code snippets.

## Data Dependencies

- Local static token JSON and discovered metadata modules.

## Interactions

- Sidebar section scroll navigation with active-section highlighting.
- Group collapse/expand.
- Theme toggle.

## States

- Static documentation page; no async query states.

## Acceptance Criteria

- Sidebar search filters sections/components.
- Clicking nav item scrolls to section and updates active state.
