import Stripe from 'stripe';

export interface StripeConfig {
    apiKey: string;
    appVersion: string;
    requiredStripeVersion: string;
}

export class StripeClient {
    private static instance: Stripe;

    public static getInstance(config: StripeConfig): Stripe {
        if (!this.instance) {
            this.validateConfig(config);
            // @ts-ignore - Dynamic versioning
            this.instance = new Stripe(config.apiKey, {
                apiVersion: config.requiredStripeVersion as Stripe.StripeConfig['apiVersion'],
            });
            console.log(`[StripeService] v${config.appVersion} initialized.`);
        }
        return this.instance;
    }

    private static validateConfig(config: StripeConfig) {
        if (!config.apiKey.startsWith('sk_')) {
            throw new Error("Invalid Stripe Secret Key provided. Ensure it starts with 'sk_'.");
        }
    }
}
