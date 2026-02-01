import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StripeClient } from '../infrastructure/stripe/StripeClient';

vi.mock('stripe', () => {
    return {
        default: vi.fn()
    };
});

describe('StripeClient', () => {
    beforeEach(() => {
        // Reset singleton instance if possible or just rely on state
        // Since it's a private static, we might need to rely on new mocks or clean env
        // But StripeClient.instance is private. 
        // We will just test the validation logic which runs first.
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should throw error if apiKey does not start with sk_', () => {
        const invalidConfig = {
            apiKey: 'pk_test_123',
            appVersion: '1.0.0',
            requiredStripeVersion: '2023-10-16'
        };

        expect(() => StripeClient.getInstance(invalidConfig)).toThrow("Invalid Stripe Secret Key provided. Ensure it starts with 'sk_'.");
    });

    it('should initialize successfully with valid key', () => {
        const validConfig = {
            apiKey: 'sk_test_123',
            appVersion: '1.0.0',
            requiredStripeVersion: '2023-10-16'
        };

        const instance = StripeClient.getInstance(validConfig);
        expect(instance).toBeDefined();
    });
});
