import { StoreResponse } from './storeDTO';
import { ProductResponse } from './productDTO';

export interface SearchResponse {
    stores: StoreResponse[];
    products: ProductResponse[];
}