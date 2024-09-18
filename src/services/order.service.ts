import AxiosInstance from "@/services/axios.service";
import {Order} from "@/models/order.model";

class OrderService {
    // Get all orders
    getAllOrders() {
        return AxiosInstance.get("/order");
    }

    // Get order by ID
    getOrderById(orderId: Order['id']) {
        return AxiosInstance.get(`/order/${orderId}`);
    }

    // Create order
    createOrder(order: Order) {
        return AxiosInstance.post("/order", order);
    }

    // Update order
    updateOrder(order: Order) {
        return AxiosInstance.put(`/order/${order.id}`, order);
    }

    // Delete order
    deleteOrder(orderId: Order['id']) {
        return AxiosInstance.delete(`/order/${orderId}`);
    }
}

export default new OrderService();