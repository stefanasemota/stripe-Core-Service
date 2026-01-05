// src/__tests__/StripeIntegration.test.ts
import { StripeService } from '../StripeService';
import * as dotenv from 'dotenv';
import path from 'path';
// Import package.json to get the version dynamically
import packageJson from '../../package.json';

// 1. Load your secrets from the local .env.test file
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

describe('Stripe Live Integration Tests', () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  
  // Only run these tests if an API key is actually present in .env.test
  const itIfKey = apiKey ? it : it.skip;

  const config = {
    apiKey: apiKey || 'dummy_key',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'dummy_wh',
    // DYNAMIC VERSION: No more hardcoding
    appVersion: packageJson.version, 
    requiredStripeVersion: '2025-01-27.acacia'
  };

  const service = new StripeService(config);

  /**
   * TEST: API Connectivity
   * Verifies that the 'sk_test' key is valid and can reach Stripe servers.
   */
  itIfKey('should successfully connect to live Stripe servers', async () => {
    const result = await service.verifyConnection();
    
    expect(result.status).toBe('connected');
    expect(result.appVersion).toBe(packageJson.version);
    console.log(`✅ Live Connection Verified for Sabi Lib v${result.appVersion}`);
  });

  /**
   * TEST: Product Retrieval
   * Verifies that the library can fetch the active product catalog.
   */
  itIfKey('should fetch real products from the Stripe dashboard', async () => {
    const products = await service.fetchActiveProducts();
    
    expect(Array.isArray(products)).toBe(true);
    
    if (products.length > 0) {
      console.log(`✅ Found ${products.length} products in Stripe.`);
      expect(products[0]).toHaveProperty('priceId');
      expect(products[0].currency).toBe('usd');
    } else {
      console.log("⚠️ No active products found. Check if products are 'Active' in Dashboard.");
    }
  });

  /**
   * TEST: Specific Price ID Validation
   * Ensures that the TEST_PRICE_ID provided in .env.test actually exists in Stripe.
   * This prevents "Broken Buy Buttons" in your app.
   */
  itIfKey('should verify the presence of the specific TEST_PRICE_ID', async () => {
    const targetPriceId = process.env.TEST_PRICE_ID;
    expect(targetPriceId).toBeDefined();

    const products = await service.fetchActiveProducts();
    const foundProduct = products.find((p: any) => p.priceId === targetPriceId);

    if (foundProduct) {
      console.log(`✅ Success: Found target product "${foundProduct.name}" with Price ID: ${targetPriceId}`);
    }
    
    expect(foundProduct).toBeDefined();
  });

  /**
   * TEST: Checkout Session Creation
   * Verifies that we can generate a real Stripe Checkout URL.
   */
  itIfKey('should generate a valid Checkout Session URL', async () => {
    const targetPriceId = process.env.TEST_PRICE_ID!;
    const session = await service.createCheckoutSession(
        'test_user_id', 
        targetPriceId, 
        'http://localhost:9002/success', 
        'http://localhost:9002/cancel'
    );

    expect(session.url).toContain('checkout.stripe.com');
    console.log("✅ Checkout Session URL generated successfully.");
  });

  /**
   * TEST: Customer Portal Session
   * Verifies that we can generate a billing management URL.
   * NOTE: Requires a valid customer ID. We fetch a sample one for the test.
   */
  itIfKey('should generate a Customer Portal URL for a sample customer', async () => {
    // 1. Fetch a sample customer from your Stripe account to test the portal
    const customers = await (service as any).stripe.customers.list({ limit: 1 });
    
    if (customers.data.length > 0) {
        const customerId = customers.data[0].id;
        const portal = await service.createPortalSession(customerId, 'http://localhost:9002/profile');
        
        expect(portal.url).toContain('billing.stripe.com');
        console.log("✅ Customer Portal URL generated successfully.");
    } else {
        console.log("⏭️ Skipping Portal test: No customers found in Stripe account.");
    }
  });
});