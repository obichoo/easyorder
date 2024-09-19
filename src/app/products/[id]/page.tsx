'use client';

import React, { useEffect, useState } from 'react';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useRouter, useParams } from 'next/navigation';
import ProductService from '@/services/product.service'; // Importer le service ProductService

export default function Page() {
  const router = useRouter(); // Utilisation du hook useRouter
  const { id } = useParams(); // Récupérer l'ID du produit depuis l'URL
  const [product, setProduct] = useState<any>(null); // État pour stocker les données du produit
  const [suggestions, setSuggestions] = useState<any[]>([]); // État pour stocker les produits suggérés

  // Récupérer les détails du produit
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await ProductService.getProductById(id);
          setProduct(response.data);

          // Optionnel : Récupérer les suggestions de produits
          const suggestedProducts = await ProductService.getAllProducts(); // Récupérer tous les produits
          setSuggestions(suggestedProducts.data.filter((p: any) => p.id !== id)); // Filtrer pour ne pas inclure le produit actuel
        } catch (error) {
          console.error("Erreur lors du chargement du produit :", error);
        }
      };

      fetchProduct();
    }
  }, [id]);

  if (!product) {
    return <p>Chargement du produit...</p>;
  }

  return (
      <div>
        <div className="w-full h-16 bg-easyorder-gray mb-4"></div>
        {/* Nom du produit */}
        <h1 className="text-center text-3xl font-bold mb-12">{product.name}</h1>
        <div className="container mx-auto">
          <div className="flex">
            {/* Carousel */}
            <div className="w-1/3 pr-4">
              <div className="relative">
                <div className="carousel">
                  <img src={product.image || "photo1.jpg"} alt={product.name} className="w-full h-auto" />
                </div>
              </div>
            </div>

            {/* Détails du produit */}
            <div className="w-2/3 pl-24">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Catégories</h2>
                {/* Vérification si product.categories existe */}
                <p>
                  {product.categories && product.categories.length > 0
                      ? product.categories.map((cat: any) => cat.name).join(', ')
                      : 'Aucune catégorie'}
                </p>
              </div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p>{product.description}</p>
              </div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Dimensions</h2>
                <p>{product.dimensions}</p>
              </div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Prix</h2>
                <p>{product.price} €</p>
              </div>

              {/* Boutons avec redirections */}
              <div className="flex space-x-4">
                <button
                    className="flex items-center bg-red-400 text-white px-4 py-2 rounded"
                    onClick={() => router.push('/favorites')} // Redirection vers la page des favoris
                >
                  <FaHeart className="h-6 w-6 text-red-600 mr-2" />
                  Favoris
                </button>

                <button
                    className="bg-easyorder-black text-white px-4 py-2 rounded"
                    onClick={() => router.push('/chat')} // Redirection vers la page de contact
                >
                  Contacter l'artisan
                </button>

                <button
                    className="flex items-center bg-easyorder-green text-white px-4 py-2 rounded"
                    onClick={() => router.push('/cart')} // Redirection vers la page du panier
                >
                  <FaShoppingCart className="h-6 w-6 text-easyorder-black mr-2" />
                  Ajouter au panier
                </button>

                <button
                    className="bg-easyorder-green text-white px-4 py-2 rounded"
                    onClick={() => router.push('/checkout')} // Redirection vers la page d'achat
                >
                  Acheter
                </button>
              </div>
            </div>
          </div>

          {/* Suggestion de produits */}
          <div className="mt-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">Suggestions</h2>
            <div className="grid grid-cols-4 gap-4">
              {suggestions.length > 0 ? (
                  suggestions.map((suggestedProduct) => (
                      <div key={suggestedProduct.id} className="flex flex-col items-center">
                        <img src={suggestedProduct.image || "/path/to/default-image.jpg"} alt={suggestedProduct.name} className="w-full h-auto mb-2" />
                        <p className="font-semibold">{suggestedProduct.name}</p>
                        <p className="text-gray-500">{suggestedProduct.price_in_cent} €</p>
                      </div>
                  ))
              ) : (
                  <p>Aucune suggestion disponible</p>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
