export type Role = "USER" | "RESTAURANT_ADMIN";

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    isVerified: boolean;
    createdAt: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

export interface RefreshResponse {
    success: boolean;
    data: {
        user: {
            id: number;
            name: string;
            email: string;
            role: "USER" | "RESTAURANT_ADMIN";
            isVerified: boolean;
            createdAt: string;
        };
        accessToken: string;
    };
}