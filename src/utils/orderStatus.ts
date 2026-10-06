import type { OrderStatus } from "../types/order.types.js";

export const formatOrderStatus = (status: OrderStatus): string => {

    switch (status) {
        case "PENDING":
            return "Pending";

        case "APPROVED":
            return "Approved";

        case "OUT_FOR_DELIVERY":
            return "Out for Delivery";

        case "DELIVERED":
            return "Delivered";

        case "REJECTED":
            return "Rejected";

        default:
            return status;
    }
};