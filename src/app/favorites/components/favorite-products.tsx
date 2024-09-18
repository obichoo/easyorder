'use client';

import { MdFavorite } from "react-icons/md";
import {useRouter} from "next/navigation";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/modal";
import {useEffect, useState} from "react";
import {FavoriteProduct} from "@/models/favorite-product.model";
import FavoriteProductService from "@/services/favorite-product.service";

const RemoveFavoriteModal = ({confirm, favorite }: { confirm: Function, favorite: FavoriteProduct }) => {
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

    const handleOpen = (event: any) => {
        event.stopPropagation()
        onOpen()
    }

    const handleClose = (event: any) => {
        event.stopPropagation()
        onClose()
    }

    const handleConfirm = (event: any) => {
        event.stopPropagation()
        confirm()
        onClose()
    }

    return (
        <>
            <button onClick={(e) => handleOpen(e)}>
                <MdFavorite className={'text-red-500 text-2xl'} />
            </button>
            <Modal  isOpen={isOpen} onOpenChange={onOpenChange} >
                <ModalContent>
                    {(onClose) => (
                        <>
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
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

const FavoriteItem = ({favorite, remove}: { favorite: FavoriteProduct, remove: Function }) => {
    const router = useRouter()

    const handleRemoveFavorite = () => {
        remove()
    }

    const handleProductClick = (event: any) => {
        router.push(`/products/${favorite.products?.id}`)
    }


    return (
        <div
            className={'w-60 h-60 shadow mx-auto rounded-2xl p-3 duration-100 bg-white cursor-pointer hover:scale-105'}
            key={favorite.id}
            onClick={(e) => handleProductClick(e)}
        >
            <img className={'rounded-xl '} src="https://picsum.photos/224/200" alt=""/>
            <div className={'flex justify-between mt-1'}>
                <p className={'text-center'}>{favorite.product?.name}</p>
                <div>
                    <RemoveFavoriteModal favorite={favorite} confirm={handleRemoveFavorite}></RemoveFavoriteModal>
                </div>
            </div>
        </div>
    );
}

const FavoriteProducts = () => {
    const [favorites, setFavorites] = useState<FavoriteProduct[]>([])

    useEffect(() => {
        FavoriteProductService.getAllFavorites().then(res => {
            setFavorites(res.data)
        })
    }, [])

    const handleRemove = (favorite: FavoriteProduct) => {
        setFavorites(favorites.filter(fav => fav.id !== favorite.id))
    }

    return (
        <div>
            <h2 className={'text-2xl mt-16 mb-8'}>Mes produits favoris</h2>
            <div className={'w-full flex gap-10'}>
                {favorites?.length > 0 && favorites.map(favorite => (
                    <FavoriteItem key={favorite.id} favorite={favorite} remove={() => handleRemove(favorite)}/>
                ))}
                {!favorites?.length && (
                    <p>Vous n'avez pas encore de produits favoris</p>
                )}
            </div>
        </div>
    );
}

export default FavoriteProducts;