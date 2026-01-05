import Stripe from 'stripe';
/**
 * Configuration interface for initializing the StripeService.
 */
export interface StripeServiceConfig {
    apiKey: string;
    webhookSecret: string;
    appVersion: string;
    requiredStripeVersion: string;
}
/**
 * A portable, config-driven Stripe service layer.
 * Designed to handle subscriptions, webhooks, and billing portals across the Sabi AI ecosystem.
 */
export declare class StripeService {
    private stripe;
    private config;
    /**
     * Initializes the Stripe SDK with strict versioning and performs a bootstrap validation.
     * @param config - The essential keys and version info for the specific app.
     */
    constructor(config: StripeServiceConfig);
    /**
     * Internal validation to ensure the API key is present and follows the correct format.
     * Throws an error if the key is invalid to prevent silent failures.
     */
    private validateBootstrap;
    /**
     * Dynamically retrieves all active products from the Stripe Dashboard.
     * Includes the default price and filters for USD currency.
     * Useful for building dynamic Pricing Pages without hardcoding IDs.
     * @returns A mapped list of products with human-readable prices.
     */
    fetchActiveProducts(): Promise<{
        id: string;
        name: string;
        description: string | null;
        price: number;
        priceId: string;
        currency: string;
    }[]>;
    /**
     * Creates a hosted Stripe Checkout Session for a subscription.
     * Passes the Application User ID into metadata to ensure successful fulfillment via Webhooks.
     * @param userId - The Firebase/Auth UID of the customer.
     * @param priceId - The Stripe Price ID for the selected plan (Gbedu or Kpatakpata).
     * @param successUrl - The URL to redirect to after successful payment.
     * @param cancelUrl - The URL to redirect to if the user cancels the process.
     * @returns The Stripe Checkout Session object containing the redirect URL.
     */
    createCheckoutSession(userId: string, priceId: string, successUrl: string, cancelUrl: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    /**
     * Securely processes incoming Webhook events from Stripe.
     * Verifies the signature to prevent fraudulent requests and triggers a custom fulfillment callback.
     * @param body - The raw request body string from Stripe.
     * @param signature - The 'stripe-signature' header value.
     * @param onFulfillment - An async callback function that handles the database update (e.g., upgrading a user in Firestore).
     * @returns The validated Stripe Event object.
     */
    handleWebhook(body: string, signature: string, onFulfillment: (userId: string, session: Stripe.Checkout.Session) => Promise<void>): Promise<Stripe.Event>;
    /**
     * Generates a link to the Stripe-hosted Customer Portal.
     * Allows users to manage their own subscriptions, update payment methods, and view invoices.
     * @param customerId - The unique Stripe Customer ID (e.g., 'cus_abc123').
     * @param returnUrl - The URL to return to after the user exits the portal.
     * @returns The Portal Session object containing the redirect URL.
     */
    createPortalSession(customerId: string, returnUrl: string): Promise<Stripe.Response<Stripe.BillingPortal.Session>>;
    /**
     * Connectivity check to verify the API key is active and authorized.
     * Should be called during application startup (layout check) or in admin diagnostics.
     * @returns Connection status and versioning metadata.
     */
    verifyConnection(): Promise<{
        status: string;
        apiVersion: string;
        appVersion: string;
        message?: undefined;
    } | {
        status: string;
        message: any;
        apiVersion?: undefined;
        appVersion?: undefined;
    }>;
}
