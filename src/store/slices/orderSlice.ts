import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";

import { createOrder, getOrderById, getOrders, } from "../../services/order.api";

import type { CreateOrderInput, Order, OrderSummary, CreateOrderResponse } from "../../types/order.types";

interface OrderState {
    orders: OrderSummary[];
    selectedOrder: Order | null;
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null,
};


export const placeOrder = createAsyncThunk<CreateOrderResponse, CreateOrderInput, { rejectValue: string }>("orders/placeOrder",

    async (data, { rejectWithValue }) => {

        try {

            return await createOrder(data);

        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || "Failed to place order");
        }
    }
);


export const fetchOrders = createAsyncThunk<OrderSummary[], void, { rejectValue: string }>("orders/fetchOrders",

    async (_, { rejectWithValue }) => {

        try {

            return await getOrders();

        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || "Failed to load orders");
        }
    }
);


export const fetchOrderById = createAsyncThunk<Order, number, { rejectValue: string }>("orders/fetchOrderById",

    async (orderId, { rejectWithValue }) => {

        try {

            return await getOrderById(orderId);

        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || "Failed to load order");
        }
    }
);


const orderSlice = createSlice({
    name: "orders",
    initialState,

    reducers: {

        clearOrderError: (state) => { state.error = null; },

        clearSelectedOrder: (state) => { state.selectedOrder = null; },
    },

    extraReducers: (builder) => {
        builder

            // PLACE ORDER
            .addCase(placeOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(placeOrder.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })

            .addCase(placeOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to place order";
            })

            // FETCH ORDERS
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })

            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to load orders";
            })

            // FETCH ORDER BY ID
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedOrder = null;
            })

            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedOrder = action.payload;
            })

            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to load order";
            });
    },
});

export const { clearOrderError, clearSelectedOrder, } = orderSlice.actions;

export default orderSlice.reducer;