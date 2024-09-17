'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';

const allProducts = [
  {
    id: 1,
    name: 'Vase élégant',
    price: 29.99,
    description: 'Un vase élégant pour décorer votre maison.',
    image: 'https://via.placeholder.com/300x200?text=Vase+élegant'
  },
  {
    id: 2,
    name: 'Table moderne',
    price: 49.99,
    description: 'Table moderne en bois massif.',
    image: 'https://via.placeholder.com/300x200?text=Table+moderne'
  },
  {
    id: 3,
    name: 'Lampe de bureau',
    price: 19.99,
    description: 'Lampe de bureau à éclairage réglable.',
    image: 'https://via.placeholder.com/300x200?text=Lampe+de+bureau'
  },
  {
    id: 4,
    name: 'Chaise confortable',
    price: 39.99,
    description: 'Chaise confortable en cuir.',
    image: 'https://via.placeholder.com/300x200?text=Chaise+confortable'
  },
];

export default function ProductSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const query = searchParams.get('query') || ''; // Récupérer la valeur

  const [searchTerm, setSearchTerm] = useState(query); // Initialise avec la valeur
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(null);

      try {
        // Filtrer les produits
        const filteredProducts = allProducts.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(filteredProducts);
      } catch (err) {
        setError('Erreur lors de la recherche des produits');
      } finally {
        setLoading(false);
      }
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      // Mettre à jour l'URL avec le nouveau terme de recherche
      router.push(`/search-products?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleProductClick = (id) => {
    // Rediriger vers la page de détails du produit
    router.push(`/products/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Résultats de la recherche</h1>
      
      {/* Barre de recherche */}
      <form onSubmit={handleSearch} className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Rechercher des produits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-easyorder-green"
          />
          <button type="submit" className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500">
            <FaSearch />
          </button>
        </div>
      </form>

      {/* Affichage des résultats */}
      {loading && <p className="text-center text-gray-500">Chargement...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => handleProductClick(product.id)} // Redirige vers la page du produit
            >
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2" />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-500">{product.price} €</p>
              <p className="text-gray-700 mt-2">{product.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">Aucun produit trouvé.</p>
      )}
    </div>
  );
}
