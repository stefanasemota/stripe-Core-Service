import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StripeProductAdapter } from '../infrastructure/stripe/StripeProductAdapter';

const mockList = vi.fn();
vi.mock('stripe', () => {
    return {
        default: vi.fn().mockImplementation(function () {
            return {
                products: {
                    list: mockList
                }
            };
        })
    };
});

describe('StripeProductAdapter', () => {
    let adapter: StripeProductAdapter;
    const config = {
        apiKey: 'sk_test_123',
        appVersion: '1.0.0',
        requiredStripeVersion: '2023-10-16'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // @ts-ignore
        adapter = new StripeProductAdapter(config);
    });

    it('should fetch active products and map them correctly', async () => {
        const mockProducts = [
            {
                id: 'prod_1',
                name: 'Test Product',
                description: 'Test Description',
                default_price: {
                    id: 'price_1',
                    unit_amount: 1000
                }
            }
        ];
        mockList.mockResolvedValue({ data: mockProducts });

        const result = await adapter.fetchActiveProducts();

        expect(mockList).toHaveBeenCalledWith({
            active: true,
            expand: ['data.default_price']
        });
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            id: 'prod_1',
            name: 'Test Product',
            description: 'Test Description',
            price: 10,
            priceId: 'price_1',
            currency: 'usd'
        });
    });
});
