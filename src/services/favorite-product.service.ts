import AxiosInstance from "@/services/axios.service";
import {FavoriteProduct} from "@/models/favorite-product.model";
import {User} from "@/models/user.model";
import {Product} from "@/models/product.model";

class FavoriteProductService {
    // Get all favorites
    getAllFavorites() {
        return AxiosInstance.get("/favoriteProduct");
    }

    // Get favorite by ID
    getFavoriteById(favoriteId: FavoriteProduct['_id']) {
        return AxiosInstance.get(`/favoriteProduct/${favoriteId}`);
    }

    // Create favorite
    createFavorite(favorite: FavoriteProduct) {
        return AxiosInstance.post("/favoriteProduct", favorite);
    }

    // Update favorite
    updateFavorite(favoriteId: string, products: Product['_id'][]) {
        return AxiosInstance.put(`/favoriteProduct/${favoriteId}`, {products: products});
    }

    // Delete favorite
    deleteFavorite(favoriteId: FavoriteProduct['_id']) {
        return AxiosInstance.delete(`/favoriteProduct/${favoriteId}`);
    }
}

export default new FavoriteProductService();