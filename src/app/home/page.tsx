'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';
import Navbar from '../components/navbar/page';
import CarrouselBanner from '../components/carousel/page';
import ProductService from "@/services/product.service";
import CategoryService from "@/services/category.service";
import { Product } from "@/models/product.model";
import { Category } from "@/models/category.model";

const Home = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const shuffleArray = (array: any[]) => {
        return array.sort(() => Math.random() - 0.5);
    };

    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            try {
                const productResponse = await ProductService.getAllProducts();
                const shuffledProducts = shuffleArray(productResponse.data);
                setProducts(shuffledProducts);

                // Test: afficher chaque produit dans la console
                console.log("Produits chargés :", shuffledProducts);
                shuffledProducts.forEach((product) => {
                    console.log("Produit détaillé :", product);
                });

                const categoryResponse = await CategoryService.getAllCategories();
                setCategories(categoryResponse.data);
            } catch (error) {
                console.error("Erreur lors du chargement des données :", error);
            }
        };

        fetchProductsAndCategories();
    }, []);

    // Fonction de sélection de la catégorie
    const handleCategoryClick = (categoryId: string) => {
        // Si la catégorie sélectionnée est déjà active, on supprime le filtre
        if (selectedCategory === categoryId) {
            setSelectedCategory(null); // Réinitialisation du filtre
        } else {
            setSelectedCategory(categoryId); // Sélection de la nouvelle catégorie
        }
    };

    // Filtrer les produits en fonction de la catégorie sélectionnée
    const filteredProducts = selectedCategory
        ? products.filter((product) => product.categories?.includes(selectedCategory))
        : products;

    return (
        <div className="min-h-screen bg-[#e7e6e6]">
            <main className="mt-8 px-6">
                <CarrouselBanner />

                {/* Catégories */}
                <div className="mt-12 mb-8">
                    <h2 className="text-center text-2xl font-bold mb-6 text-[#032035]">Explorez les Catégories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
                        {categories.length > 0 ? (
                            categories.map((category: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => handleCategoryClick(category._id)}
                                    className={`bg-[#77ad86] text-white hover:bg-[#032035] py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-md ${
                                        selectedCategory === category._id ? 'bg-[#032035]' : ''
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))
                        ) : (
                            <p className="text-center col-span-6 text-lg text-[#032035]">Aucune catégorie disponible</p>
                        )}
                    </div>
                </div>

                {/* Liste des produits */}
                <div className="mt-12 mb-12">
                    <h2 className="text-center text-2xl font-bold mb-6 text-[#032035]">Nos Produits</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                                <Link
                                    key={index}
                                    href={`/products/${product._id}`}
                                    className="bg-white border border-[#77ad86] rounded-lg overflow-hidden hover:shadow-lg transition duration-300 transform hover:scale-105"
                                >
                                    <div className="h-40 flex justify-center items-center">
                                        {product.pictures && product.pictures[0]?.url ? (
                                            <img src={product.pictures[0].url} alt={product.name} className="object-cover h-full w-full" />
                                        ) : (
                                            <img src="https://via.placeholder.com/150" alt="Placeholder" className="object-cover h-full w-full" />
                                        )}
                                    </div>
                                    <div className="p-4 text-center">
                                        <p className="font-bold text-[#032035]">{product.name}</p>
                                        <p className="text-[#77ad86]">{((product.price_in_cent as number) / 100).toFixed(2)} €</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-center col-span-4 text-lg text-[#032035]">Aucun produit disponible</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
