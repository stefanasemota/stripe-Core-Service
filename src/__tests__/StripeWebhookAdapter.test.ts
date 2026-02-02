import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StripeWebhookAdapter } from '../infrastructure/stripe/StripeWebhookAdapter';

const mockConstructEvent = vi.fn();

vi.mock('stripe', () => {
    return {
        default: vi.fn().mockImplementation(function () {
            return {
                webhooks: { constructEvent: mockConstructEvent }
            };
        })
    };
});

describe('StripeWebhookAdapter', () => {
    let adapter: StripeWebhookAdapter;
    const config = {
        apiKey: 'sk_test_123',
        appVersion: '1.0.0',
        requiredStripeVersion: '2023-10-16',
        webhookSecret: 'whsec_123'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // @ts-ignore
        adapter = new StripeWebhookAdapter(config);
    });

    it('should handle checkout.session.completed event', async () => {
        const mockEvent = {
            type: 'checkout.session.completed',
            data: { object: { metadata: { userId: 'user1' } } }
        };
        mockConstructEvent.mockReturnValue(mockEvent);
        const onFulfillment = vi.fn().mockResolvedValue(undefined);

        await adapter.handleWebhook('body', 'sig', onFulfillment);

        expect(mockConstructEvent).toHaveBeenCalledWith('body', 'sig', 'whsec_123');
        expect(onFulfillment).toHaveBeenCalledWith('user1', mockEvent.data.object);
    });

    it('should not call fulfillment if userId is missing', async () => {
        const mockEvent = {
            type: 'checkout.session.completed',
            data: { object: { metadata: {} } }
        };
        mockConstructEvent.mockReturnValue(mockEvent);
        const onFulfillment = vi.fn();

        await adapter.handleWebhook('body', 'sig', onFulfillment);

        expect(onFulfillment).not.toHaveBeenCalled();
    });

    it('should ignore unrelated events', async () => {
        const mockEvent = {
            type: 'payment_intent.succeeded',
            data: { object: {} }
        };
        mockConstructEvent.mockReturnValue(mockEvent);
        const onFulfillment = vi.fn();

        await adapter.handleWebhook('body', 'sig', onFulfillment);

        expect(onFulfillment).not.toHaveBeenCalled();
    });
});
