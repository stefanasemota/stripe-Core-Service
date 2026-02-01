import Stripe from 'stripe';
import { IPaymentService } from '../../core/interfaces/IPaymentService';
import { StripeClient, StripeConfig } from './StripeClient';

export class StripePaymentAdapter implements IPaymentService {
    private stripe: Stripe;

    constructor(config: StripeConfig) {
        this.stripe = StripeClient.getInstance(config);
    }

    async createCheckoutSession(userId: string, priceId: string, successUrl: string, cancelUrl: string) {
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

    async createPortalSession(customerId: string, returnUrl: string) {
        const session = await this.stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        });
        return { url: session.url };
    }
}
