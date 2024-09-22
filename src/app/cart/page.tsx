'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StripeButton from "@/app/components/stripe-button/page";
import OrderService from "@/services/order.service";
import OrderItemService from "@/services/order-item.service";
import getUser from '@/utils/get-user';
import { Order } from "@/models/order.model";
import { OrderItem } from "@/models/order-item.model";
import { User } from "@/models/user.model";
import { Product } from "@/models/product.model";
import { FaArrowLeft } from "react-icons/fa";
import MondialRelayWidget from "@/app/components/relaiscolis/MondialRelayWidget";
import Title from "@/app/components/title/page";

const Cart = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [cartItems, setCartItems] = useState<OrderItem[]>([]);
    const [userId, setUserId] = useState<User['_id'] | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedRelay, setSelectedRelay] = useState<{ street: string; postalCode: string; city: string; country: string } | null>(null);
    const [loadingRelay, setLoadingRelay] = useState(false);

    useEffect(() => {
        const userId = getUser()?._id;
        setUserId(userId);
    }, []);

    useEffect(() => {
        if (userId) {
            getOrderItems();
        }
    }, [userId]);

    const getOrderItems = () => {
        OrderService.getAllOrders().then(({ data }: { data: Order[] }) => {
            const userOrder: Order | any = data?.find((order: Order) => (order.user_id as User)?._id === userId && order.status === 'pending');
            if (!userOrder) {
                return;
            }
            setOrder(userOrder);
            setCartItems(userOrder.items as OrderItem[]);
        });
    };

    const updateQuantity = (itemId: string, newQuantity: number) => {
        OrderItemService.updateOrderItem({ _id: itemId, quantity: newQuantity }).then(() => {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item._id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );

            if (newQuantity === 0) {
                removeItem(itemId);
            }
        }).catch(error => {
            console.error("Erreur lors de la mise à jour de la quantité :", error);
        });
    };

    const removeItem = (id: string) => {
        OrderItemService.deleteOrderItem(id).then(() => {
            setCartItems(prevItems => prevItems.filter(item => item._id !== id));
        }).catch(error => {
            console.error("Erreur lors de la suppression de l'item :", error);
        });
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.quantity as number) * ((item?.product_id as Product)?.price_in_cent as number) / 100, 0);
    };

    const handleQuantityChange = (newQuantity: string, item: OrderItem) => {
        const updatedQuantity = Math.max(0, parseInt(newQuantity, 10));

        if (updatedQuantity !== item.quantity) {
            updateQuantity(item._id as string, updatedQuantity);
        }
    };

    const handlePayment = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const handleConfirm = async () => {
        if (!selectedRelay) {
            alert("Veuillez sélectionner un point relais avant de confirmer.");
            return;
        }
    
    
        try {
            // Récupère la commande actuelle
            const { data: order } = await OrderService.getOrderById(cartItems?.[0]?.order_id as string);
    
            // Mets à jour l'adresse de livraison sans changer les autres détails
            const updatedOrderData = {
                ...order, // Conserve les autres détails de la commande
                delivery_address: {
                    street: selectedRelay.street,
                    postalCode: selectedRelay.postalCode,
                    city: selectedRelay.city,
                    country: selectedRelay.country
                }
            };

            setLoadingRelay(true);

            // Mets à jour la commande complète
            await OrderService.updateOrder(updatedOrderData).then((response) => {
                setOrder(response.data);
                closePopup();
                setLoadingRelay(false);
            })

        } catch (error: any) {
            console.error("Erreur lors de la mise à jour de la commande :", error.response?.data || error.message);
        }
    };
    
    

    return (
        <div className="container mx-auto mt-10">
            <Title>Panier</Title>

            {cartItems.length === 0 ? (
                <div className="text-center">
                    <p className="text-lg text-easyorder-black">Votre panier est vide.</p>
                    <Link href="/home" className="text-easyorder-green hover:underline">
                        Continuer vos achats
                    </Link>
                </div>
            ) : (
                <div>
                    <div className="rounded-2xl overflow-hidden shadow-md bg-white border border-easyorder-gray mb-6">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-easyorder-green text-white">
                                    <th className="p-4 text-left">Produit</th>
                                    <th className="p-4 text-left">Quantité</th>
                                    <th className="p-4 text-left">Prix unitaire</th>
                                    <th className="p-4 text-left">Total</th>
                                    <th className="p-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item: OrderItem) => (
                                    <tr key={item._id} className="border-t">
                                        <td className="p-4 flex items-center">
                                            <div className="grid grid-cols-[112px_500px] gap-3 h-28 mt-4">
                                                <Link href={`/products/${(item?.product_id as Product)?._id}`} className="relative h-28 w-28">
                                                    <img
                                                        src={(item.product_id as Product)?.pictures?.[0]?.url || 'https://via.placeholder.com/150'}
                                                        alt={(item.product_id as Product)?.name}
                                                        className="w-full h-full object-cover rounded-md mr-4 cursor-pointer"
                                                    />
                                                </Link>
                                                <div className="text-lg font-semibold text-easyorder-black">
                                                    <p className="flex items-center h-full">
                                                        {(item.product_id as Product)?.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.quantity}
                                                className="border border-easyorder-gray rounded-md w-16 p-1 text-center focus:ring-2 focus:ring-easyorder-green"
                                                onChange={(e) => handleQuantityChange(e.target.value, item)}
                                            />
                                        </td>
                                        <td className="p-4">{((item.product_id as Product)?.price_in_cent as any) / 100} €</td>
                                        <td className="p-4">{((item.quantity as number) * (((item.product_id as Product)?.price_in_cent as any) / 100)).toFixed(2)} €</td>
                                        <td className="p-4">
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-all"
                                                onClick={() => removeItem(item._id as string)}
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-2xl font-semibold text-easyorder-black text-right p-3">
                            Total : {calculateTotal().toFixed(2)} €
                        </p>
                    </div>

                    {
                        order?.delivery_address &&
                        <div className="flex justify-end mb-2">
                            <div>
                                <p className="text-easyorder-black text-sm">Point relais choisi</p>
                                <p className="text-easyorder-black">
                                    {order?.delivery_address.street}, {order?.delivery_address.postalCode} {order?.delivery_address.city}
                                </p>
                            </div>
                        </div>
                    }

                    <div className="flex justify-between items-end">
                        <Link href="/home" className="bg-easyorder-gray hover:bg-easyorder-green text-easyorder-black py-2 px-6 rounded-md transition flex items-center">
                            <FaArrowLeft size={12} className="inline-block mr-1 -mt-[2px]" />
                            Continuer vos achats
                        </Link>

                        <div className="flex mb-2">
                            <div>
                                <button
                                    onClick={handlePayment}
                                    className="bg-easyorder-green hover:bg-easyorder-black transition text-white py-2 px-6 rounded-md"
                                >
                                    {order?.delivery_address ? 'Modifier le point relais' : 'Choisir un point relais'}
                                </button>
                            </div>
                                {
                                    order?.delivery_address &&
                                    <div className="ml-4">
                                        <StripeButton params={`?orderId=${cartItems?.[0]?.order_id}`} amount={calculateTotal() * 100}></StripeButton>
                                    </div>
                                }
                        </div>
                    </div>
                </div>
            )}

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Sélectionnez votre point de relais</h2>
                        <MondialRelayWidget onParcelShopSelected={(relay: any) => {
                            setSelectedRelay(relay);
                        }} />
                        
                        {selectedRelay && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Détails du point relais sélectionné :</h3>
                                <p><strong>Adresse :</strong> {selectedRelay.street}</p>
                                <p><strong>Code postal :</strong> {selectedRelay.postalCode}</p>
                                <p><strong>Ville :</strong> {selectedRelay.city}</p>
                                <p><strong>Pays :</strong> {selectedRelay.country}</p>
                            </div>
                        )}
                        
                        <div className="flex justify-end mt-4">
                            <button onClick={loadingRelay ? () => {} : handleConfirm} className="bg-easyorder-green text-white py-2 px-4 rounded-md mr-2">
                                {loadingRelay ? 'Chargement...' : 'Confirmer'}
                            </button>
                            <button onClick={closePopup} className="bg-red-500 text-white py-2 px-4 rounded-md">
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;