# @naijaspeak/stripe-service

A portable, strictly-typed Stripe integration layer designed for Next.js apps using Firebase. 

## Technical Specifications
- **Package Version**: 1.0.0
- **Min Next.js Version**: ^14.0.0
- **Min Node Version**: >=18.0.0
- **Stripe SDK**: ^14.0.0
- **Currency**: USD

## Installation & Setup

### 1. Bootstrap Configuration
Initialize the service in your app (e.g., `lib/stripe-init.ts`). This allows the library to be used across different apps (NaijaSpeak, AquaLog, etc.) with different credentials.

```typescript
import { StripeService } from '@naijaspeak/stripe-service';

export const stripeService = new StripeService({
  apiKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  appVersion: '1.0.0',
  requiredStripeVersion: '2025-01-27.acacia' // Matches your Dashboard
});