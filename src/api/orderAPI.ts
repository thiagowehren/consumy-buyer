import type { OrderResponse, OrdersResponse, CreateOrder } from "@/dtos/orderDTO";
import { request } from './HTTPClient';

export async function getAllStoreOrders(storeId: string, page: number = 1): Promise<OrdersResponse> {
    const response = await request<OrdersResponse>(`/stores/${storeId}/orders`, {
        method: "GET",
        params: { page }
    });
    if (!response) {
        throw new Error("Failed to fetch orders.");
    }
    return response;
}

export async function getOrder(orderId: string): Promise<OrderResponse> {
    const response = await request<OrderResponse>(`/orders/${orderId}`, {
        method: "GET"
    })
    if (!response) {
        throw new Error("Failed to fetch order details.");
    }
    return response;
}

export async function getAllUserOrders(): Promise<OrdersResponse> {
    const response = await request<OrdersResponse>(`buyers/orders/`, {
        method: "GET"
    })
    if (!response) {
        throw new Error("Failed to fetch orders.");
    }
    return response;
}

export async function createOrder(orderData: CreateOrder): Promise<OrderResponse> {
    const response = await request<OrderResponse>(`/buyers/orders`, {
        method: "POST",
        body: { ...orderData }
    });
    if (!response) {
        throw new Error("Failed to create order.");
    }
    return response;
}

export async function updateOrderState(id: string, state: string): Promise<OrderResponse> {
    const stateURLs: { [key: string]: string } = {
        "accept": `/orders/${id}/accept`,
        "dispatch": `/orders/${id}/dispatch_order`,
        "complete": `/orders/${id}/complete`,
        "cancel": `/orders/${id}/cancel`
    };

    const url = stateURLs[state];

    if (!url) {
        throw new Error(`Invalid order state: ${state}`);
    }

    const response = await request<OrderResponse>(url, {
        method: "PUT"
    });

    if (!response) {
        throw new Error("Failed to change Order State.");
    }
    return response;
}