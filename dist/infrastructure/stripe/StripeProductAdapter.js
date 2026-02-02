"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeProductAdapter = void 0;
const StripeClient_1 = require("./StripeClient");
class StripeProductAdapter {
    constructor(config) {
        this.stripe = StripeClient_1.StripeClient.getInstance(config);
    }
    async fetchActiveProducts() {
        const products = await this.stripe.products.list({
            active: true,
            expand: ['data.default_price'],
        });
        return products.data.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.default_price?.unit_amount / 100,
            priceId: product.default_price?.id,
            currency: 'usd',
        }));
    }
}
exports.StripeProductAdapter = StripeProductAdapter;
