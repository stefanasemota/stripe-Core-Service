import Stripe from 'stripe';
import { IWebhookService } from '../../core/interfaces/IWebhookService';
import { StripeClient, StripeConfig } from './StripeClient';

export class StripeWebhookAdapter implements IWebhookService {
    private stripe: Stripe;
    private webhookSecret: string;

    constructor(config: StripeConfig & { webhookSecret: string }) {
        this.stripe = StripeClient.getInstance(config);
        this.webhookSecret = config.webhookSecret;
    }

    async handleWebhook(
        body: string,
        signature: string,
        onFulfillment: (userId: string, session: any) => Promise<void>
    ) {
        const event = this.stripe.webhooks.constructEvent(body, signature, this.webhookSecret);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;
            if (userId) {
                await onFulfillment(userId, session);
            }
        }
        return event;
    }
}
