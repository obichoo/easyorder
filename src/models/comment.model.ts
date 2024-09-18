import {User} from "@/models/user.model";

export interface Comment {
    id?: number;
    sender_id: User['_id'];
    recipient_id: User['_id'];
    content: string;
    rating: number;
    created_at: Date;
}