export type OrderStatus =
    | "PENDING"
    | "APPROVED"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "REJECTED"
    | "CANCELLED"

export type PaymentStatus =
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";

export interface CreateOrderItem {
    menuItemId: number;
    quantity: number;
}

export interface CreateOrderResponse {
    order: Order;
    clientSecret: string | null;
}

export interface CreateOrderInput {
    items: CreateOrderItem[];
}

export interface OrderSummary {
    id: number;
    status: OrderStatus;
    totalAmount: number | string;
    PaymentStatus: PaymentStatus;
    createdAt: string;
    updatedAt: string;
    itemCount: number;
}

export interface OrderItem {
    id: number;
    orderId: number;
    menuItemId: number;
    quantity: number;
    price: number | string;
    menuItem: {
        id: number;
        name: string;
        image: string | null;
    };
}

export interface Order {
    id: number;
    userId: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    rejectionReason: string | null;
    cancellationReason: string | null;
    totalAmount: number | string;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}

export interface AdminOrder {
    id: number;
    status: OrderStatus;
    totalAmount: number | string;
    rejectionReason: string | null;
    cancellationReason: string | null;
    createdAt: string;
    updatedAt: string;
    itemCount: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export interface rejectedOrder {
    id: number;
    stripePaymentIntentId: string | null;
    stripeRefundId: string | null;
    userId: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    rejectionReason: string | null;
    totalAmount: number | string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateOrderStatusInput {
    status:
    | "APPROVED"
    | "REJECTED"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED";
}