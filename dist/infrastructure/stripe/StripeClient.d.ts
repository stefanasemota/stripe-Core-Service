import Stripe from 'stripe';
export interface StripeConfig {
    apiKey: string;
    appVersion: string;
    requiredStripeVersion: string;
}
export declare class StripeClient {
    private static instance;
    static getInstance(config: StripeConfig): Stripe;
    private static validateConfig;
}
