'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import StripeButton from "@/app/components/stripe-button/page";
import OrderService from "@/services/order.service";
import OrderItemService from "@/services/order-item.service";
import getUser from '@/utils/get-user';
import {Order} from "@/models/order.model";
import {OrderItem} from "@/models/order-item.model";
import {User} from "@/models/user.model";
import {Product} from "@/models/product.model";

const Cart = () => {
    const [cartItems, setCartItems] = useState<OrderItem[]>([]);
    const [userId, setUserId] = useState<User['_id'] | null>(null);

    useEffect(() => {
        const userId = getUser()?._id
        setUserId(userId);
    }, []);

    useEffect(() => {
        if (userId) {
            getOrderItems();
        }
    }, [userId]);

    const getOrderItems = () => {
        OrderService.getAllOrders().then(({ data }: { data: Order[]}) => {
            const userOrders: Order[] = data?.filter((order: Order) => order.user_id === userId && order.status === 'pending');
            const items = userOrders.map((order: Order) => order.items).flat()
            setCartItems(items as OrderItem[]);
        })
    };


    const updateQuantity = (itemId: string, newQuantity: number) => {
        OrderItemService.updateOrderItem({ _id: itemId, quantity: newQuantity }).then(() => {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item._id === itemId ? {...item, quantity: newQuantity} : item
                )
            );

            // Si la quantité est mise à jour à 0, on supprime l'item
            if (newQuantity === 0) {
                removeItem(itemId);
            }
        }).catch(error => {
            console.error("Erreur lors de la mise à jour de la quantité :", error);
        })
    };

    // Fonction pour supprimer un produit du panier
    const removeItem = (id: string) => {
        OrderItemService.deleteOrderItem(id).then(() => {
            setCartItems(prevItems => prevItems.filter(item => item._id !== id));
        }).catch(error => {
            console.error("Erreur lors de la suppression de l'item :", error);
        })
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.quantity as number)  * (item.price_in_cent as number) / 100, 0);
    };

    const handleQuantityChange = (newQuantity: string, item: OrderItem) => {
        const updatedQuantity = Math.max(0, parseInt(newQuantity, 10));

        if (updatedQuantity !== item.quantity) {
            updateQuantity(item._id as string, updatedQuantity);
        }
    }

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
                                {cartItems.map((item: OrderItem) => (
                                    <tr key={item._id} className="border-t">
                                        <td className="p-2 flex items-center">
                                            {/*<img src={item.image} alt={item.name} className="h-16 w-16 object-cover mr-4" />*/}
                                            <span>{(item.product_id as Product)?.name}</span>
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.quantity}
                                                className="border w-16 p-1 text-center"
                                                onChange={(e) => handleQuantityChange(e.target.value, item)}
                                            />
                                        </td>
                                        <td className="p-2">{(item.price_in_cent as number) / 100} €</td>
                                        <td className="p-2">{((item.quantity as number) * ((item.price_in_cent as number) / 100)).toFixed(2)} €</td>
                                        <td className="p-2">
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                                                onClick={() => removeItem(item._id as string)}
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
