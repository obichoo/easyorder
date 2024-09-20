import AxiosInstance from "@/services/axios.service";
import {Order} from "@/models/order.model";
import {OrderItem} from "@/models/order-item.model";
import {User} from "@/models/user.model";

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

    // Add item to order (create order if order_id is not provided)
    addItemToOrder(order: OrderItem & { user_id: User['_id'] }) {
        return AxiosInstance.post('/order/addItem', order);
    }

    // Validate order
    validateOrder(orderId: Order['_id']) {
        return AxiosInstance.post(`/order/${orderId}/validateOrder`);
    }
}

export default new OrderService();