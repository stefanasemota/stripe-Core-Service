# Stripe Core Rules
- **Idempotency First**: Every Stripe API call must include an `idempotencyKey`. Use the request hash or a unique transaction ID.
- **Webhook Integrity**: All webhook handlers MUST verify the Stripe signature before processing.
- **Onion Alignment**: The `StripeService` must be an infrastructure implementation of a generic `IPaymentGateway` interface defined in the Core.