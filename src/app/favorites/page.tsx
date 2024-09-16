'use client';
import {IFavorite} from "@/models/favorite.model";
import fakeFavorites from "@/app/favorites/fake-favorites";
import { MdFavorite } from "react-icons/md";

const FavoriteItem = ({favorite}: { favorite: IFavorite }) => {
    const handleFavoriteClick = (event) => {
        event.preventDefault()
        console.log('favorite clicked', favorite)
    }

    return (
        <div className={'w-60 h-60 shadow mx-auto rounded-2xl p-3 duration-100 hover:scale-105 bg-white'} key={favorite.id}>
            <img className={'rounded-xl'} src="https://picsum.photos/224/200" alt=""/>
            <div className={'flex justify-between mt-1'}>
                <p className={'text-center'}>{favorite.product?.name}</p>
                <div className={'cursor-pointer'} onClick={(e) => handleFavoriteClick(e)}>
                    <MdFavorite className={'text-red-500 text-2xl'} />
                </div>
            </div>
        </div>
    );
}

const Favorites = () => {
    const favorites = fakeFavorites

    return (
        <div>
            <h1 className={'text-center text-3xl my-16'}>Mes favoris</h1>
            <div className={'w-full grid grid-cols-5 gap-10'}>
                {favorites.map(favorite => (
                    <FavoriteItem key={favorite.id} favorite={favorite} />
                ))}
            </div>
        </div>
    );
}

export default Favorites;