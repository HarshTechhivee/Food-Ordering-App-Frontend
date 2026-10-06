import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";

import { getMenu } from "../../services/menu.api";

import type { MenuQuery, MenuResponse, } from "../../types/menu.types";

interface MenuState {
    data: MenuResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: MenuState = {
    data: null,
    loading: false,
    error: null,
};


export const fetchMenu = createAsyncThunk<MenuResponse, MenuQuery, { rejectValue: string }>("menu/fetchMenu",

    async (query, { rejectWithValue }) => {

        try {
            return await getMenu(query);

        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || "Failed to load menu");
        }
    }
);


const menuSlice = createSlice({
    name: "menu",

    initialState,

    reducers: {

        clearMenuError: (state) => { state.error = null; },
    },

    extraReducers: (builder) => {

        builder

            .addCase(fetchMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })

            .addCase(fetchMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to load menu";
            });
    },
});

export const { clearMenuError, } = menuSlice.actions;

export default menuSlice.reducer;