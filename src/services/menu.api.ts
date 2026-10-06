import apiClient from "./api";

import type { MenuQuery, MenuResponse, } from "../types/menu.types";

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export const getMenu = async (query: MenuQuery): Promise<MenuResponse> => {

    const response = await apiClient.get<ApiResponse<MenuResponse>>("/menu", { params: query, });

    return response.data.data;
};