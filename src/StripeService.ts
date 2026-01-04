import Stripe from 'stripe';

export interface StripeServiceConfig {
  apiKey: string;
  webhookSecret: string;
  appVersion: string;
  requiredStripeVersion: string;
}

export class StripeService {
  private stripe: Stripe;
  private config: StripeServiceConfig;

  constructor(config: StripeServiceConfig) {
    this.config = config;
    // @ts-ignore - Dynamic versioning check
    this.stripe = new Stripe(config.apiKey, {
     // Cast it to the Stripe configuration type specifically
      apiVersion: config.requiredStripeVersion as Stripe.StripeConfig['apiVersion'],
    });
    this.validateBootstrap();
  }

  private validateBootstrap() {
    console.log(`[StripeService] v${this.config.appVersion} initialized.`);
    if (!this.config.apiKey.startsWith('sk_')) {
      throw new Error("Invalid Stripe Secret Key provided.");
    }
  }

  /**
   * HELPER: Fetch all active products with prices
   * Useful for dynamic Pricing Pages
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
      // Stripe prices are in cents, converting to USD
      price: (product.default_price as Stripe.Price).unit_amount! / 100,
      priceId: (product.default_price as Stripe.Price).id,
      currency: 'usd'
    }));
  }

  async createCheckoutSession(userId: string, priceId: string, successUrl: string, cancelUrl: string) {
    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      currency: 'usd',
      metadata: { userId },
      subscription_data: { metadata: { userId } }
    });
  }

  async handleWebhook(body: string, signature: string, onFulfillment: (userId: string, session: Stripe.Checkout.Session) => Promise<void>) {
    const event = this.stripe.webhooks.constructEvent(body, signature, this.config.webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (userId) {
        await onFulfillment(userId, session);
      }
    }
    return event;
  }

  async createPortalSession(customerId: string, returnUrl: string) {
    return await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }
  
  /**
 * SANITY CHECK: Verifies connection to Stripe.
 * Call this in your app's startup or admin dashboard to ensure keys are valid.
 */
async verifyConnection() {
  try {
    // This makes a lightweight request to Stripe to verify the API key
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