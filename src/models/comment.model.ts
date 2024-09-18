import {User} from "@/models/user.model";

export interface Comment {
    id?: number;
    sender_id: User['id'];
    recipient_id: User['id'];
    content: string;
    rating: number;
    created_at: Date;
}