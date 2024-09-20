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
                <MdFavorite className={'text-red-500 text-2xl'} />
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
                        <button className="bg-easyorder-gray py-1 px-2 rounded" onClick={(e) => handleClose(e)}>
                            Annuler
                        </button>
                        <button className="bg-easyorder-green py-1 px-2 rounded" onClick={(e) => handleConfirm(e)}>
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
            className={'w-60 h-60 shadow mx-auto rounded-2xl p-3 duration-100 bg-white cursor-pointer hover:scale-105'}
            key={favorite._id}
            onClick={(e) => handleProductClick(e)}
        >
            <img className={'rounded-xl '} src="https://picsum.photos/224/200" alt="" />
            <div className={'flex justify-between mt-1'}>
                <p className={'text-center'}>{product.name}</p>
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
        <div>
            <h2 className={'text-2xl mt-16 mb-8'}>Mes produits favoris</h2>
            <div className={'w-full grid grid-cols-4 gap-4'}>
                {favorites.length > 0 && favorites.map(favorite => (
                    (favorite.products as Product[]).map(product => (
                        <FavoriteItem
                            key={product._id}
                            favorite={favorite}
                            product={product}
                            remove={() => handleRemove(product, favorite)}
                        />
                    ))
                ))}
                {favorites.length === 0 && (
                    <p>Vous n'avez pas encore de produits favoris</p>
                )}
            </div>
        </div>
    );
};

export default FavoriteProducts;
