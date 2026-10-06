export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number | string;
    image: string | null;
    category: string;
    isAvailable: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type MenuSort =
    | "price_asc"
    | "price_desc"
    | "newest";

export interface MenuQuery {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    sort: MenuSort;
}

export interface MenuPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface MenuResponse {
    items: MenuItem[];
    pagination: MenuPagination;
}