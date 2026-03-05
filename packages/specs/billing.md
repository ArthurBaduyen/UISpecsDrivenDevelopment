# Billing Model (Stripe)

## Plans

- Free
- Pro (monthly)
- Enterprise (negotiated)

## Subscription States

- `trialing`
- `active`
- `past_due`
- `canceled`
- `incomplete`

## Webhooks to Handle

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## Notes

- Stripe webhook endpoint exists as scaffold in API and is verification-pending.
- Signature verification and idempotency handling are required before production.
