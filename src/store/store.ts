import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import menuReducer from "./slices/menuSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import adminOrderReducer from "./slices/adminOrderSlice.js";
import adminMenuReducer from "./slices/adminMenuSlice.js";
import notificationReducer from "./slices/notificationSlice.js";
import adminDashboardReducer from "./slices/adminDashboardSlice.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        menu: menuReducer,
        cart: cartReducer,
        orders: orderReducer,
        adminOrders: adminOrderReducer,
        adminMenu: adminMenuReducer,
        notifications: notificationReducer,
        adminDashboard: adminDashboardReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

store.subscribe(() => {

    const cart = store.getState().cart;
    localStorage.setItem("cart", JSON.stringify(cart.items));

});