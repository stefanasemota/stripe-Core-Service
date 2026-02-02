"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const StripeProductAdapter_1 = require("./infrastructure/stripe/StripeProductAdapter");
const StripePaymentAdapter_1 = require("./infrastructure/stripe/StripePaymentAdapter");
const StripeWebhookAdapter_1 = require("./infrastructure/stripe/StripeWebhookAdapter");
/**
 * A portable, config-driven Stripe service layer.
 * Facade aggregating Product, Payment, and Webhook services.
 */
class StripeService {
    constructor(config) {
        this.products = new StripeProductAdapter_1.StripeProductAdapter(config);
        this.payments = new StripePaymentAdapter_1.StripePaymentAdapter(config);
        this.webhooks = new StripeWebhookAdapter_1.StripeWebhookAdapter(config);
    }
    /* --- Product Service --- */
    fetchActiveProducts() {
        return this.products.fetchActiveProducts();
    }
    /* --- Payment Service --- */
    createCheckoutSession(userId, priceId, successUrl, cancelUrl) {
        return this.payments.createCheckoutSession(userId, priceId, successUrl, cancelUrl);
    }
    createPortalSession(customerId, returnUrl) {
        return this.payments.createPortalSession(customerId, returnUrl);
    }
    /* --- Webhook Service --- */
    handleWebhook(body, signature, onFulfillment) {
        return this.webhooks.handleWebhook(body, signature, onFulfillment);
    }
}
exports.StripeService = StripeService;
