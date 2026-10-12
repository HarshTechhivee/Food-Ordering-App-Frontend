import axios, { type InternalAxiosRequestConfig, } from "axios";
import refreshClient from "./refreshClient";
import type { RefreshResponse } from "../types/auth.types";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const apiClient = axios.create({
    baseURL: process.env.API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
});

let onAuthFailure: (() => void) | null = null;

export function setAuthFailureHandler(handler: (() => void) | null) {
    onAuthFailure = handler;
}

let refreshPromise: Promise<string> | null = null;

/*
 * REQUEST INTERCEPTOR
 */

apiClient.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }
);

/*
 * RESPONSE INTERCEPTOR
 */

apiClient.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config as RetryableRequestConfig;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const requestUrl = originalRequest.url ?? "";

        const isAuthRequest =
            requestUrl.includes("/auth/login") || requestUrl.includes("/auth/register") ||
            requestUrl.includes("/auth/refresh") || requestUrl.includes("/auth/logout");

        /*
         * Only attempt refresh for:
         *
         * 401
         * non-auth request
         * request hasn't already been retried
         */

        if (error.response?.status !== 401 || originalRequest._retry || isAuthRequest) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {

            if (!refreshPromise) {

                refreshPromise = refreshClient.post<RefreshResponse>("/auth/refresh").then((response) => {

                    const newAccessToken = response.data.data.accessToken;

                    localStorage.setItem("accessToken", newAccessToken);

                    return newAccessToken;
                })
            }

            const newAccessToken = await refreshPromise;

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return apiClient(originalRequest);

        } catch (refreshError) {

            localStorage.removeItem("accessToken");

            onAuthFailure?.();

            return Promise.reject(refreshError);
        }
        finally {
            refreshPromise = null
        }
    }
);

export default apiClient;