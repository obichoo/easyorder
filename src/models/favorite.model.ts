import {IProduct} from "@/models/product.model";

export interface IFavorite {
    id: number;
    user_id: number;
    product_id: number;
    product?: IProduct;
}