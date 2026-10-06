import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getAdminMenu, createAdminMenuItem, updateAdminMenuItem, updateAdminMenuAvailability, deleteAdminMenuItem } from "../../services/adminMenu.api.js";

import type { MenuItem } from "../../types/menu.types.js";

interface AdminMenuState {
    items: MenuItem[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminMenuState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchAdminMenu = createAsyncThunk("adminMenu/fetchAdminMenu",

    async (_, { rejectWithValue }) => {
        try {

            return await getAdminMenu();

        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || "Failed to fetch menu items");
        }
    }
);

export const createAdminMenu = createAsyncThunk("adminMenu/createAdminMenu",

    async (formData: FormData, { rejectWithValue }) => {

        try {

            return await createAdminMenuItem(formData);

        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || "Failed to create menu item");
        }
    }
);

export const updateAdminMenu = createAsyncThunk("adminMenu/updateAdminMenu",

    async ({ id, formData, }: { id: number; formData: FormData; }, { rejectWithValue }) => {

        try {

            return await updateAdminMenuItem(id, formData);

        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || "Failed to update menu item");
        }
    }
);


export const updateAdminMenuAvailabilityThunk = createAsyncThunk("adminMenu/updateAvailability",

    async ({ id, isAvailable, }: { id: number; isAvailable: boolean; }, { rejectWithValue }) => {

        try {

            return await updateAdminMenuAvailability(id, isAvailable);

        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || "Failed to update availability");
        }
    }
);

export const deleteAdminMenu = createAsyncThunk("adminMenu/deleteAdminMenu",

    async (id: number, { rejectWithValue }) => {

        try {

            await deleteAdminMenuItem(id);

            return id;

        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || "Failed to delete menu item");
        }
    }
);

const adminMenuSlice = createSlice({
    name: "adminMenu",

    initialState,

    reducers: {

        clearAdminMenuError: (state) => { state.error = null; },
    },

    extraReducers: (builder) => {
        builder

            .addCase(fetchAdminMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAdminMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })

            .addCase(fetchAdminMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(createAdminMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createAdminMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
            })

            .addCase(createAdminMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateAdminMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateAdminMenu.fulfilled, (state, action) => {
                state.loading = false;

                const index = state.items.findIndex((item) => item.id === action.payload.id);

                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            
            .addCase(updateAdminMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateAdminMenuAvailabilityThunk.fulfilled, (state, action) => {

                const index = state.items.findIndex((item) => item.id === action.payload.id);

                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })

            .addCase(deleteAdminMenu.fulfilled, (state, action) => {

                const item = state.items.find((item) => item.id === action.payload);

                if (item) {
                    item.isActive = false;
                    item.isAvailable = false;
                }
            })
    },
});

export const { clearAdminMenuError } = adminMenuSlice.actions;

export default adminMenuSlice.reducer;