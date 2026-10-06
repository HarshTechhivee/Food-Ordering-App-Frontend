import apiClient from "./api";

import type { CreateOrderInput, Order, OrderSummary, } from "../types/order.types";

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export const createOrder = async (data: CreateOrderInput): Promise<Order> => {

    const response = await apiClient.post<ApiResponse<Order>>("/orders", data);

    return response.data.data;
};

export const getOrders = async (): Promise<OrderSummary[]> => {

    const response = await apiClient.get<ApiResponse<OrderSummary[]>>("/orders");

    return response.data.data;
};

export const getOrderById = async (orderId: number): Promise<Order> => {

    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);

    return response.data.data;
};