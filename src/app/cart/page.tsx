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
import {FaArrowLeft, FaBox, FaTag, FaUser} from "react-icons/fa";

const Cart = () => {
    const [cartItems, setCartItems] = useState<OrderItem[]>([]);
    const [userId, setUserId] = useState<User['_id'] | null>(null);

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
        OrderService.getAllOrders().then(({ data }: { data: Order[]}) => {
            const userOrders: Order[] = data?.filter((order: Order) => (order.user_id as User)?._id === userId && order.status === 'pending');
            const items = userOrders.map((order: Order) => order.items).flat();
            setCartItems(items as OrderItem[]);
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

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-3xl font-semibold mb-8 text-easyorder-black">Panier</h1>

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

                    <div className="flex justify-between items-end mt-6">
                        <Link href="/home"
                              className="bg-easyorder-gray hover:bg-easyorder-green text-easyorder-black py-2 px-6 rounded-md transition flex items-center">
                            <FaArrowLeft size={12} className="inline-block mr-1 -mt-[2px]"/>
                            Continuer vos achats
                        </Link>
                        <div className="text-right">
                            <StripeButton params={`?orderId=${cartItems?.[0]?.order_id}`} amount={calculateTotal() * 100}></StripeButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
