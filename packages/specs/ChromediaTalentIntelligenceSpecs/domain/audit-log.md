# Domain: Audit Log

## Fields

- `id` (UUID).
- `action` (string).
- `entityType` (`candidate|skills|shared_profile|auth`).
- `entityId` (string).
- `actorRole` (`admin|candidate|client|system`).
- `actorEmail` (string).
- `beforeState` (JSON nullable), `afterState` (JSON nullable), `metadata` (JSON optional).
- `createdAt` (+ backend `updatedAt`, `deletedAt`).

## Relationships

- Optional relation to `User` as actor.

## Validation Rules

- Appended by server-side handlers; not user-editable from UI.

## Display Rules

- Audit logs page table columns: When, Actor, Action, Entity, Entity ID.
- Filterable by action/entity; searchable by action/entityId/actorEmail.

## Permissions

- Read list/query: `super_admin` only.
- Write: internal server actions only.

## Lifecycle

- Append-only operationally (soft-delete exists in DB model but not exposed in UI).
