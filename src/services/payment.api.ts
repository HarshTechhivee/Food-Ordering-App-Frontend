import apiClient from "./api";

interface PaymentItem {
    menuItemId: number;
    quantity: number;
}

interface CreatePaymentIntentInput {
    items: PaymentItem[];
}

interface CreatePaymentIntentResponse {
    clientSecret: string;
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export const createPaymentIntent = async (data: CreatePaymentIntentInput): Promise<CreatePaymentIntentResponse> => {

    const response = await apiClient.post<ApiResponse<CreatePaymentIntentResponse>>("/payments/create-payment-intent", data);

    return response.data.data;
};