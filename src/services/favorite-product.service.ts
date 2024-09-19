import AxiosInstance from "@/services/axios.service";
import {FavoriteProduct} from "@/models/favorite-product.model";

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
    updateFavorite(favorite: FavoriteProduct) {
        return AxiosInstance.put(`/favoriteProduct/${favorite._id}`, favorite);
    }

    // Delete favorite
    deleteFavorite(favoriteId: FavoriteProduct['_id']) {
        return AxiosInstance.delete(`/favoriteProduct/${favoriteId}`);
    }
}

export default new FavoriteProductService();