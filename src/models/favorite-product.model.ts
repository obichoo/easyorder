import {User} from "@/models/user.model";
import {Product} from "@/models/product.model";

export interface FavoriteProduct {
    id?: number;
    user_id: User['id'];
    products: Array<Product['id']>;
}