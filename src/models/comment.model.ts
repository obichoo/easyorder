import {User} from "@/models/user.model";

export interface Comment {
    _id?: string;
    sender_id?: User['_id'];
    recipient_id?: User['_id'];
    content?: string;
    rate?: number;
    created_at?: Date;
}