import { StripeProductAdapter } from './infrastructure/stripe/StripeProductAdapter';
import { StripePaymentAdapter } from './infrastructure/stripe/StripePaymentAdapter';
import { StripeWebhookAdapter } from './infrastructure/stripe/StripeWebhookAdapter';
import { IProductService } from './core/interfaces/IProductService';
import { IPaymentService } from './core/interfaces/IPaymentService';
import { IWebhookService } from './core/interfaces/IWebhookService';
import { StripeConfig } from './infrastructure/stripe/StripeClient';

export { StripeConfig }; // Export for consumers

/**
 * A portable, config-driven Stripe service layer.
 * Facade aggregating Product, Payment, and Webhook services.
 */
export class StripeService implements IProductService, IPaymentService, IWebhookService {
  private products: StripeProductAdapter;
  private payments: StripePaymentAdapter;
  private webhooks: StripeWebhookAdapter;

  constructor(config: StripeConfig & { webhookSecret: string }) {
    this.products = new StripeProductAdapter(config);
    this.payments = new StripePaymentAdapter(config);
    this.webhooks = new StripeWebhookAdapter(config);
  }

  /* --- Product Service --- */
  fetchActiveProducts() {
    return this.products.fetchActiveProducts();
  }

  /* --- Payment Service --- */
  createCheckoutSession(userId: string, priceId: string, successUrl: string, cancelUrl: string) {
    return this.payments.createCheckoutSession(userId, priceId, successUrl, cancelUrl);
  }

  createPortalSession(customerId: string, returnUrl: string) {
    return this.payments.createPortalSession(customerId, returnUrl);
  }

  /* --- Webhook Service --- */
  handleWebhook(body: string, signature: string, onFulfillment: (userId: string, session: any) => Promise<void>) {
    return this.webhooks.handleWebhook(body, signature, onFulfillment);
  }
}