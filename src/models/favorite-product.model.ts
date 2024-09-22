import {User} from "@/models/user.model";
import {Product} from "@/models/product.model";

export interface FavoriteProduct {
    _id?: string;
    user_id?: User;
    products?: Array<Product>;
}