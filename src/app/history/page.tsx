'use client';

import Link from 'next/link';
import { FaCalendarAlt, FaBox, FaUser, FaTag } from 'react-icons/fa';
import Navbar from '../components/navbar/page';
import { useEffect, useState } from 'react';
import UserService from '@/services/user.service'; // Import du service utilisateur

const Historique = () => {
    // Fake data pour les achats avec images générées par picsum.photos
    const achats = [
        {
            productName: "Pull en laine bleu",
            price: "45€",
            seller: "Artisan A",
            quantity: 2,
            purchaseDate: "2024-08-14",
            imageUrl: "https://picsum.photos/150" // URL d'image aléatoire
        },
        {
            productName: "Vase en céramique",
            price: "35€",
            seller: "Artisan B",
            quantity: 1,
            purchaseDate: "2024-07-20",
            imageUrl: "https://picsum.photos/150" // URL d'image aléatoire
        },
    ];

    // Simuler un utilisateur en tant que client
    const [user, setUser] = useState({
        name: "Jean Client",
        role: "client", // Simuler que l'utilisateur est un "client"
    });

    const role = user.role; // Récupérer le rôle de l'utilisateur

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Contenu principal */}
            <main className="mt-8 px-6 flex justify-center">
                {/* Contenu centré */}
                <div className="w-full max-w-3xl">
                    {/* Bouton retour vers la page d'accueil */}
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 py-2 px-4 mb-4 inline-block">
                        ← Retour à l'accueil
                    </Link>

                    {/* Titre */}
                    <h2 className="text-4xl font-semibold text-center text-gray-800 mb-12">
                        {role === "artisant" ? "Historique des Achats / Ventes" : "Historique des Achats"}
                    </h2>

                    {/* Liste des achats */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-600">Mes achats</h3>
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            {achats.map((achat, index) => (
                                <div key={index} className="border-b border-gray-200 pb-4 mb-4 flex">
                                    {/* Image du produit */}
                                    <img
                                        src={achat.imageUrl}
                                        alt={achat.productName}
                                        className="w-24 h-24 object-cover rounded-md mr-4"
                                    />

                                    {/* Informations du produit */}
                                    <div>
                                        <div className="text-lg font-semibold text-gray-800">{achat.productName}</div>
                                        <div className="mt-2 text-sm text-gray-600">
                                            <FaUser className="inline-block mr-2" /> Vendeur : {achat.seller}
                                        </div>
                                        <div className="mt-1 text-sm text-gray-600">
                                            <FaTag className="inline-block mr-2" /> Prix : {achat.price}
                                        </div>
                                        <div className="mt-1 text-sm text-gray-600">
                                            <FaBox className="inline-block mr-2" /> Quantité : {achat.quantity}
                                        </div>
                                        <div className="mt-1 text-sm text-gray-600">
                                            <FaCalendarAlt className="inline-block mr-2" /> Date d'achat : {achat.purchaseDate}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Historique;
