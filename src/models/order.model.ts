import {User} from "@/models/user.model";

export interface Order {
    id?: number;
    user_id: User['_id'];
    total_in_cent: number;
    status: string | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    created_at: Date;
    updated_at: Date;
}