import api from "./api.js";

export interface DashboardOrder {
    id: number;
    status: string;
    paymentStatus: string;
    totalAmount: number | string;
    createdAt: string;
    user: {
        name: string;
    };
}

export interface DashboardStats {
    totalOrders: number;
    pendingOrders: number;
    menuItems: number;

    totalOrderValue: number;

    revenue: number;
    refundedAmount: number;
    paidOrders: number;
    totalCustomers: number;

    orderStatus: {
        PENDING: number;
        APPROVED: number;
        OUT_FOR_DELIVERY: number;
        DELIVERED: number;
        REJECTED: number;
        CANCELLED: number;
    };

    recentOrders: DashboardOrder[];
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {

    const response = await api.get<{ success: boolean; data: DashboardStats; }>("/admin/dashboard");

    return response.data.data;
};