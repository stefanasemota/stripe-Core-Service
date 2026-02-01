"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeClient = void 0;
const stripe_1 = __importDefault(require("stripe"));
class StripeClient {
    static getInstance(config) {
        if (!this.instance) {
            this.validateConfig(config);
            // @ts-ignore - Dynamic versioning
            this.instance = new stripe_1.default(config.apiKey, {
                apiVersion: config.requiredStripeVersion,
            });
            console.log(`[StripeService] v${config.appVersion} initialized.`);
        }
        return this.instance;
    }
    static validateConfig(config) {
        if (!config.apiKey.startsWith('sk_')) {
            throw new Error("Invalid Stripe Secret Key provided. Ensure it starts with 'sk_'.");
        }
    }
}
exports.StripeClient = StripeClient;
