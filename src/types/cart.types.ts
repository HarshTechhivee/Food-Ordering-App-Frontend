export interface CartItem {
    menuItemId: number;
    name: string;
    price: number;
    image: string | null;
    quantity: number;
}

export interface CartState {
    items: CartItem[];
}