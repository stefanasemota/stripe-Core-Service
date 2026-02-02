import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StripeService } from '../StripeService';
import { StripeProductAdapter } from '../infrastructure/stripe/StripeProductAdapter';
import { StripePaymentAdapter } from '../infrastructure/stripe/StripePaymentAdapter';
import { StripeWebhookAdapter } from '../infrastructure/stripe/StripeWebhookAdapter';

vi.mock('../infrastructure/stripe/StripeProductAdapter');
vi.mock('../infrastructure/stripe/StripePaymentAdapter');
vi.mock('../infrastructure/stripe/StripeWebhookAdapter');

describe('StripeService (Facade)', () => {
    let service: StripeService;
    const config = {
        apiKey: 'sk_test_123',
        webhookSecret: 'whsec_123',
        appVersion: '1.0.0',
        requiredStripeVersion: '2023-10-16'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        service = new StripeService(config);
    });

    it('should delegate fetchActiveProducts to StripeProductAdapter', async () => {
        const mockFetch = vi.fn().mockResolvedValue([]);
        // @ts-ignore
        StripeProductAdapter.mockImplementation(function () {
            return {
                fetchActiveProducts: mockFetch
            };
        });
        // Re-instantiate to pick up mock
        service = new StripeService(config);

        await service.fetchActiveProducts();
        expect(mockFetch).toHaveBeenCalled();
    });

    it('should delegate createCheckoutSession to StripePaymentAdapter', async () => {
        const mockCreate = vi.fn().mockResolvedValue({ url: 'http://test' });
        // @ts-ignore
        StripePaymentAdapter.mockImplementation(function () {
            return {
                createCheckoutSession: mockCreate,
                // Add dummy methods for other interface members to satisfy 'new' call if needed
                createPortalSession: vi.fn()
            }
        });
        service = new StripeService(config);

        await service.createCheckoutSession('u1', 'p1', 's', 'c');
        expect(mockCreate).toHaveBeenCalledWith('u1', 'p1', 's', 'c');
    });

    it('should delegate createPortalSession to StripePaymentAdapter', async () => {
        const mockCreate = vi.fn().mockResolvedValue({ url: 'http://portal' });
        // @ts-ignore
        StripePaymentAdapter.mockImplementation(function () {
            return {
                createPortalSession: mockCreate,
                createCheckoutSession: vi.fn()
            }
        });
        service = new StripeService(config);

        await service.createPortalSession('c1', 'r1');
        expect(mockCreate).toHaveBeenCalledWith('c1', 'r1');
    });

    it('should delegate handleWebhook to StripeWebhookAdapter', async () => {
        const mockHandle = vi.fn().mockResolvedValue({});
        // @ts-ignore
        StripeWebhookAdapter.mockImplementation(function () {
            return {
                handleWebhook: mockHandle
            }
        });
        service = new StripeService(config);

        const callback = vi.fn();
        await service.handleWebhook('body', 'sig', callback);
        expect(mockHandle).toHaveBeenCalledWith('body', 'sig', callback);
    });
});
