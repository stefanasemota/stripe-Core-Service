import { IProductService } from '../../core/interfaces/IProductService';
import { Product } from '../../core/models/Product';
import { StripeConfig } from './StripeClient';
export declare class StripeProductAdapter implements IProductService {
    private stripe;
    constructor(config: StripeConfig);
    fetchActiveProducts(): Promise<Product[]>;
}
