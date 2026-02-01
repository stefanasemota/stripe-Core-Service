import { Product } from '../models/Product';

export interface IProductService {
    fetchActiveProducts(): Promise<Product[]>;
}
