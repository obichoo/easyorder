"use client";

import Link from 'next/link';
import { FaCalendarAlt, FaBox, FaUser, FaTag } from 'react-icons/fa';
import Navbar from '../components/navbar/page';


const Historique = () => {
    // Fake data pour les achats
    const achats = [
        {
            productName: "Pull en laine bleu",
            price: "45€",
            seller: "Artisan A",
            quantity: 2,
            purchaseDate: "2024-08-14",
        },
        {
            productName: "Vase en céramique",
            price: "35€",
            seller: "Artisan B",
            quantity: 1,
            purchaseDate: "2024-07-20",
        },
    ];

    // Fake data pour les ventes
    const ventes = [
        {
            productName: "Chat en poterie",
            price: "50€",
            buyer: "Client X",
            quantity: 1,
            saleDate: "2024-09-01",
        },
        {
            productName: "Table en bois massif",
            price: "150€",
            buyer: "Client Y",
            quantity: 1,
            saleDate: "2024-08-22",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            {/* Contenu principal */}
            <main className="mt-8 px-6">
                {/* Bouton retour vers la page d'accueil */}
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 py-2 px-4 mb-4 inline-block">
                    ← Retour à l'accueil
                </Link>

                {/* Titre */}
                <h2 className="text-4xl font-semibold text-center text-gray-800 mb-12">Historique des Achats / Ventes</h2>

                {/* Grille des listes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Liste des achats */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-600">Mes achats</h3>
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            {achats.map((achat, index) => (
                                <div key={index} className="border-b border-gray-200 pb-4 mb-4">
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
                            ))}
                        </div>
                    </div>

                    {/* Liste des ventes */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-600">Mes ventes</h3>
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            {ventes.map((vente, index) => (
                                <div key={index} className="border-b border-gray-200 pb-4 mb-4">
                                    <div className="text-lg font-semibold text-gray-800">{vente.productName}</div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <FaUser className="inline-block mr-2" /> Acheteur : {vente.buyer}
                                    </div>
                                    <div className="mt-1 text-sm text-gray-600">
                                        <FaTag className="inline-block mr-2" /> Prix : {vente.price}
                                    </div>
                                    <div className="mt-1 text-sm text-gray-600">
                                        <FaBox className="inline-block mr-2" /> Quantité : {vente.quantity}
                                    </div>
                                    <div className="mt-1 text-sm text-gray-600">
                                        <FaCalendarAlt className="inline-block mr-2" /> Date de vente : {vente.saleDate}
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
