import {User} from "@/models/user.model";

export interface FavoriteVendor {
    id?: number;
    user_id: User['_id'];
    vendor: Array<User['_id']>;
}