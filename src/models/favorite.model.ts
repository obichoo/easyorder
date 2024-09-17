import {IProduct} from "@/models/product.model";

export interface IFavoriteProduct {
    id: number;
    user_id: number;
    product_id: number;
    product?: IProduct;
}

export interface IFavoriteShopKeeper {
    id: number;
    user_id: number;
    user?: IShopkeeper;
}