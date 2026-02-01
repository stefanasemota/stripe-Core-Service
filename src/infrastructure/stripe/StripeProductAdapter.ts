import Stripe from 'stripe';
import { IProductService } from '../../core/interfaces/IProductService';
import { Product } from '../../core/models/Product';
import { StripeClient, StripeConfig } from './StripeClient';

export class StripeProductAdapter implements IProductService {
    private stripe: Stripe;

    constructor(config: StripeConfig) {
        this.stripe = StripeClient.getInstance(config);
    }

    async fetchActiveProducts(): Promise<Product[]> {
        const products = await this.stripe.products.list({
            active: true,
            expand: ['data.default_price'],
        });

        return products.data.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: (product.default_price as Stripe.Price)?.unit_amount! / 100,
            priceId: (product.default_price as Stripe.Price)?.id,
            currency: 'usd',
        }));
    }
}
