# Domain: Candidate

## Fields

- `id` (string, required, unique; legacy-style slug in API payloads).
- `name` (string, required).
- `role` (string, required).
- `technologies` (string, required display label).
- `expectedSalary` (string label, required).
- `available` (string, required; displayed as availability text).
- `status` (`Active|Inactive|Pending`, required).
- `contact` (object, optional):
  - `phoneCountryCode` (`+63`), `phoneNumber`, `email`, `iMessage?`.
- `location` (object, optional): `address`, `city`, `region`, `zipCode`, `country`.
- `compensation` (object, optional): `expectedAmount`, `expectedRate`, `offeredAmount?`, `offeredRate?`, `currency=USD`.
- `employment` (object, optional): `contract`, `availability`.
- `profile` (object, optional): `about`, `experience`, `education[]`, `projects[]`, `skillSelections[]`, `videoTitle?`, `videoUrl?`, `coderbyteScore?`, `coderbyteLink?`.
- `schemaVersion`, `createdAt`, `updatedAt`.

## Relationships

- 1:many to `CandidateInviteLink`.
- 1:many to `SharedProfile` (via `candidateId` / legacy link).
- 1:many to `CandidateSkillSelection`.
- optional 1:1 to `CandidateAccount`.

## Validation Rules

- Required on create/edit: name, role, core contact/location/compensation fields in UI add/edit modal.
- Email format required when provided.
- PH phone validation: `9XXXXXXXXX` (10 digits after `+63`).
- Salary numeric > 0 for expected/offered.
- Project date range: end date must be >= start date.
- Profile modal sections reject empty critical fields for save in specific flows.

## Display Rules

- Candidate table columns: Name, Role, Technologies, Expected Salary, Available, Status.
- Profile header: name, role, location label, expected salary, availability text.
- Dashboard derives completeness and submission progress from `profile.skillSelections` and profile content.

## Permissions

- `super_admin`, `admin`: create/read/update/delete candidates.
- Tokenized candidate link: read candidate by token + update only `skillSelections` via `/public-candidate/:token/skills`.
- Client shared link: read candidate via shared token; no write.

## Lifecycle / Status

- Candidate status: `Active|Inactive|Pending`.
- Submission progress (derived): `invited|started|in-progress|completed` based on skill selection completion.
