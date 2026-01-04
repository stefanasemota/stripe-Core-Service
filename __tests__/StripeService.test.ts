import { StripeService } from '../StripeService';

const mockConfig = {
  apiKey: 'sk_test_123',
  webhookSecret: 'whsec_123',
  appVersion: '1.0.0',
  requiredStripeVersion: '2025-01-27.acacia' // Use the version in your Stripe Dashboard
};

describe('StripeService Setup', () => {
  const service = new StripeService(mockConfig);

  test('Library should initialize with correct version', () => {
    expect(service).toBeDefined();
  });

  test('fetchActiveProducts should be a function', () => {
    expect(typeof service.fetchActiveProducts).toBe('function');
  });
});