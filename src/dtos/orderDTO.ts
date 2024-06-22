import { Pagination } from './paginationDTO';
import { ProductResponse } from './productDTO'

export interface OrderResponse {
    id: number;
    state: string;
    total_price: string;
    created_at?: string;            // from: GET [orders/:id]
    updated_at?: string;            // from: GET [orders/:id]
    order_items?: OrderItems[];     // from: GET [orders/:id], POST [buyers/orders]
    possible_states: string[];
}

export interface OrderItems {
    amount: number;
    total_price: string;
    product: ProductResponse;
}

export interface OrdersResponse {
    pagination: Pagination;
    orders: OrderResponse[];
}

export interface CreateOrder {
    order: {
        store_id: number;
        order_items: {
            product_id: number;
            amount?: number;
        }[];
    };
}
