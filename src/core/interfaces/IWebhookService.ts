export interface IWebhookService {
    /**
     * Handles verify and routing of webhook events.
     * @param body Raw request body
     * @param signature Stripe signature header
     * @param onFulfillment Callback for successful payment
     */
    handleWebhook(
        body: string,
        signature: string,
        onFulfillment: (userId: string, session: any) => Promise<void>
    ): Promise<any>;
}
