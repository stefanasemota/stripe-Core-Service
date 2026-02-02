"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookAdapter = void 0;
const StripeClient_1 = require("./StripeClient");
class StripeWebhookAdapter {
    constructor(config) {
        this.stripe = StripeClient_1.StripeClient.getInstance(config);
        this.webhookSecret = config.webhookSecret;
    }
    async handleWebhook(body, signature, onFulfillment) {
        const event = this.stripe.webhooks.constructEvent(body, signature, this.webhookSecret);
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.metadata?.userId;
            if (userId) {
                await onFulfillment(userId, session);
            }
        }
        return event;
    }
}
exports.StripeWebhookAdapter = StripeWebhookAdapter;
