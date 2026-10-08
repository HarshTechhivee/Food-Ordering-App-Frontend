import apiClient from "./api.js";
import type { MenuItem, MenuQuery, MenuResponse } from "../types/menu.types.js";

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export const getAdminMenu = async (query: MenuQuery) => {

    const response = await apiClient.get<ApiResponse<MenuResponse>>(
        "/admin/menu",
        {
            params: query
        }
    );

    return response.data.data;
};

export const createAdminMenuItem = async (formData: FormData) => {

    const response = await apiClient.post<ApiResponse<MenuItem>>("/admin/menu", formData);

    return response.data.data;
};

export const updateAdminMenuItem = async (id: number, formData: FormData) => {

    const response = await apiClient.patch<ApiResponse<MenuItem>>(`/admin/menu/${id}`, formData);

    return response.data.data;
};

export const getAdminMenuItem = async (id: number) => {

    const response = await apiClient.get<ApiResponse<MenuItem>>(`/admin/menu/${id}`);

    return response.data.data;
};

export const updateAdminMenuAvailability = async (id: number, isAvailable: boolean) => {

    const response = await apiClient.patch<ApiResponse<MenuItem>>(`/admin/menu/${id}/availability`, { isAvailable, });

    return response.data.data;
};

export const deleteAdminMenuItem = async (id: number) => {

    const response = await apiClient.delete<ApiResponse<null>>(`/admin/menu/${id}`);

    return response.data;
};