import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StripePaymentAdapter } from '../infrastructure/stripe/StripePaymentAdapter';

const mockSessionsCreate = vi.fn();
const mockPortalCreate = vi.fn();

vi.mock('stripe', () => {
    return {
        default: vi.fn().mockImplementation(function () {
            return {
                checkout: { sessions: { create: mockSessionsCreate } },
                billingPortal: { sessions: { create: mockPortalCreate } }
            };
        })
    };
});

describe('StripePaymentAdapter', () => {
    let adapter: StripePaymentAdapter;
    const config = { apiKey: 'sk_test_123', appVersion: '1.0.0', requiredStripeVersion: '2023-10-16' };

    beforeEach(() => {
        vi.clearAllMocks();
        // @ts-ignore
        adapter = new StripePaymentAdapter(config);
    });

    it('should create checkout session', async () => {
        mockSessionsCreate.mockResolvedValue({ url: 'http://checkout.url' });
        const result = await adapter.createCheckoutSession('user1', 'price1', 'success', 'cancel');

        expect(mockSessionsCreate).toHaveBeenCalledWith(expect.objectContaining({
            metadata: { userId: 'user1' },
            success_url: 'success'
        }));
        expect(result).toEqual({ url: 'http://checkout.url' });
    });

    it('should create portal session', async () => {
        mockPortalCreate.mockResolvedValue({ url: 'http://portal.url' });
        const result = await adapter.createPortalSession('cus_1', 'return');

        expect(mockPortalCreate).toHaveBeenCalledWith({
            customer: 'cus_1',
            return_url: 'return'
        });
        expect(result).toEqual({ url: 'http://portal.url' });
    });
});
