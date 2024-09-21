'use client';

import { MdFavorite } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { useEffect, useState } from "react";
import { FavoriteVendor } from "@/models/favorite-vendor.model";
import FavoriteVendorService from "@/services/favorite-vendor.service";
import getUser from "@/utils/get-user";
import {User} from "@/models/user.model";
import Title from "@/app/components/title/page";

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
                <MdFavorite className="text-red-500 text-2xl hover:text-red-600 transition-colors" />
            </button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Retirer des favoris</ModalHeader>
                    <ModalBody>
                        <p>
                            Voulez-vous vraiment retirer cet artisan de vos favoris ?
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

const FavoriteItem = ({ favorite, vendor, remove }: { favorite: FavoriteVendor, vendor: any, remove: Function }) => {
    const router = useRouter();

    const handleVendorClick = (event: any) => {
        router.push(`/artisans/${vendor._id}`);
    };

    return (
        <div
            className="w-60 shadow-lg mx-auto rounded-2xl p-3 bg-white cursor-pointer hover:shadow-xl transition-transform hover:scale-105 duration-300"
            key={favorite._id}
            onClick={(e) => handleVendorClick(e)}
        >
            <img className="rounded-xl h-36 w-full object-cover mb-2" src={vendor?.company?.profile_pic} alt={vendor.name} />
            <div className="flex justify-between items-center">
                <p className="text-center font-medium">{vendor?.company?.denomination}</p>
                <div>
                    <RemoveFavoriteModal favorite={favorite} confirm={() => remove(vendor)} />
                </div>
            </div>
        </div>
    );
};

const FavoriteVendors = () => {
    const [favorites, setFavorites] = useState<FavoriteVendor[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        setUser(getUser());
    }, []);

    useEffect(() => {
        if (user && user._id) {
            FavoriteVendorService.getAllFavorites().then(res => {
                const userFavorites = res.data.filter((favorite: FavoriteVendor) => (favorite.user_id as User)._id === user._id);
                setFavorites(userFavorites);
            });
        }
    }, [user]);

    const handleRemove = async (vendor: any, favorite: FavoriteVendor) => {
        try {
            const updatedVendors = (favorite.vendor as User[]).filter(v => v._id !== vendor._id);
            const updatedFavorite = { ...favorite, vendor: updatedVendors };

            await FavoriteVendorService.updateFavorite(updatedFavorite as FavoriteVendor);
            setFavorites(favorites.filter(fav => fav._id !== favorite._id || updatedVendors.length > 0));
        } catch (error) {
            console.error("Erreur lors de la mise à jour du favori :", error);
        }
    };

    return (
        <div className="container mx-auto mt-12">
            <Title className="text-3xl font-semibold text-center mb-10">Mes artisans favoris</Title>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favorites.length > 0 ? (
                    favorites.map(favorite => (
                        (favorite.vendor as User[]).map(vendor => (
                            <FavoriteItem
                                key={vendor._id}
                                favorite={favorite}
                                vendor={vendor}
                                remove={() => handleRemove(vendor, favorite)}
                            />
                        ))
                    ))
                ) : (
                    <p className="col-span-full text-center text-lg text-gray-600">Vous n'avez pas encore d'artisan favori</p>
                )}
            </div>
        </div>
    );
};

export default FavoriteVendors;
