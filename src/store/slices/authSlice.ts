import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import type { LoginInput, RegisterInput, User, } from "../../types/auth.types";
import { getCurrentUser, loginUser, logoutUser, registerUser, } from "../../services/auth.api";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    initialized: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    initialized: false,
    loading: false,
    error: null,
};

export const login = createAsyncThunk("auth/login",

    async (data: LoginInput, { rejectWithValue }) => {

        try {

            const result = await loginUser(data)

            localStorage.setItem("accessToken", result.accessToken);

            return result;
            // return await loginUser(data);

        } catch (error) {

            return rejectWithValue(getApiErrorMessage(error, "Login failed"));
        }
    }
);

export const register = createAsyncThunk("auth/register",

    async (data: RegisterInput, { rejectWithValue }) => {

        try {

            const user = await registerUser(data)

            return user
            // return await registerUser(data);

        } catch (error) {

            return rejectWithValue(getApiErrorMessage(error, "Registration failed"));
        }
    }
);

// export const refresh = createAsyncThunk("auth/refresh",

//     async (_, { rejectWithValue }) => {
//         try {
//             return await refreshAccessToken();
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data?.message || "Session expired");
//         }
//     }
// );

export const fetchCurrentUser = createAsyncThunk("auth/me",

    async (_, { rejectWithValue }) => {

        try {

            const user = await getCurrentUser()

            return user;
            // return await getCurrentUser();

        } catch (error) {

            return rejectWithValue(getApiErrorMessage(error, "Unable to fetch user"));
        }
    }
);

export const logout = createAsyncThunk("auth/logout",

    async (_, { rejectWithValue }) => {

        try {

            await logoutUser();

            localStorage.removeItem('accessToken')

        } catch (error) {

            localStorage.removeItem("accessToken");

            return rejectWithValue(getApiErrorMessage(error, "Logout failed"));
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {

        clearAuthError: (state) => { state.error = null; },

        clearAuth: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },

    },

    extraReducers: (builder) => {

        builder

            // LOGIN
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user
                state.accessToken = action.payload.accessToken
                state.isAuthenticated = true;
            })

            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Login failed";
            })

            // REGISTER
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(register.fulfilled, (state) => {
                state.loading = false;
            })

            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Registration failed";
            })

            // REFRESH
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.initialized = true;
                state.error = null;
            })

            .addCase(fetchCurrentUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.initialized = true;
            })

            // // ME
            // .addCase(fetchCurrentUser.fulfilled, (state, action) => {
            //     state.user = action.payload;
            //     state.isAuthenticated = true;
            // })

            // LOGOUT
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })

            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
            })

            .addCase(logout.rejected, (state) => {
                // Even if the server request fails,
                // remove local authentication state.
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.loading = false;
            });
    },
});

export const { clearAuthError, clearAuth } = authSlice.actions;

export default authSlice.reducer;