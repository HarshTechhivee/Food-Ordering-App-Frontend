import apiClient from "./api";

import type { CreateOrderInput, Order, OrderSummary, CreateOrderResponse } from "../types/order.types";

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export const createOrder = async (data: CreateOrderInput): Promise<CreateOrderResponse> => {

    const response = await apiClient.post<ApiResponse<CreateOrderResponse>>("/orders", data);

    return response.data.data
};

export const getOrders = async (): Promise<OrderSummary[]> => {

    const response = await apiClient.get<ApiResponse<OrderSummary[]>>("/orders");

    return response.data.data;
};

export const getOrderById = async (orderId: number): Promise<Order> => {

    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);

    return response.data.data;
};

export const cancelOrder = async (orderId: number, cancellationReason: string) => {

    const response = await apiClient.patch(`/orders/${orderId}/cancel`, { cancellationReason });

    return response.data.data;
};
