import AxiosInstance from "@/services/axios.service";
import {Order} from "@/models/order.model";

class OrderService {
    // Get all orders
    getAllOrders() {
        return AxiosInstance.get("/order");
    }

    // Get order by ID
    getOrderById(orderId: Order['_id']) {
        return AxiosInstance.get(`/order/${orderId}`);
    }

    // Create order
    createOrder(order: Order) {
        return AxiosInstance.post("/order", order);
    }

    // Update order
    updateOrder(order: Order) {
        return AxiosInstance.put(`/order/${order._id}`, order);
    }

    // Delete order
    deleteOrder(orderId: Order['_id']) {
        return AxiosInstance.delete(`/order/${orderId}`);
    }
}

export default new OrderService();