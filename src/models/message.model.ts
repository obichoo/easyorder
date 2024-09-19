import {User} from "@/models/user.model";

export interface Message {
    _id?: string;
    sender_id?: User['_id'];
    recipient_id?: User['_id'];
    content?: string;
    created_at?: Date;
}