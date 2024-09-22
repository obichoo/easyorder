'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductService from '@/services/product.service';
import CategoryService from '@/services/category.service'; // Service pour récupérer les catégories
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';
import {Category} from "@/models/category.model";
import {Product} from "@/models/product.model";
import Link from "next/link";
import Title from "@/app/components/title/page";
import Loading from "@/app/components/loading/page";

const SearchPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]); // Liste des catégories
    const [selectedCategory, setSelectedCategory] = useState<Category['_id']>(''); // Catégorie sélectionnée
    const [searchTerm, setSearchTerm] = useState<string>(''); // Terme de recherche
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const searchParams = useSearchParams();
    const router = useRouter();

    const checkQueryParams = () => {
        const category = searchParams.get('category');
        if (category) {
            setSelectedCategory(category);
        }

        const query = searchParams.get('query');
        if (query) {
            setSearchTerm(query);
        }
    }

    // Récupérer tous les produits et catégories
    useEffect(() => {
        checkQueryParams();

        const fetchAllData = async () => {
            try {
                setLoading(true);

                // Récupérer les produits
                const productResponse = await ProductService.getAllProducts();
                setProducts(productResponse.data);

                // Récupérer les catégories
                const categoryResponse = await CategoryService.getAllCategories();
                setCategories(categoryResponse.data);

                setLoading(false);
            } catch (error) {
                setError("Erreur lors de la récupération des produits ou catégories.");
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Filtrer les produits en fonction du terme de recherche et de la catégorie
    useEffect(() => {
        let filtered = products;

        // Filtrage par terme de recherche
        if (searchTerm) {
            filtered = filtered.filter((product: Product) =>
                (product?.name as string).toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product?.description as string).toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrage par catégorie
        if (selectedCategory) {
            filtered = filtered.filter((product: Product) =>
                (product?.categories as Category[]).find((c: Category) => c._id === selectedCategory)
            );
        }

        setFilteredProducts(filtered);
    }, [searchTerm, selectedCategory, products]);

    return (
        <div className="bg-easyorder-gray py-8">
            <div className="max-w-7xl mx-auto px-6">
                <Title>
                    Résultats de recherche
                </Title>

                {/* Barre de recherche */}
                <div className="flex justify-center mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher un produit..."
                        className="w-full max-w-md p-3 border border-easyorder-black rounded-md"
                    />
                </div>

                {/* Filtre des catégories */}
                <div className="flex flex-wrap justify-center space-x-4 mb-8">
                    <button
                        className={`px-4 py-2 rounded-md ${!selectedCategory ? 'bg-easyorder-green text-white' : 'bg-gray-200 text-easyorder-black'}`}
                        onClick={() => setSelectedCategory('')}
                    >
                        Toutes les catégories
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category._id}
                            className={`px-4 py-2 rounded-md ${selectedCategory === category._id ? 'bg-easyorder-green text-white' : 'bg-gray-200 text-easyorder-black'}`}
                            onClick={() => setSelectedCategory(category._id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <Loading />
                ) : error ? (
                    <p className="text-center text-lg text-red-600">
                        {error}
                    </p>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <Link
                                key={product._id}
                                className="bg-white p-4 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl cursor-pointer"
                                href={`/products/${product._id}`}
                            >
                                <img
                                    src={(product.pictures && product.pictures.length > 0) ? product.pictures[0]?.url : 'https://via.placeholder.com/300'}
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                                <h4 className="font-bold text-xl text-easyorder-black mb-2 truncate">{product.name}</h4>
                                <p className=" mb-2">
                                    {(product?.description as string).substring(0, 60)}
                                    {(product?.description as string).length > 59 && '...'}
                                </p>
                                <p className="text-easyorder-black font-semibold">Prix : {((product?.price_in_cent as number) / 100).toFixed(2)} €</p>
                                <p className="">Stock : {(product?.stock as number) > 0 ? product.stock : 'Rupture de stock'}</p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-lg text-easyorder-black">
                        Aucun produit trouvé.
                    </p>
                )}
            </div>
        </div>
    );
};

const Page = () => {
    return (
        <Suspense>
            <SearchPage />
        </Suspense>
    );
};

export default Page;
