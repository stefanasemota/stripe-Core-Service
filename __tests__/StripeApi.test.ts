import { StripeService } from '../StripeService';
import Stripe from 'stripe';

describe('Stripe SDK Configuration Tests', () => {
  const mockConfig = {
    apiKey: 'sk_test_dummy_key_for_testing', // Standard Stripe test format
    webhookSecret: 'whsec_test',
    appVersion: '1.0.1',
    requiredStripeVersion: '2025-01-27.acacia' // Or your specific version
  };

  const service = new StripeService(mockConfig);

  test('Stripe client should be initialized with the correct strict version', () => {
   const stripeInstance = (service as any).stripe;

    // Use the official internal accessor for configuration fields
    // We cast to 'any' because these methods are not in the public .d.ts files
    const internalVersion = (stripeInstance as any).getApiField('version');

    expect(internalVersion).toBe(mockConfig.requiredStripeVersion);
  });

  test('Service should expose the fetchActiveProducts method', () => {
    expect(typeof service.fetchActiveProducts).toBe('function');
  });

  test('Service should expose the verifyConnection method', () => {
    expect(typeof service.verifyConnection).toBe('function');
  });
});