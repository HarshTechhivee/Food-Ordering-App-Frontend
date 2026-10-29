
import apiClient from "./api";
import type { OrderReview } from "../types/order.types";
import type { MenuItemReviewResponse, ReviewInput } from "../types/review.types";

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export const getMenuItemReviews = async (menuItemId: number, page = 1, limit = 5,): Promise<MenuItemReviewResponse> => {

    const response = await apiClient.get<ApiResponse<MenuItemReviewResponse>>(`/reviews/menu/${menuItemId}`, {
        params: { page, limit, },
    });

    return response.data.data;
};

export const createOrderReview = async (orderId: number, data: ReviewInput,): Promise<OrderReview> => {

    const response = await apiClient.post<ApiResponse<OrderReview>>(`/reviews/orders/${orderId}`, data,);

    return response.data.data;
};

export const updateOrderReview = async (reviewId: number, data: Partial<ReviewInput>,): Promise<OrderReview> => {

    const response = await apiClient.patch<ApiResponse<OrderReview>>(`/reviews/${reviewId}`, data,);

    return response.data.data;
};

export const deleteOrderReview = async (reviewId: number,): Promise<void> => {

    await apiClient.delete(`/reviews/${reviewId}`);
};

