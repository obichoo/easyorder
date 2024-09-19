import {Order} from "@/models/order.model";

export interface Payment {
    _id?: string;
    order_id: Order['_id'];
    amount_in_cent: number;
    status: string | 'pending' | 'completed' | 'failed';
    payment_method: string | 'credit card' | 'paypal' | 'bank transfer' | 'cash';
    created_at: Date;
}