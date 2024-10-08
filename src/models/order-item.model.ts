import {Order} from "@/models/order.model";
import {Product} from "@/models/product.model";

export interface OrderItem {
    _id?: string;
    order_id?: Order | Order['_id'];
    product_id?: Product | Product['_id'];
    price_in_cent?: number;
    quantity?: number;
}