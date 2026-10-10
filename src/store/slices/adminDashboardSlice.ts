import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchDashboardStats, type DashboardStats, } from "../../services/adminDashboard.api.js";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage.js";

interface AdminDashboardState {
    stats: DashboardStats | null;
    loading: boolean;
    error: string | null;
}

const initialState: AdminDashboardState = {
    stats: null,
    loading: false,
    error: null,
};

export const fetchAdminDashboard = createAsyncThunk("adminDashboard/fetchDashboard",

    async (_, { rejectWithValue }) => {

        try {
            return await fetchDashboardStats();

        } catch (error) {

            return rejectWithValue(getApiErrorMessage(error, 'Failed to load dashboard'))
        }
    }
);

const adminDashboardSlice = createSlice({
    name: "adminDashboard",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

            .addCase(
                fetchAdminDashboard.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            }
            )

            .addCase(fetchAdminDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to load dashboard";
            }
            );
    },
});

export default adminDashboardSlice.reducer;