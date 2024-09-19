// pages/index.tsx ou Home.tsx
"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import Navbar from '../components/navbar/page';
import CarrouselBanner from '../components/carousel/page';
import ProductService from "@/services/product.service"; // Import du ProductService
import CategoryService from "@/services/category.service"; // Import du CategoryService

const Home = () => {
    const [products, setProducts] = useState<any[]>([]); // État pour stocker les produits
    const [categories, setCategories] = useState<any[]>([]); // État pour stocker les catégories

    // Fonction pour mélanger un tableau
    const shuffleArray = (array: any[]) => {
        return array.sort(() => Math.random() - 0.5);
    };

    // Récupérer les produits et catégories depuis le backend
    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            try {
                // Récupération des produits
                const productResponse = await ProductService.getAllProducts();
                const shuffledProducts = shuffleArray(productResponse.data); // Mélange les produits
                setProducts(shuffledProducts);

                // Ajout du console.log pour afficher les produits
                console.log("Produits récupérés depuis l'API :", productResponse.data);

                // Récupération des catégories
                const categoryResponse = await CategoryService.getAllCategories();
                setCategories(categoryResponse.data); // Met à jour les catégories
            } catch (error) {
                console.error("Erreur lors du chargement des données :", error);
            }
        };

        fetchProductsAndCategories();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="mt-8 px-6">
                <CarrouselBanner />

                <div className="mt-12 mb-8">
                    <h2 className="text-center text-lg font-semibold mb-4 text-easyorder-black">Catégories cliquables</h2>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                        {categories.length > 0 ? (
                            categories.map((category: any, index: number) => (
                                <button
                                    key={index}
                                    className="bg-easyorder-green text-white hover:bg-easyorder-black py-2 px-4 rounded-lg transition duration-200"
                                >
                                    {category.name}
                                </button>
                            ))
                        ) : (
                            <p className="text-center col-span-6">Aucune catégorie disponible</p>
                        )}
                    </div>
                </div>

                {/* Liste des produits */}
                <div className="mt-12 mb-12">
                    <h2 className="text-center text-lg font-semibold mb-4 text-easyorder-black">Produits</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                <Link
                                    key={index}
                                    href={`/products/${product._id}`} // Utilisation de _id pour générer l'URL correcte
                                    className="bg-white border border-easyorder-green h-48 flex flex-col justify-center items-center rounded-lg text-easyorder-black"
                                >
                                    <div className="text-center">
                                        <p className="font-bold">{product.name}</p>
                                        <p>{(product.price_in_cent / 100).toFixed(2)} €</p> {/* Conversion du prix en centimes */}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-center col-span-4">Aucun produit disponible</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
