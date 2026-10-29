import { createAsyncThunk, createSlice, type PayloadAction, } from "@reduxjs/toolkit";

import { getMenu } from "../../services/menu.api";

import type { MenuQuery, MenuRatingUpdate, MenuResponse, } from "../../types/menu.types";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

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

        } catch (error) {

            return rejectWithValue(getApiErrorMessage(error, 'Failed to load menu'))
        }
    }
);


const menuSlice = createSlice({
    name: "menu",

    initialState,

    reducers: {

        clearMenuError: (state) => { state.error = null; },

        updateMenuRatingSummaries: (state, action: PayloadAction<MenuRatingUpdate[]>,) => {

            if (!state.data) {
                return;
            }

            const updatesById = new Map<number, MenuRatingUpdate>();

            for (const update of action.payload) {
                updatesById.set(update.menuItemId, update);
            }

            for (const item of state.data.items) {
                const update = updatesById.get(item.id);

                if (update) {
                    item.averageRating = update.averageRating;
                    item.totalReviews = update.totalReviews;
                }
            }
        },
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

export const { clearMenuError, updateMenuRatingSummaries, } = menuSlice.actions;

export default menuSlice.reducer;