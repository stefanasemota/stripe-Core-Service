export interface IPaymentService {
    createCheckoutSession(userId: string, priceId: string, successUrl: string, cancelUrl: string): Promise<{
        url: string | null;
    }>;
    createPortalSession(customerId: string, returnUrl: string): Promise<{
        url: string;
    }>;
}
