import AxiosInstance from "@/services/axios.service";
import {Payment} from "@/models/payment.model";

class PaymentService {
    // Get all payments
    getAllPayments() {
        return AxiosInstance.get("/payment");
    }

    // Get payment by ID
    getPaymentById(paymentId: Payment['id']) {
        return AxiosInstance.get(`/payment/${paymentId}`);
    }

    // Create payment
    createPayment(payment: Payment) {
        return AxiosInstance.post("/payment", payment);
    }

    // Update payment
    updatePayment(payment: Payment) {
        return AxiosInstance.put(`/payment/${payment.id}`, payment);
    }

    // Delete payment
    deletePayment(paymentId: Payment['id']) {
        return AxiosInstance.delete(`/payment/${paymentId}`);
    }
}

export default new PaymentService();