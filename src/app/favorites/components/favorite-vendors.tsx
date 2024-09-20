'use client';

import { MdFavorite } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { useEffect, useState } from "react";
import { FavoriteVendor } from "@/models/favorite-vendor.model";
import FavoriteVendorService from "@/services/favorite-vendor.service";
import getUser from "@/utils/get-user";

const RemoveFavoriteModal = ({ confirm, favorite }: { confirm: Function, favorite: FavoriteVendor }) => {
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

const FavoriteItem = ({ favorite, vendor, remove }: { favorite: FavoriteVendor, vendor: any, remove: Function }) => {
    const router = useRouter();

    const handleProductClick = (event: any) => {
        router.push(`/artisans/${vendor._id}`);
    };

    return (
        <div
            className={'w-60 h-60 shadow mx-auto rounded-2xl p-3 duration-100 bg-white cursor-pointer hover:scale-105'}
            key={favorite._id}
            onClick={(e) => handleProductClick(e)}
        >
            <img className={'rounded-xl '} src="https://picsum.photos/224/200" alt="" />
            <div className={'flex justify-between mt-1'}>
                <p className={'text-center'}>{vendor.name}</p>
                <div>
                    <RemoveFavoriteModal favorite={favorite} confirm={() => remove(vendor)} />
                </div>
            </div>
        </div>
    );
};

const FavoriteVendors = () => {
    const [favorites, setFavorites] = useState<FavoriteVendor[]>([]);
    const [user, setUser] = useState<any>();

    useEffect(() => {
        setUser(getUser());
    }, []);

    useEffect(() => {
        if (user && user._id) {
            FavoriteVendorService.getAllFavorites().then(res => {
                const userFavorites = res.data.filter((favorite: FavoriteVendor) => (favorite.user_id as FavoriteVendor)._id === user._id);
                setFavorites(userFavorites);
            });
        }
    }, [user]);

    const handleRemove = async (vendor: any, favorite: FavoriteVendor) => {
        try {
            // Créer une copie des vendeurs sans celui que l'on souhaite retirer
            const updatedVendors = (favorite.vendor as FavoriteVendor[]).filter(v => v._id !== vendor._id);

            // Mettre à jour le favori avec la liste des vendeurs mise à jour
            const updatedFavorite = { ...favorite, vendor: updatedVendors };

            await FavoriteVendorService.updateFavorite(updatedFavorite as FavoriteVendor);
            setFavorites(favorites.filter(fav => fav._id !== favorite._id || updatedVendors.length > 0)); // Met à jour l'état pour retirer le favori de la liste
        } catch (error) {
            console.error("Erreur lors de la mise à jour du favori :", error);
        }
    };

    return (
        <div>
            <h2 className={'text-2xl mt-16 mb-8'}>Mes artisans favoris</h2>
            <div className={'w-full grid grid-cols-4 gap-4'}>
                {favorites.length > 0 && favorites.map(favorite => (
                    (favorite.vendor as FavoriteVendor[]).map((vendor: any) => (
                        <FavoriteItem key={vendor._id} favorite={favorite} vendor={vendor} remove={(v: any) => handleRemove(v, favorite)} />
                    ))
                ))}
                {favorites.length === 0 && (
                    <p>Vous n'avez pas encore d'artisan favori</p>
                )}
            </div>
        </div>
    );
};

export default FavoriteVendors;
