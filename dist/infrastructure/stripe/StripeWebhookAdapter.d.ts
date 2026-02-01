import Stripe from 'stripe';
import { IWebhookService } from '../../core/interfaces/IWebhookService';
import { StripeConfig } from './StripeClient';
export declare class StripeWebhookAdapter implements IWebhookService {
    private stripe;
    private webhookSecret;
    constructor(config: StripeConfig & {
        webhookSecret: string;
    });
    handleWebhook(body: string, signature: string, onFulfillment: (userId: string, session: any) => Promise<void>): Promise<Stripe.Event>;
}
