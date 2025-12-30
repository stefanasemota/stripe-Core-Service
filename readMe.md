Here is the full, professional README.md for your library. It includes everything we’ve built: the CLI workflow, the integration tests, the "G-Stars" price ID testing, and the Next.js implementation guide.

code
Markdown
download
content_copy
expand_less
# @naijaspeak/stripe-service (v1.0.3)

A strictly-typed, config-driven Stripe service layer designed for Next.js applications using Firebase. This library provides a verified bridge between your application logic and the Stripe API, featuring built-in health checks and integration testing.

## Features
- ✅ **Strict Type Safety**: Optimized for TypeScript and the latest Stripe SDK.
- ✅ **Sanity Checks**: `verifyConnection()` method to validate API keys on app startup.
- ✅ **Dynamic Product Fetching**: `fetchActiveProducts()` to retrieve live USD plans from your Dashboard.
- ✅ **Webhook Security**: Simplified signature validation with fulfillment callbacks.
- ✅ **Integration Tested**: Built-in test suite to verify connections and Price IDs.

## Minimum Requirements
- **Next.js**: ^14.0.0
- **Node.js**: ^20.0.0 (LTS)
- **Stripe SDK**: ^14.0.0

---

## Installation

Install directly from your GitHub repository:
```bash
npm install github:stefanasemota/stripe-Core-Service#v1.0.3
```
Local Development & Testing

To prevent sensitive keys from leaking, the library uses a local .env.test file (Git-ignored) for integration tests.

1. Setup Environment

Create a .env.test in the root of this project:

```
STRIPE_SECRET_KEY=sk_test_your_real_key
STRIPE_WEBHOOK_SECRET=whsec_your_cli_secret
TEST_PRICE_ID=price_your_target_product_id
```

2. Stripe CLI Workflow

To test webhooks and integration logic locally:

Install CLI: brew install stripe/stripe-cli/stripe

Login: stripe login

Listen: stripe listen --forward-to localhost:3000/api/webhook

Secret: Copy the whsec_ key provided by the terminal into your .env.test.

3. Run Tests

```
npm test
```

Note: The Integration suite automatically detects the environment and skips if no API key is present.

Library API Reference
Initialization

```
TypeScript
download
content_copy
expand_less
import { StripeService } from '@naijaspeak/stripe-service';

export const stripeService = new StripeService({
  apiKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  appVersion: '1.0.3',
  requiredStripeVersion: '2025-01-27.acacia'
});
```

Methods
Method  Returns Description
verifyConnection()  Promise<Object> Verifies if the API Key is valid and connection is live.
fetchActiveProducts() Promise<Array>  Retrieves all active USD products and prices.
createCheckoutSession() Promise<Session>  Generates a Stripe Checkout URL for subscriptions.
handleWebhook() Promise<Event>  Validates signature and triggers an onSuccess callback.
Implementation Example (Next.js)
1. The Startup Health Check

Ensure your payment engine is online when the app starts:

```
TypeScript

const health = await stripeService.verifyConnection();
if (health.status === 'connected') {
  console.log("✅ Payment System Online");
}
```

2. The Webhook Route (app/api/webhook/route.ts)

```
TypeScript
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  try {
    await stripeService.handleWebhook(body, signature, async (userId, session) => {
      // Logic to update Firebase / Grant User Access
      console.log(`Fulfilling order for User: ${userId}`);
    });
    return new Response('OK', { status: 200 });
  } catch (err) {
    return new Response('Webhook Error', { status: 400 });
  }
}
```
Deployment & Tagging

To release a new version of the library:

Update version in package.json.

```
Run npm run build.
Commit and push: git push origin master.

Tag: git tag -a v1.0.3 -m "description" && git push origin v1.0.3.
```


License

MIT