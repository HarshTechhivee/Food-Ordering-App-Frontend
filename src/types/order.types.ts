export type OrderStatus =
    | "PENDING"
    | "APPROVED"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "REJECTED";

export interface CreateOrderItem {
    menuItemId: number;
    quantity: number;
}

export interface CreateOrderInput {
    items: CreateOrderItem[];
}

export interface OrderSummary {
    id: number;
    status: OrderStatus;
    totalAmount: number | string;
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
    totalAmount: number | string;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}

export interface AdminOrder {
  id: number;
  status: OrderStatus;
  totalAmount: number | string;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface UpdateOrderStatusInput {
  status:
    | "APPROVED"
    | "REJECTED"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED";
}