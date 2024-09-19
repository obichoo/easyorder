'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import StripeButton from "@/app/components/stripe-button/page";
import OrderService from "@/services/order.service";
import OrderItemService from "@/services/order-item.service";
import getUser from '@/utils/get-user';

const Cart = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const user = getUser();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data: orders } = await OrderService.getAllOrders();
                const userOrders = orders.filter(order => order.user_id === user._id);
                const items = await Promise.all(userOrders.map(async order => {
                    const orderItems = await Promise.all(order.items.map(async itemId => {
                        const { data: item } = await OrderItemService.getOrderItemById(itemId);
                        return item;
                    }));

                    return orderItems.map(item => ({
                        id: item._id,
                        name: item.product_id.name,
                        quantity: item.quantity,
                        price: item.price_in_cent / 100,
                        image: item.product_id.pictures && item.product_id.pictures.length > 0
                            ? item.product_id.pictures[0].url
                            : '/images/default-product.jpg'
                    }));
                }));

                setCartItems(items.flat());
            } catch (error) {
                console.error("Erreur lors de la récupération des commandes :", error);
            }
        };

        if (user?._id) {
            fetchOrders();
        }
    }, [user]);

    const updateQuantity = async (itemId: string, newQuantity: number) => {
        try {
            await OrderItemService.updateOrderItem({ _id: itemId, quantity: newQuantity });
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );

            // Si la quantité est mise à jour à 0, on supprime l'item
            if (newQuantity === 0) {
                await removeItem(itemId);
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la quantité :", error);
        }
    };

    // Fonction pour supprimer un produit du panier
    const removeItem = async (id: string) => {
        try {
            // Supprimer l'élément de commande
            await OrderItemService.deleteOrderItem(id);

            // Mettre à jour le state local pour supprimer l'item
            setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression de l'item :", error);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    };

    return (
        <div className="container mt-10">
            <h1 className="text-2xl font-semibold mb-6">Votre Panier</h1>

            {cartItems.length === 0 ? (
                <div className="text-center">
                    <p className="text-lg">Votre panier est vide.</p>
                    <Link href="/home" className="text-teal-500 underline">
                        Continuer vos achats
                    </Link>
                </div>
            ) : (
                <div>
                    <div className="rounded-2xl overflow-hidden border border-easyorder-black">
                        <table className="w-full mb-6">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 text-left">Produit</th>
                                    <th className="p-2 text-left">Quantité</th>
                                    <th className="p-2 text-left">Prix unitaire</th>
                                    <th className="p-2 text-left">Total</th>
                                    <th className="p-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map(item => (
                                    <tr key={item.id} className="border-t">
                                        <td className="p-2 flex items-center">
                                            <img src={item.image} alt={item.name} className="h-16 w-16 object-cover mr-4" />
                                            <span>{item.name}</span>
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.quantity}
                                                className="border w-16 p-1 text-center"
                                                onChange={(e) => {
                                                    const updatedQuantity = Math.max(0, parseInt(e.target.value, 10)); // Toujours s'assurer que la quantité est au moins 0
                                                    if (updatedQuantity !== item.quantity) {
                                                        updateQuantity(item.id, updatedQuantity);
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td className="p-2">{item.price} €</td>
                                        <td className="p-2">{(item.quantity * item.price).toFixed(2)} €</td>
                                        <td className="p-2">
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-right">
                        <p className="text-lg font-semibold">Total : {calculateTotal().toFixed(2)} €</p>
                    </div>

                    <div className="mt-6 flex justify-between">
                        <Link href="/home" className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md">
                            Continuer vos achats
                        </Link>
                        <StripeButton amount={calculateTotal() * 100}></StripeButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
