import {User} from "@/models/user.model";

export interface Message {
    id?: number;
    sender_id: User['_id'];
    recipient_id: User['_id'];
    content: string;
    created_at: Date;
}