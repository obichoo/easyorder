export interface IProduct {
    id: number;
    name: string;
    description?: string;
    price?: number;
    stock?: number;
    user_id?: number;
    created_at?: string;
    updated_at?: string;
}