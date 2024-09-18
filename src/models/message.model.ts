import {User} from "@/models/user.model";

export interface Message {
    id?: number;
    sender_id: User['id'];
    recipient_id: User['id'];
    content: string;
    created_at: Date;
}