'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import StripeButton from "@/app/components/stripe-button/page";
import OrderService from "@/services/order.service";
import OrderItemService from "@/services/order-item.service"; // Assurez-vous que ce service contient la méthode updateOrderItem
import getUser from '@/utils/get-user';

const Cart = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const user = getUser();
    
    console.log("User ID: " + user._id);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data: orders } = await OrderService.getAllOrders();
                console.log("Orders: ", orders);

                // Filtrer les commandes pour l'utilisateur connecté
                const userOrders = orders.filter(order => order.user_id === user._id);

                // Pour chaque commande de l'utilisateur, récupérer les items correspondants
                const items = await Promise.all(userOrders.map(async order => {
                    // Pour chaque item dans une commande, récupérez les détails des produits
                    const orderItems = await Promise.all(order.items.map(async itemId => {
                        const { data: item } = await OrderItemService.getOrderItemById(itemId);
                        return item;
                    }));

                    console.log("Order Items for order ", order._id, ": ", orderItems);

                    // Transformer les items en un format pour le panier
                    return orderItems.map(item => ({
                        id: item._id,
                        name: item.product_id.name,
                        quantity: item.quantity,
                        price: item.price_in_cent / 100, // Prix en euros
                        image: item.product_id.pictures && item.product_id.pictures.length > 0
                            ? item.product_id.pictures[0].url
                            : '/images/default-product.jpg'
                    }));
                }));

                // Aplatir le tableau et mettre à jour le state des articles du panier
                setCartItems(items.flat());
            } catch (error) {
                console.error("Erreur lors de la récupération des commandes :", error);
            }
        };

        if (user?._id) {
            fetchOrders();
        }
    }, [user]);

    // Fonction pour mettre à jour la quantité
    const updateQuantity = async (itemId: string, newQuantity: number) => {
        try {
            console.log("Mise à jour de l'item :", itemId, "avec la quantité :", newQuantity);
            await OrderItemService.updateOrderItem({ _id: itemId, quantity: newQuantity });
            // Mettez à jour le state local si la mise à jour réussit
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la quantité :", error);
        }
    };
    

    // Calcul du total
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    };

    // Fonction pour supprimer un produit du panier
    const removeItem = (id: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
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
                    {/* Tableau des articles du panier */}
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
                                                min="1"
                                                value={item.quantity}
                                                className="border w-16 p-1 text-center"
                                                onChange={(e) => {
                                                    const updatedQuantity = Math.max(1, parseInt(e.target.value, 10)); // Toujours s'assurer que la quantité est au moins 1
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

                    {/* Total */}
                    <div className="text-right">
                        <p className="text-lg font-semibold">Total : {calculateTotal().toFixed(2)} €</p>
                    </div>

                    {/* Boutons */}
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
