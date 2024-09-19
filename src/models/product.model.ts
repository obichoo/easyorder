import {User} from "@/models/user.model";

export interface Product {
    _id?: string;
    name?: string;
    description?: string;
    price_in_cent?: number;
    stock?: number;
    artisan_id?: User['_id'];
    created_at?: Date;
    updated_at?: Date;
}