🔐 @stefan/stripe-core-service (v1.0.7)

A strictly-typed, config-driven Stripe service layer designed for Next.js applications using Firebase. This library provides a verified bridge between your application logic and the Stripe API, featuring built-in health checks and automated integration testing.

✅ Features

Strict Type Safety: Optimized for TypeScript and the latest Stripe SDK.

Sanity Checks: verifyConnection() method to validate API keys on app startup.

Dynamic Product Fetching: fetchActiveProducts() retrieves live plans (CHF/USD/NGN) directly from your Dashboard.

Webhook Security: Robust signature validation with custom fulfillment callbacks.

Automated Testing: Pre-push hooks via Husky to ensure zero-broken deployments.

Global Ready: Multi-currency support (automatic detection from Stripe Price objects).

💻 Minimum Requirements

Next.js: ^14.0.0

Node.js: ^20.0.0 (LTS)

Stripe SDK: ^14.0.0

📦 Installation

Install directly from your private GitHub repository:

code
Bash
download
content_copy
expand_less
npm install github:stefanasemota/stripe-Core-Service#v1.0.7
🛠 Local Development & Testing

To prevent sensitive keys from leaking, the library uses a local .env.test file (Git-ignored) for live integration tests.

1. Setup Environment

Create a .env.test in the root of this project:

code
Text
download
content_copy
expand_less
STRIPE_SECRET_KEY=sk_test_your_real_key
STRIPE_WEBHOOK_SECRET=whsec_your_cli_secret
TEST_PRICE_ID=price_your_target_product_id
2. Stripe CLI Workflow

To test webhooks and integration logic locally:

Install CLI: brew install stripe/stripe-cli/stripe

Login: stripe login

Listen: stripe listen --forward-to localhost:9002/api/webhook

Secret: Copy the whsec_ key provided by the terminal into your .env.test.

3. Running Tests
code
Bash
download
content_copy
expand_less
npm test

Note: The Integration suite automatically detects the environment and skips if no API key is present.

📚 Library API Reference
Initialization
code
TypeScript
download
content_copy
expand_less
import { StripeService } from '@stefan/stripe-core-service';

export const stripeService = new StripeService({
  apiKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  appVersion: '1.0.7',
  requiredStripeVersion: '2025-01-27.acacia'
});
Methods
Method	Returns	Description
verifyConnection()	Promise<Object>	Verifies if the API Key is valid and connection is live.
fetchActiveProducts()	Promise<Array>	Retrieves all active products and prices from the Dashboard.
createCheckoutSession()	Promise<Session>	Generates a Stripe Checkout URL for subscriptions.
createPortalSession()	Promise<Session>	Generates a link to the Customer Billing Portal.
handleWebhook()	Promise<Event>	Validates signatures and triggers an onSuccess callback.
🚀 Implementation Example (Next.js)
1. The Startup Health Check

Ensure your payment engine is online when the app starts (e.g., in layout.tsx):

code
TypeScript
download
content_copy
expand_less
const health = await stripeService.verifyConnection();
if (health.status === 'connected') {
  console.log(`✅ Payment System Online: v${health.appVersion}`);
}
2. The Webhook Route (app/api/webhook/route.ts)
code
TypeScript
download
content_copy
expand_less
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
🔄 Deployment & Automation
One-Command Release

The library is configured with an automated release script. To test, build, version, and push:

code
Bash
download
content_copy
expand_less
npm run release
Manual Tagging

If preferred, you can manually tag a release:

Update version in package.json.

npm run build

git add . && git commit -m "feat: release description"

git tag -a v1.0.7 -m "Release description" && git push origin master --tags

📄 License

MIT — Build for the culture. Sabi for the world. 🇳🇬🔥