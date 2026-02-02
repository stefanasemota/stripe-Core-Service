import { IPaymentService } from '../../core/interfaces/IPaymentService';
import { StripeConfig } from './StripeClient';
export declare class StripePaymentAdapter implements IPaymentService {
    private stripe;
    constructor(config: StripeConfig);
    createCheckoutSession(userId: string, priceId: string, successUrl: string, cancelUrl: string): Promise<{
        url: string | null;
    }>;
    createPortalSession(customerId: string, returnUrl: string): Promise<{
        url: string;
    }>;
}
