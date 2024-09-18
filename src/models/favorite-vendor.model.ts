import {User} from "@/models/user.model";

export interface FavoriteVendor {
    id?: number;
    user_id: User['id'];
    vendor: Array<User['id']>;
}