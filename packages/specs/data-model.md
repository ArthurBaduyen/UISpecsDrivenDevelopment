# Data Model

## Entities

### User

- `id`
- `email`
- `name`
- timestamps

### Organization

- `id`
- `name`
- `stripeCustomerId` (nullable)
- `stripeSubscriptionId` (nullable)
- `subscriptionStatus` (nullable)
- timestamps

### Membership

- `id`
- `userId`
- `organizationId`
- `role` (`OWNER` | `ADMIN` | `MEMBER`)
- timestamps
- unique on (`userId`, `organizationId`)

### Project

- `id`
- `organizationId`
- `name`
- `description` (nullable)
- timestamps
