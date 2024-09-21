'use client';

import FavoriteProducts from "@/app/favorites/components/favorite-products";
import FavoriteVendors from "@/app/favorites/components/favorite-vendors";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

const Favorites = () => {
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') as string);
        if (!user) {
            router.push('/login');
        }
    })

    return (
        <div className="mb-16">
            <FavoriteProducts></FavoriteProducts>
            <FavoriteVendors></FavoriteVendors>
        </div>
    );
}

export default Favorites;