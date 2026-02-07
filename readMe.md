# 🔐 @stefanasemota/stripe-core-service

[![npm version](https://img.shields.io/npm/v/@stefanasemota/stripe-core-service.svg)](https://www.npmjs.com/package/@stefanasemota/stripe-core-service)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Vitest Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](#-local-development--testing)
[![Architecture: Onion](https://img.shields.io/badge/Architecture-Onion-orange.svg)](./DEVELOPMENT.md)

A strictly-typed, modular Stripe integration layer designed for Next.js applications. This library follows the **Onion Architecture** to decouple core business logic from the Stripe infrastructure, ensuring it remains portable and easy to maintain.

## ✅ Features

- **Onion Architecture**: Core domain logic is isolated from the Stripe SDK.
- **Strict Readability**: Enforced 75-line limit per file.
- **Battle-Tested**: 100% Test Coverage using **Vitest**.
- **Dynamic Pricing**: `fetchActiveProducts()` retrieves live plans directly from your Stripe Dashboard.
- **Webhook Security**: Robust signature validation with fulfillment callbacks.

## 📦 Installation

### Via NPM
```bash
npm install @stefanasemota/stripe-core-service
```

### Via GitHub (Development)
```bash
npm install github:stefanasemota/stripe-Core-Service#main
```

## 🚀 Quick Start

### 1. Initialization
```typescript
import { StripeService } from '@stefanasemota/stripe-core-service';

export const stripeService = new StripeService({
  apiKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  appVersion: '1.0.11',
  requiredStripeVersion: '2025-01-27.acacia' // Matches your Stripe Dashboard
});
```

### 2. Creating a Checkout Session
```typescript
const { url } = await stripeService.createCheckoutSession(
  userId,
  'price_123...', 
  'https://your-app.com/success',
  'https://your-app.com/cancel'
);

if (url) window.location.assign(url);
```

### 3. Handling Webhooks (Next.js Example)
```typescript
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  try {
    await stripeService.handleWebhook(body, signature, async (userId, session) => {
        // Logic to fulfill the order (e.g. update Firebase/DB)
        console.log(`Fulfilling order for User: ${userId}`);
    });
    return new Response('OK', { status: 200 });
  } catch (err) {
    return new Response('Webhook Error', { status: 400 });
  }
}
```

## 🛠 Local Development & Testing

We use **Vitest** for all unit testing.

1.  **Setup Environment**: Create a `.env.test` file.
2.  **Run Tests**: `npm test`
3.  **Check Coverage**: `npm run test:coverage`

## 💻 Architecture

The project is structured into three distinct layers:
1.  **Core**: Interfaces and Models (Pure TS).
2.  **Infrastructure**: Stripe-specific adapters.
3.  **Facade**: The `StripeService` entry point.

For more details, see [DEVELOPMENT.md](./DEVELOPMENT.md).

## 📄 License
ISC — Build for the culture. Sabi for the world.