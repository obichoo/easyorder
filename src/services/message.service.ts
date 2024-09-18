import {AxiosInstance} from "axios";
import {Message} from "@/models/message.model";

class MessageService {
    // Get all messages
    getAllMessages() {
        return AxiosInstance.get("/message");
    }

    // Get message by ID
    getMessageById(messageId: Message['id']) {
        return AxiosInstance.get(`/message/${messageId}`);
    }

    // Create message
    createMessage(message: Message) {
        return AxiosInstance.post("/message", message);
    }

    // Update message
    updateMessage(message: Message) {
        return AxiosInstance.put(`/message/${message.id}`, message);
    }

    // Delete message
    deleteMessage(messageId: Message['id']) {
        return AxiosInstance.delete(`/message/${messageId}`);
    }
}

export default new MessageService();