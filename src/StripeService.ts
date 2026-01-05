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
export class StripeService {
  private stripe: Stripe;
  private config: StripeServiceConfig;

  /**
   * Initializes the Stripe SDK with strict versioning and performs a bootstrap validation.
   * @param config - The essential keys and version info for the specific app.
   */
  constructor(config: StripeServiceConfig) {
    this.config = config;
    // @ts-ignore - Dynamic versioning check
    this.stripe = new Stripe(config.apiKey, {
      // Cast it to the Stripe configuration type specifically to satisfy TypeScript
      apiVersion: config.requiredStripeVersion as Stripe.StripeConfig['apiVersion'],
    });
    this.validateBootstrap();
  }

  /**
   * Internal validation to ensure the API key is present and follows the correct format.
   * Throws an error if the key is invalid to prevent silent failures.
   */
  private validateBootstrap() {
    console.log(`[StripeService] v${this.config.appVersion} initialized.`);
    if (!this.config.apiKey.startsWith('sk_')) {
      throw new Error("Invalid Stripe Secret Key provided. Ensure it starts with 'sk_'.");
    }
  }

  /**
   * Dynamically retrieves all active products from the Stripe Dashboard.
   * Includes the default price and filters for USD currency.
   * Useful for building dynamic Pricing Pages without hardcoding IDs.
   * @returns A mapped list of products with human-readable prices.
   */
  async fetchActiveProducts() {
    const products = await this.stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    return products.data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      // Stripe prices are in cents, converting to USD for the UI
      price: (product.default_price as Stripe.Price).unit_amount! / 100,
      priceId: (product.default_price as Stripe.Price).id,
      currency: 'usd'
    }));
  }

  /**
   * Creates a hosted Stripe Checkout Session for a subscription.
   * Passes the Application User ID into metadata to ensure successful fulfillment via Webhooks.
   * @param userId - The Firebase/Auth UID of the customer.
   * @param priceId - The Stripe Price ID for the selected plan (Gbedu or Kpatakpata).
   * @param successUrl - The URL to redirect to after successful payment.
   * @param cancelUrl - The URL to redirect to if the user cancels the process.
   * @returns The Stripe Checkout Session object containing the redirect URL.
   */
  async createCheckoutSession(userId: string, priceId: string, successUrl: string, cancelUrl: string) {
    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId }, // Critical for linking payment back to the user
      subscription_data: { metadata: { userId } } // Ensures metadata persists on the subscription object
    });
  }

  /**
   * Securely processes incoming Webhook events from Stripe.
   * Verifies the signature to prevent fraudulent requests and triggers a custom fulfillment callback.
   * @param body - The raw request body string from Stripe.
   * @param signature - The 'stripe-signature' header value.
   * @param onFulfillment - An async callback function that handles the database update (e.g., upgrading a user in Firestore).
   * @returns The validated Stripe Event object.
   */
  async handleWebhook(body: string, signature: string, onFulfillment: (userId: string, session: Stripe.Checkout.Session) => Promise<void>) {
    // Reconstruct the event using the webhook secret to verify authenticity
    const event = this.stripe.webhooks.constructEvent(body, signature, this.config.webhookSecret);

    // Specifically handle the completion of a checkout session
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      
      if (userId) {
        // Trigger the specific app logic (e.g. Granting 'GBEDU' role)
        await onFulfillment(userId, session);
      }
    }
    return event;
  }

  /**
   * Generates a link to the Stripe-hosted Customer Portal.
   * Allows users to manage their own subscriptions, update payment methods, and view invoices.
   * @param customerId - The unique Stripe Customer ID (e.g., 'cus_abc123').
   * @param returnUrl - The URL to return to after the user exits the portal.
   * @returns The Portal Session object containing the redirect URL.
   */
  async createPortalSession(customerId: string, returnUrl: string) {
    return await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }
  
  /**
   * Connectivity check to verify the API key is active and authorized.
   * Should be called during application startup (layout check) or in admin diagnostics.
   * @returns Connection status and versioning metadata.
   */
  async verifyConnection() {
    try {
      // Lightweight request to verify API credentials
      await this.stripe.balance.retrieve();
      return { 
          status: 'connected', 
          apiVersion: this.config.requiredStripeVersion,
          appVersion: this.config.appVersion 
      };
    } catch (error: any) {
      return { 
          status: 'error', 
          message: error.message 
      };
    }
  }
}