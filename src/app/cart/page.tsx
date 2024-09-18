'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import StripeButton from "@/app/components/stripe-button/page";

const Cart = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);

    useEffect(() => {
        // Simulation de récupération des produits du panier depuis le localStorage ou une API
        const savedCart = [
            {
                id: 1,
                name: 'Produit A',
                quantity: 2,
                price: 20.50,
                image: '/produitA.jpg'
            },
            {
                id: 2,
                name: 'Produit B',
                quantity: 1,
                price: 50.49,
                image: '/produitB.jpg'
            }
        ];
        setCartItems(savedCart);
    }, []);

    // Calcul du total
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    };

    // Fonction pour supprimer un produit du panier
    const removeItem = (id: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6">Votre Panier</h1>

            {cartItems.length === 0 ? (
                <div className="text-center">
                    <p className="text-lg">Votre panier est vide.</p>
                    <Link href="/products" className="text-teal-500 underline">
                        Continuer vos achats
                    </Link>
                </div>
            ) : (
                <div>
                    {/* Tableau des articles du panier */}
                    <table className="w-full mb-6 border border-gray-200">
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
                                                const updatedQuantity = parseInt(e.target.value, 10);
                                                setCartItems(prevItems =>
                                                    prevItems.map(ci =>
                                                        ci.id === item.id
                                                            ? { ...ci, quantity: updatedQuantity }
                                                            : ci
                                                    )
                                                );
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

                    {/* Total */}
                    <div className="text-right">
                        <p className="text-lg font-semibold">Total : {calculateTotal().toFixed(2)} €</p>
                    </div>

                    {/* Boutons */}
                    <div className="mt-6 flex justify-between">
                        <Link href="/home" className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md">
                            Continuer vos achats
                        </Link>
                        <StripeButton amount={calculateTotal()*100}></StripeButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
