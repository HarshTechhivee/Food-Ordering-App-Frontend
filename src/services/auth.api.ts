import api from "./api";
import type { LoginInput, RegisterInput, User, } from "../types/auth.types";

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

interface LoginResponse {
    user: User;
    accessToken: string;
}

interface RegisterResponse {
    user: User;
}

export const registerUser = async (data: RegisterInput): Promise<RegisterResponse> => {

    const response = await api.post<ApiResponse<RegisterResponse>>("/auth/register", data);

    return response.data.data;
};

export const loginUser = async (data: LoginInput): Promise<LoginResponse> => {

    const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", data);

    return response.data.data;
};

// export const refreshAccessToken = async (): Promise<AuthResponse> => {

//     const response = await api.post<ApiResponse<AuthResponse>>("/auth/refresh");

//     return response.data.data;
// };

export const getCurrentUser = async (): Promise<User> => {

    const response = await api.get<ApiResponse<{ user: User }>>("/auth/me");

    return response.data.data.user;
};

export const logoutUser = async (): Promise<void> => {

    await api.post("/auth/logout");
};