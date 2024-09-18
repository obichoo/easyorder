import AxiosInstance from "@/services/axios.service";
import {OrderItem} from "@/models/order-item.model";

class OrderItemService {
    // Get all order items
    getAllOrderItems() {
        return AxiosInstance.get("/order_item");
    }

    // Get order item by ID
    getOrderItemById(orderItemId: OrderItem['id']) {
        return AxiosInstance.get(`/order_item/${orderItemId}`);
    }

    // Create order item
    createOrderItem(orderItem: OrderItem) {
        return AxiosInstance.post("/order_item", orderItem);
    }

    // Update order item
    updateOrderItem(orderItem: OrderItem) {
        return AxiosInstance.put(`/order_item/${orderItem.id}`, orderItem);
    }

    // Delete order item
    deleteOrderItem(orderItemId: OrderItem['id']) {
        return AxiosInstance.delete(`/order_item/${orderItemId}`);
    }
}

export default new OrderItemService();