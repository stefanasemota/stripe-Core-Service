# 🔐 @stefan/stripe-core-service (v1.0.7)

A strictly-typed, modular Stripe integration layer designed for Next.js applications using Firebase. This library follows the **Onion Architecture** to decouple core business logic from the Stripe infrastructure.

## ✅ Features

- **Onion Architecture**: Core domain logic is isolated from the Stripe SDK, ensuring better maintainability and testability.
- **Strict Availability**: 75-line limit per file enforced for readability.
- **High Quality**: >80% Test Coverage (Branch & Statement) using **Vitest**.
- **Sanity Checks**: `verifyConnection()` method validates API keys on startup.
- **Dynamic Product Fetching**: `fetchActiveProducts()` retrieves live plans directly from your Dashboard.
- **Webhook Security**: Robust signature validation with custom fulfillment callbacks.

## 💻 Architecture

The project is structured into layers:

1.  **Core (`src/core`)**: Interfaces and Models (e.g., `IPaymentService`, `Product`). pure TypeScript, no dependencies.
2.  **Infrastructure (`src/infrastructure`)**: Adapters implementing the core interfaces using the `stripe` SDK.
3.  **Facade (`StripeService.ts`)**: The entry point that ties everything together.

## 💻 Minimum Requirements

- **Next.js**: ^14.0.0
- **Node.js**: ^20.0.0 (LTS)
- **Stripe SDK**: ^14.0.0
- **Vitest**: (for testing)

## 📦 Installation

```bash
npm install github:stefanasemota/stripe-Core-Service#v1.0.7
```

## 🛠 Local Development & Testing

This project uses **Vitest** for unit testing.

### 1. Setup Environment
Create a `.env.test` file (Git-ignored):
```text
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
TEST_PRICE_ID=price_...
```

### 2. Running Tests
To run the full test suite (Standard):
```bash
npm test
```

To run with coverage reports:
```bash
npm run test:coverage
```
*Current Coverage: 100% Statement, 100% Branch*

## 📚 Library API Reference

### Initialization
```typescript
import { StripeService } from '@stefan/stripe-core-service';

export const stripeService = new StripeService({
  apiKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  appVersion: '1.0.7',
  requiredStripeVersion: '2025-01-27.acacia'
});
```

### Core Interfaces
Advanced users can use the interfaces directly for dependency injection:

```typescript
import { IProductService, IPaymentService } from '@stefan/stripe-core-service/core';
// Implement your own adapter or mock for testing
```

| Method | Returns | Description |
| :--- | :--- | :--- |
| `verifyConnection()` | `Promise<Object>` | Verifies connectivity. |
| `fetchActiveProducts()` | `Promise<Product[]>` | Fetches active products. |
| `createCheckoutSession(...)` | `Promise<{url: string}>` | Creates subscription checkout. |
| `handleWebhook(...)` | `Promise<Event>` | Validates and routes webhooks. |

## 🚀 Implementation Example (Next.js)

### Webhook Route
```typescript
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  try {
    await stripeService.handleWebhook(body, signature, async (userId, session) => {
      console.log(`Fulfilling order for User: ${userId}`);
    });
    return new Response('OK', { status: 200 });
  } catch (err) {
    return new Response('Webhook Error', { status: 400 });
  }
}
```

## 📄 License
MIT — Build for the culture. Sabi for the world.