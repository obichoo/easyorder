import FavoriteProducts from "@/app/favorites/components/favorite-products";
import FavoriteVendors from "@/app/favorites/components/favorite-vendors";

const Favorites = () => {
    return (
        <div className="mb-16">
            <FavoriteProducts></FavoriteProducts>
            <FavoriteVendors></FavoriteVendors>
        </div>
    );
}

export default Favorites;