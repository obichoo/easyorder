import {User} from "@/models/user.model";

export interface FavoriteVendor {
    _id?: string;
    user_id?: User;
    vendor?: Array<User>;
}