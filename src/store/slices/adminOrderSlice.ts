import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";

import { getAdminOrders, rejectOrder, updateAdminOrderStatus, } from "../../services/adminOrder.api.js";

import type { AdminOrder, UpdateOrderStatusInput, } from "../../types/order.types.js";

interface AdminOrderState {
    orders: AdminOrder[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminOrderState = {
    orders: [],
    loading: false,
    error: null,
};

export const fetchAdminOrders = createAsyncThunk("adminOrders/fetchAdminOrders",

    async (_, { rejectWithValue }) => {

        try {

            return await getAdminOrders();

        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
        }
    }
);

export const updateAdminOrder = createAsyncThunk("adminOrders/updateAdminOrder",

    async ({ orderId, data, }: { orderId: number; data: UpdateOrderStatusInput; }, { rejectWithValue }) => {

        try {

            return await updateAdminOrderStatus(orderId, data);

        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || "Failed to update order");
        }
    }
);


export const rejectUserOrder = createAsyncThunk("adminOrders/rejectOrder",

    async ({ orderId, rejectionReason, }: { orderId: number; rejectionReason: string; }, { rejectWithValue }) => {

        try {

            return await rejectOrder(orderId, rejectionReason);

        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || "Failed to reject order");
        }
    }
);



const adminOrderSlice = createSlice({
    name: "adminOrders",

    initialState,

    reducers: {

        clearAdminOrderError: (state) => { state.error = null; },
    },

    extraReducers: (builder) => {
        builder

            // Fetch orders
            .addCase(fetchAdminOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchAdminOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update order
            .addCase(updateAdminOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAdminOrder.fulfilled, (state, action) => {
                state.loading = false;

                const updatedOrder = action.payload;

                const index = state.orders.findIndex((order) => order.id === updatedOrder.id);

                if (index !== -1) {
                    state.orders[index] = updatedOrder;
                }
            })
            .addCase(updateAdminOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearAdminOrderError } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;