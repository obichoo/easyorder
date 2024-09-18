import AxiosInstance from "@/services/axios.service";
import {FavoriteVendor} from "@/models/favorite-vendor.model";

class FavoriteVendorService {
    // Get all favorites
    getAllFavorites() {
        return AxiosInstance.get("/favoriteVendor");
    }

    // Get favorite by ID
    getFavoriteById(favoriteId: FavoriteVendor['id']) {
        return AxiosInstance.get(`/favoriteVendor/${favoriteId}`);
    }

    // Create favorite
    createFavorite(favorite: FavoriteVendor) {
        return AxiosInstance.post("/favoriteVendor", favorite);
    }

    // Update favorite
    updateFavorite(favorite: FavoriteVendor) {
        return AxiosInstance.put(`/favoriteVendor/${favorite.id}`, favorite);
    }

    // Delete favorite
    deleteFavorite(favoriteId: FavoriteVendor['id']) {
        return AxiosInstance.delete(`/favoriteVendor/${favoriteId}`);
    }
}

export default new FavoriteVendorService();