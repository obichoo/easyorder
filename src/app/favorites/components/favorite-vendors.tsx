'use client';

import { MdFavorite } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import React, { useEffect, useState } from "react";
import { FavoriteVendor } from "@/models/favorite-vendor.model";
import FavoriteVendorService from "@/services/favorite-vendor.service";
import getUser from "@/utils/get-user";
import {User} from "@/models/user.model";
import Title from "@/app/components/title/page";
import {FaCheck, FaQuestion} from "react-icons/fa";
import {ImCross} from "react-icons/im";

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

const FavoriteItem = ({ vendor, remove }: { vendor: any, remove: Function }) => {
    const router = useRouter();

    const handleVendorClick = (event: any) => {
        router.push(`/artisans/${vendor._id}`);
    };

    return (
        <div
            className="w-60 shadow-lg mx-auto rounded-2xl p-3 bg-white cursor-pointer hover:shadow-xl transition-transform hover:scale-105 duration-300"
            key={vendor._id}
            onClick={(e) => handleVendorClick(e)}
        >
            <div className="relative mb-2 h-36 w-36 mx-auto">
                <img className="rounded-full object-cover" src={vendor?.company?.profile_pic} alt={vendor.name} />
                <div className="-translate-x-2 -translate-y-2">
                    {
                        vendor.company?.etat == 'validé' ? (
                            <span
                                className="bg-green-500 text-white rounded-full p-1 text-xs absolute right-0 bottom-0 tooltip">
                                                  <FaCheck/>
                                                  <span className="tooltiptext">Entreprise vérifiée</span>
                                              </span>
                        ) : vendor.company?.etat == 'en attente' ? (
                            <span
                                className="bg-gray-500 text-white rounded-full block p-1 text-xs absolute right-0 bottom-0 tooltip">
                                                  <FaQuestion/>
                                                  <span className="tooltiptext">Entreprise en attente de vérification</span>
                                              </span>
                        ) : (
                            <span
                                className="bg-red-500 text-white rounded-full p-1 text-xs absolute right-0 bottom-0 tooltip">
                                                  <ImCross/>
                                                  <span className="tooltiptext">Entreprise non vérifiée</span>
                                              </span>
                        )
                    }
                </div>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-center font-medium">{vendor?.company?.denomination}</p>
                <div>
                    <RemoveFavoriteModal confirm={() => remove(vendor)} />
                </div>
            </div>
        </div>
    );
};

const FavoriteVendors = () => {
    const [favorites, setFavorites] = useState<any>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        setUser(getUser());
    }, []);

    useEffect(() => {
        if (user && user._id) {
            FavoriteVendorService.getAllFavorites().then(res => {
                const userFavorites = res.data.filter((favorite: FavoriteVendor) => (favorite.user_id as User)._id === user._id);
                setFavorites(userFavorites?.[0]);
            });
        }
    }, [user]);

    const handleRemove = async (favorite: FavoriteVendor) => {
        try {
            const updatedVendors: FavoriteVendor['_id'][] = (favorites as any)?.vendor?.filter((v: any) => v._id !== favorite._id).map((v: any) => v._id);

            await FavoriteVendorService.updateFavorite(favorites._id, updatedVendors);
            setFavorites({...favorites, vendor: (favorites as any)?.vendor?.filter((v: any) => v._id !== favorite._id)});
        } catch (error) {
            console.error("Erreur lors de la mise à jour du favori :", error);
        }
    };

    return (
        <div className="container mx-auto mt-12">
            <Title className="text-3xl font-semibold text-center mb-10">Mes artisans favoris</Title>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(favorites as any)?.vendor?.length > 0 ? (
                    (favorites as any)?.vendor?.map((favorite: any) => (
                        <FavoriteItem
                            key={favorite._id}
                            vendor={favorite}
                            remove={() => handleRemove(favorite)}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-lg ">Vous n'avez pas encore d'artisan favori</p>
                )}
            </div>
        </div>
    );
};

export default FavoriteVendors;
