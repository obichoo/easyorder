import {User} from "@/models/user.model";
import {Address} from "@/models/address.model";
import {OrderItem} from "@/models/order-item.model";

export interface Order {
    _id?: string;
    user_id?: User | User['_id'];
    total_in_cent?: number;
    status?: string | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    created_at?: Date;
    updated_at?: Date;
    delivery_address?: Address;
    items?: OrderItem[] | OrderItem['_id'][];
}