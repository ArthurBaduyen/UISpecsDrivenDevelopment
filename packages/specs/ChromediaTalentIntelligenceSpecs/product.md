# Product Specification: Chromedia Talent Intelligence

## Product Overview

Chromedia Talent Intelligence is an admin-operated talent operations platform used to manage candidate profiles, skill taxonomy, profile sharing links, and QA test case assets. The product has two primary surfaces: (1) authenticated admin/super-admin backoffice pages (`/admin/*`) for CRUD and analytics, and (2) tokenized public candidate/client flows (`/candidate/:token/*`, `/shared/:shareToken`) that allow limited profile completion and profile viewing without standard login.

The app is operations-first: candidate records, skills, and shared links are strongly connected and tracked through audit logs. Authentication is cookie/session-based with CSRF protection, role-gated navigation, and stricter super-admin controls for audit logs and user management.

## User Roles / Personas

- `super_admin`: Full platform admin. Can access all admin routes, audit logs, and user management (create/update/delete users, reset/set passwords).
- `admin`: Operational recruiter/admin. Can manage candidates, skills, shared profiles, QA test cases/runs, and dashboard; cannot access audit logs or user management APIs.
- `candidate` (tokenized flow): Uses invite link to submit skill selections; no standard dashboard login.
- `client` (tokenized flow): Uses shared profile link to view candidate profile; no standard dashboard login.

## Major Modules / Features

- Authentication & session management (`/login`, `/api/auth/*`), including refresh tokens + CSRF.
- Admin shell/navigation + route-level role protection.
- Dashboard analytics (candidate lifecycle, completeness, sharing performance).
- Candidate management (list/query, add/edit/delete, profile editor, candidate invite links).
- Skills taxonomy management (categories, skills, capabilities with level groupings).
- Shared profile lifecycle (create, adjust/extend, revoke, history via audit logs).
- Audit logs (super-admin only).
- QA module (features, test cases, baseline generation, test runs/results, CSV export).
- Settings: UI preferences and super-admin user management.
- Public/tokenized flows for candidate skill submission and client shared profile viewing.

## Key Success Metrics (Inferable)

- Candidate submission progression (`invited`, `started`, `in-progress`, `completed`).
- Profile completeness score and completion rate.
- Shared profile usage (`accessCount`, `lastAccessedAt`, active/expired/revoked counts).
- QA execution health (run summary: pass/fail/blocked/not-run).
- Admin operational throughput (candidate/profile/skills changes tracked via audit logs).

## Out of Scope / Constraints (Detected)

- No self-service registration.
- Candidate/client accounts are blocked from dashboard login; they use tokenized links only.
- Account page is placeholder (`Coming soon`).
- UI uses a custom React/Vite stack (not Next.js) in source app; migration target can differ but must preserve UX/behavior.
- Some localStorage legacy migration helpers exist but are effectively API-driven in current behavior.
