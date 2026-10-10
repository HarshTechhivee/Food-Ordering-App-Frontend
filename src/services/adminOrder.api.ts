import apiClient from "./api.js";
import type { AdminOrder, UpdateOrderStatusInput, } from "../types/order.types.js";

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export const getAdminOrders = async () => {

    const response = await apiClient.get<ApiResponse<AdminOrder[]>>("/admin/orders");

    return response.data.data;
};

export const updateAdminOrderStatus = async (orderId: number, data: UpdateOrderStatusInput) => {

    const response = await apiClient.patch<ApiResponse<AdminOrder>>(`/admin/orders/${orderId}/status`, data);

    return response.data.data;
};

export const rejectOrder = async (orderId: number, rejectionReason: string) => {

    const response = await apiClient.patch(`/admin/orders/${orderId}/reject`, { rejectionReason });

    return response.data.data;
};

