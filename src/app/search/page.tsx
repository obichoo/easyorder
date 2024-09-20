'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductService from '@/services/product.service';
import { useRouter } from 'next/navigation';

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
                const response = await ProductService.getAllProducts(); // Récupérer tous les produits
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                setError("Erreur lors de la récupération des produits");
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
        <div className="min-h-screen bg-easyorder-gray">
            <div className="mt-8 px-6 py-8">
                <h1 className="text-center text-2xl font-semibold text-easyorder-black mb-8">
                    Résultats de recherche pour "{query}"
                </h1>

                {loading ? (
                    <p className="text-center text-lg">Chargement des résultats...</p>
                ) : error ? (
                    <p className="text-center text-lg text-red-600">{error}</p>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                                onClick={() => router.push(`/products/${product._id}`)}
                            >
                                <img
                                    src={(product.photos && product.photos.length > 0) ? product.photos[0] : 'https://via.placeholder.com/150'}
                                    alt={product.name}
                                    className="w-full h-48 object-cover mb-4 rounded-lg"
                                />
                                <h4 className="font-bold text-lg mb-2">{product.name}</h4>
                                <p className="text-gray-700">{product.description}</p>
                                <p className="text-gray-700">Prix : {product.price_in_cent / 100} €</p>
                                <p className="text-gray-700">Stock : {product.stock}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-lg">Aucun produit trouvé pour "{query}".</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
