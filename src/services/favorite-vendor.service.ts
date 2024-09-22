import AxiosInstance from "@/services/axios.service";
import {FavoriteVendor} from "@/models/favorite-vendor.model";
import {User} from "@/models/user.model";

class FavoriteVendorService {
    // Get all favorites
    getAllFavorites() {
        return AxiosInstance.get("/favoriteVendor");
    }

    // Get favorite by ID
    getFavoriteById(favoriteId: FavoriteVendor['_id']) {
        return AxiosInstance.get(`/favoriteVendor/${favoriteId}`);
    }

    // Create favorite
    createFavorite(favorite: FavoriteVendor) {
        return AxiosInstance.post("/favoriteVendor", favorite);
    }

    // Update favorite
    updateFavorite(favoriteId: string, vendors: User['_id'][]) {
        return AxiosInstance.put(`/favoriteVendor/${favoriteId}`, {vendor: vendors});
    }

    // Delete favorite
    deleteFavorite(favoriteId: FavoriteVendor['_id']) {
        return AxiosInstance.delete(`/favoriteVendor/${favoriteId}`);
    }
}

export default new FavoriteVendorService();