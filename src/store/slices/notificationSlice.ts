import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Notification } from "../../types/notification.types.js";

interface NotificationState {
    notifications: Notification[];
}

const initialState: NotificationState = {
    notifications: [],
};

const notificationSlice = createSlice({
    name: "notifications",

    initialState,

    reducers: {

        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications.unshift(action.payload);
        },

        markAsRead: (state, action: PayloadAction<string>) => {

            const notification = state.notifications.find((item) => item.id === action.payload);

            if (notification) {
                notification.read = true;
            }
        },

        markAllAsRead: (state) => {

            state.notifications.forEach((notification) => { notification.read = true; });
        },

        removeNotification: (state, action: PayloadAction<string>) => {

            state.notifications = state.notifications.filter((item) => item.id !== action.payload);
        },

        clearNotifications: (state) => {
            
            state.notifications = [];
        },
    },
});

export const { addNotification, markAsRead, markAllAsRead, removeNotification, clearNotifications, } = notificationSlice.actions;

export default notificationSlice.reducer;