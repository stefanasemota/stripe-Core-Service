// src/__tests__/StripeIntegration.test.ts
import { StripeService } from '../StripeService';
import * as dotenv from 'dotenv';
import path from 'path';

// 1. Load your secrets from the local .env.test file
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

describe('Stripe Live Integration Tests', () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  
  // Only run these tests if an API key is actually present
  const itIfKey = apiKey ? it : it.skip;

  const config = {
    apiKey: apiKey || 'dummy_key',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'dummy_wh',
    appVersion: '1.0.2',
    requiredStripeVersion: '2025-01-27.acacia' // Ensure this matches your dashboard
  };

  const service = new StripeService(config);

  itIfKey('should successfully connect to live Stripe servers', async () => {
    const result = await service.verifyConnection();
    
    // If this fails, your API Key in .env.test is likely wrong
    expect(result.status).toBe('connected');
    console.log("✅ Live Connection Verified:", result.apiVersion);
  });

  itIfKey('should fetch real products from the Stripe dashboard', async () => {
    const products = await service.fetchActiveProducts();
    
    expect(Array.isArray(products)).toBe(true);
    
    if (products.length > 0) {
      console.log(`✅ Found ${products.length} products in Stripe.`);
      expect(products[0]).toHaveProperty('priceId');
    } else {
      console.log("⚠️ No active products found in your Stripe Dashboard.");
    }
  });


itIfKey('should verify the presence of the specific TEST_PRICE_ID', async () => {
    const targetPriceId = process.env.TEST_PRICE_ID;
    expect(targetPriceId).toBeDefined();

    const products = await service.fetchActiveProducts();
    const foundProduct = products.find(p => p.priceId === targetPriceId);

    if (foundProduct) {
      console.log(`✅ Success: Found target product "${foundProduct.name}" with Price ID: ${targetPriceId}`);
    }
    
    expect(foundProduct).toBeDefined();
    expect(foundProduct?.priceId).toBe(targetPriceId);
  });
  
});