'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductService from '@/services/product.service';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa'; // Utilisation de FaSpinner pour l'animation de chargement

const SearchPage = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const searchParams = useSearchParams();
    const router = useRouter();

    // Récupérer la query depuis les paramètres d'URL
    const query = searchParams.get('query')?.toLowerCase();

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const response = await ProductService.getAllProducts();
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                setError("Erreur lors de la récupération des produits. Veuillez réessayer.");
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, []);

    useEffect(() => {
        if (query && products.length > 0) {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
            setFilteredProducts(filtered);
        }
    }, [query, products]);

    return (
        <div className="min-h-screen bg-easyorder-gray py-8">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="text-center text-3xl font-bold text-easyorder-black mb-12">
                    Résultats de recherche pour "{query}"
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center">
                        <FaSpinner className="animate-spin text-easyorder-green text-4xl" />
                        <p className="ml-4 text-lg">Chargement des résultats...</p>
                    </div>
                ) : error ? (
                    <p className="text-center text-lg text-red-600">
                        {error}
                    </p>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white p-4 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl cursor-pointer"
                                onClick={() => router.push(`/products/${product._id}`)}
                            >
                                <img
                                    src={(product.photos && product.photos.length > 0) ? product.photos[0] : 'https://via.placeholder.com/300'}
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                                <h4 className="font-bold text-xl text-easyorder-black mb-2">{product.name}</h4>
                                <p className="text-gray-600 mb-2">{product.description.substring(0, 100)}...</p>
                                <p className="text-easyorder-black font-semibold">Prix : {(product.price_in_cent / 100).toFixed(2)} €</p>
                                <p className="text-gray-600">Stock : {product.stock > 0 ? product.stock : 'Rupture de stock'}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-lg text-easyorder-black">
                        Aucun produit trouvé pour "{query}".
                    </p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
