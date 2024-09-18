import FavoriteProducts from "@/app/favorites/components/favorite-products";
import FavoriteVendors from "@/app/favorites/components/favorite-vendors";

const Favorites = () => {
    return (
        <div className="mb-16">
            <h1 className={'text-center text-3xl my-8'}>Mes favoris</h1>
            <FavoriteProducts></FavoriteProducts>
            <FavoriteVendors></FavoriteVendors>
        </div>
    );
}

export default Favorites;