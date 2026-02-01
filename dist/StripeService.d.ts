import { IProductService } from './core/interfaces/IProductService';
import { IPaymentService } from './core/interfaces/IPaymentService';
import { IWebhookService } from './core/interfaces/IWebhookService';
import { StripeConfig } from './infrastructure/stripe/StripeClient';
export { StripeConfig };
/**
 * A portable, config-driven Stripe service layer.
 * Facade aggregating Product, Payment, and Webhook services.
 */
export declare class StripeService implements IProductService, IPaymentService, IWebhookService {
    private products;
    private payments;
    private webhooks;
    constructor(config: StripeConfig & {
        webhookSecret: string;
    });
    fetchActiveProducts(): Promise<import("./core/models/Product").Product[]>;
    createCheckoutSession(userId: string, priceId: string, successUrl: string, cancelUrl: string): Promise<{
        url: string | null;
    }>;
    createPortalSession(customerId: string, returnUrl: string): Promise<{
        url: string;
    }>;
    handleWebhook(body: string, signature: string, onFulfillment: (userId: string, session: any) => Promise<void>): Promise<import("stripe").Stripe.Event>;
}
