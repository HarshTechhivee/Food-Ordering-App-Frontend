import { createSlice, type PayloadAction, } from "@reduxjs/toolkit";

import type { CartItem, CartState, } from "../../types/cart.types";

const loadCartFromStorage = (): CartItem[] => {

    try {

        const storedCart = localStorage.getItem("cart");

        if (!storedCart) {
            return [];
        }

        return JSON.parse(storedCart);

    } catch {
        return [];
    }
};

const initialState: CartState = {
    items: loadCartFromStorage(),
};


const cartSlice = createSlice({
    name: "cart",

    initialState,

    reducers: {

        addToCart: (state, action: PayloadAction<CartItem>) => {

            const newItem = action.payload;

            const existingItem = state.items.find((item) => item.menuItemId === newItem.menuItemId);

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                state.items.push(newItem);
            }
        },

        removeFromCart: (state, action: PayloadAction<number>) => {

            state.items = state.items.filter((item) => item.menuItemId !== action.payload);
        },

        increaseQuantity: (state, action: PayloadAction<number>) => {

            const item = state.items.find((item) => item.menuItemId === action.payload);

            if (item) {
                item.quantity += 1;
            }
        },

        decreaseQuantity: (state, action: PayloadAction<number>) => {

            const item = state.items.find((item) => item.menuItemId === action.payload);

            if (!item) {
                return;
            }

            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                state.items = state.items.filter((cartItem) => cartItem.menuItemId !== action.payload);
            }
        },

        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, } = cartSlice.actions;

export default cartSlice.reducer;