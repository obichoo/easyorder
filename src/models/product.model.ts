import {User} from "@/models/user.model";
import {Category} from "@/models/category.model";

export interface Product {
    _id?: string;
    name?: string;
    description?: string;
    price_in_cent?: number;
    stock?: number;
    artisan_id?: User['_id'];
    created_at?: Date;
    updated_at?: Date;
    categories?: Category[];
    size?: {
        sizeLabel?: string;
        dimensions?: {
            height?: { value?: number; unit?: string };
            width?: { value?: number; unit?: string };
            depth?: { value?: number; unit?: string };
        };
        weight?: {
            value: number;
            unit: string;
        };
    };
    pictures?: Array<{ url?:string; _id: string }>;
}