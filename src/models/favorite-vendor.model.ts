import {User} from "@/models/user.model";

export interface FavoriteVendor {
    _id?: string;
    user_id: User['_id'];
    vendor: Array<User['_id']>;
}