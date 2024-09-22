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
import Title from "@/app/components/title/page";
import {FavoriteVendor} from "@/models/favorite-vendor.model";

const RemoveFavoriteModal = ({ confirm }: { confirm: Function }) => {
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

const FavoriteItem = ({ product, remove }: { product: any, remove: Function }) => {
    const router = useRouter();

    const handleProductClick = (event: any) => {
        router.push(`/products/${product._id}`);
    };

    return (
        <div
            className="w-60 shadow-lg mx-auto rounded-2xl p-3 bg-white cursor-pointer hover:shadow-xl transition-transform hover:scale-105 duration-300"
            key={product._id}
            onClick={(e) => handleProductClick(e)}
        >
            <img className="rounded-xl h-36 w-full object-cover mb-2" src={product.pictures?.[0]?.url || 'https://via.placeholder.com/150'} alt={product.name} />
            <div className="flex justify-between items-center">
                <p className="text-center font-medium">{product.name}</p>
                <div>
                    <RemoveFavoriteModal confirm={() => remove(product)} />
                </div>
            </div>
        </div>
    );
};

const FavoriteProducts = () => {
    const [favorites, setFavorites] = useState<any>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        setUser(getUser());
    }, []);

    useEffect(() => {
        if (user && user._id) {
            FavoriteProductService.getAllFavorites().then(res => {
                const userFavorites = res.data.filter((favorite: FavoriteProduct) => (favorite.user_id as User)._id == user._id);
                setFavorites(userFavorites?.[0]);
            });
        }
    }, [user]);

    const handleRemove = async (favorite: FavoriteProduct) => {
        try {
            const updatedProducts: FavoriteProduct['_id'][] = (favorites as any)?.products?.filter((v: any) => v._id !== favorite._id).map((v: any) => v._id);

            await FavoriteProductService.updateFavorite(favorites?._id, updatedProducts);
            setFavorites({...favorites, products: (favorites as any)?.products?.filter((v: any) => v._id !== favorite._id)});
        } catch (error) {
            console.error("Erreur lors de la mise à jour du favori :", error);
        }
    };

    return (
        <div className="container mx-auto mt-12">
            <Title>Mes produits favoris</Title>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(favorites as any)?.products?.length > 0 ? (
                    (favorites as any)?.products?.map((favorite: any) => (
                        <FavoriteItem
                            key={favorite._id}
                            product={favorite}
                            remove={() => handleRemove(favorite)}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-lg ">Vous n'avez pas encore de produit favori</p>
                )}
            </div>
        </div>
    );
};

export default FavoriteProducts;
