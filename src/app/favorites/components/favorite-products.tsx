'use client';

import { MdFavorite } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { useEffect, useState } from "react";
import { FavoriteProduct } from "@/models/favorite-product.model";
import FavoriteProductService from "@/services/favorite-product.service";
import getUser from "@/utils/get-user";
import {User} from "@/models/user.model";
import {Product} from "@/models/product.model";

const RemoveFavoriteModal = ({ confirm, favorite }: { confirm: Function, favorite: FavoriteProduct }) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const handleOpen = (event: any) => {
        event.stopPropagation();
        onOpen();
    };

    const handleClose = (event: any) => {
        event.stopPropagation();
        onClose();
    };

    const handleConfirm = (event: any) => {
        event.stopPropagation();
        confirm();
        onClose();
    };

    return (
        <>
            <button onClick={(e) => handleOpen(e)}>
                <MdFavorite className={'text-red-500 text-2xl hover:text-red-600 transition-colors'} />
            </button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Retirer des favoris</ModalHeader>
                    <ModalBody>
                        <p>
                            Voulez-vous vraiment retirer ce produit de vos favoris ?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <button className="bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300 transition" onClick={(e) => handleClose(e)}>
                            Annuler
                        </button>
                        <button className="bg-easyorder-green text-white py-2 px-4 rounded-md hover:bg-easyorder-black transition" onClick={(e) => handleConfirm(e)}>
                            Confirmer
                        </button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

const FavoriteItem = ({ favorite, product, remove }: { favorite: FavoriteProduct, product: any, remove: Function }) => {
    const router = useRouter();

    const handleProductClick = (event: any) => {
        router.push(`/products/${product._id}`);
    };

    return (
        <div
            className="w-60 shadow-lg mx-auto rounded-2xl p-3 bg-white cursor-pointer hover:shadow-xl transition-transform hover:scale-105 duration-300"
            key={favorite._id}
            onClick={(e) => handleProductClick(e)}
        >
            <img className="rounded-xl h-36 w-full object-cover mb-2" src={product.pictures?.[0]?.url || 'https://via.placeholder.com/150'} alt={product.name} />
            <div className="flex justify-between items-center">
                <p className="text-center font-medium">{product.name}</p>
                <div>
                    <RemoveFavoriteModal favorite={favorite} confirm={() => remove(product)} />
                </div>
            </div>
        </div>
    );
};

const FavoriteProducts = () => {
    const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        setUser(getUser());
    }, []);

    useEffect(() => {
        if (user && user._id) {
            FavoriteProductService.getAllFavorites().then(res => {
                const userFavorites = res.data.filter((favorite: FavoriteProduct) => (favorite.user_id as User)._id === user._id);
                setFavorites(userFavorites);
            });
        }
    }, [user]);

    const handleRemove = async (product: any, favorite: FavoriteProduct) => {
        try {
            const updatedProducts = (favorite.products as Product[]).filter(p => (p as Product)._id !== product._id);
            const updatedFavorite = { ...favorite, products: updatedProducts };

            await FavoriteProductService.updateFavorite(updatedFavorite as Product);
            setFavorites(favorites.filter(fav => fav._id !== favorite._id || updatedProducts.length > 0));
        } catch (error) {
            console.error("Erreur lors de la mise à jour du favori :", error);
        }
    };

    return (
        <div className="container mx-auto mt-12">
            <h2 className="text-3xl font-semibold text-center mb-10">Mes produits favoris</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favorites.length > 0 ? (
                    favorites.map(favorite => (
                        (favorite.products as Product[]).map(product => (
                            <FavoriteItem
                                key={product._id}
                                favorite={favorite}
                                product={product}
                                remove={() => handleRemove(product, favorite)}
                            />
                        ))
                    ))
                ) : (
                    <p className="col-span-full text-center text-lg text-gray-600">Vous n'avez pas encore de produits favoris</p>
                )}
            </div>
        </div>
    );
};

export default FavoriteProducts;
