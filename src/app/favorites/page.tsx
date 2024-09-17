import FavoriteProducts from "@/app/favorites/components/favorite-products";
import FavoriteShopKeepers from "@/app/favorites/components/favorite-shopkeepers";

const Favorites = () => {
    return (
        <div className="mb-16">
            <h1 className={'text-center text-3xl my-8'}>Mes favoris</h1>
            <FavoriteProducts></FavoriteProducts>
            <FavoriteShopKeepers></FavoriteShopKeepers>
        </div>
    );
}

export default Favorites;