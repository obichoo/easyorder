import {Order} from "@/models/order.model";
import {Product} from "@/models/product.model";

export interface OrderItem {
    id?: number;
    order_id: Order['id'];
    product_id: Product['id'];
    price_in_cent: number;
    quantity: number;
}