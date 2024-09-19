import {User} from "@/models/user.model";
import {Product} from "@/models/product.model";

export interface FavoriteProduct {
    _id?: string;
    user_id?: User['_id'];
    products?: Array<Product['_id']>;
}