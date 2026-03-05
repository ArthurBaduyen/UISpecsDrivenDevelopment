# Page Spec: Login

## Route Paths

- `/login`

## Access Rules

- Public.
- If already authenticated, user can still view page and sign out from inline chip.

## Layout Structure

- `AuthCenteredLayout` (full-screen centered card).
- `PageHeader`: logo, title `Sign in`, helper text.
- `AuthFormSection`: login form OR reset-password form depending on `resetToken` query param.

## UI Composition

- `FormInputField` for email/password.
- `Button` primary submit.
- Inline error text.
- Demo accounts info block.

## Data Dependencies

- `POST /api/auth/login`.
- `POST /api/auth/reset-password` (when `resetToken` exists).
- Session state from `AuthProvider`.

## Interactions

- Submit login: on success navigate to `from` route or `/admin/dashboard`.
- Submit reset: sets success message `Password reset complete. You can now sign in.`
- Inline sign-out button when session exists.

## Validation

- Backend handles invalid credentials and reset token validity.
- UI displays backend `message`.

## States

- Loading: none beyond submit lifecycle.
- Empty: n/a.
- Error: inline red error text under form.

## Important Copy

- Heading: `Sign in`
- Subtitle: `Use a super admin or admin demo account below.`
- Submit: `Sign in` / `Set new password`

## Acceptance Criteria

- Invalid login shows server message.
- Successful login redirects correctly.
- `resetToken` query switches to reset-password flow.
