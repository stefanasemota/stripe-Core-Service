"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripePaymentAdapter = void 0;
const StripeClient_1 = require("./StripeClient");
class StripePaymentAdapter {
    constructor(config) {
        this.stripe = StripeClient_1.StripeClient.getInstance(config);
    }
    async createCheckoutSession(userId, priceId, successUrl, cancelUrl) {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: { userId },
            subscription_data: { metadata: { userId } },
        });
        return { url: session.url };
    }
    async createPortalSession(customerId, returnUrl) {
        const session = await this.stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        });
        return { url: session.url };
    }
}
exports.StripePaymentAdapter = StripePaymentAdapter;
