'use client';
import React from 'react';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter(); // Utilisation du hook useRouter

  return (
    <div>
      <div className="w-full h-16 bg-easyorder-gray mb-4"></div>
      {/* Nom du produit */}
      <h1 className="text-center text-3xl font-bold mb-12">Nom du Produit</h1>
      <div className="container mx-auto">
        <div className="flex">
          {/* Carousel */}
          <div className="w-1/3 pr-4">
            <div className="relative">
              <div className="carousel">
                <img src="photo1.jpg" alt="Photo 1" className="w-full h-auto" />
              </div>
            </div>
          </div>

          {/* Détails du produit */}
          <div className="w-2/3 pl-24">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Catégories</h2>
              <p>Catégorie 1, Catégorie 2, Catégorie 3</p>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p>Voici la description du produit.</p>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Dimensions</h2>
              <p>Dimensions du produit.</p>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Prix</h2>
              <p>100 €</p>
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
            {/* Produit 1 */}
            <div className="flex flex-col items-center">
              <img src="/path/to/suggested-product1.jpg" alt="Produit 1" className="w-full h-auto mb-2" />
              <p className="font-semibold">Produit 1</p>
              <p className="text-gray-500">50 €</p>
            </div>
            {/* Produit 2 */}
            <div className="flex flex-col items-center">
              <img src="/path/to/suggested-product2.jpg" alt="Produit 2" className="w-full h-auto mb-2" />
              <p className="font-semibold">Produit 2</p>
              <p className="text-gray-500">75 €</p>
            </div>
            {/* Produit 3 */}
            <div className="flex flex-col items-center">
              <img src="/path/to/suggested-product3.jpg" alt="Produit 3" className="w-full h-auto mb-2" />
              <p className="font-semibold">Produit 3</p>
              <p className="text-gray-500">60 €</p>
            </div>
            {/* Produit 4 */}
            <div className="flex flex-col items-center">
              <img src="/path/to/suggested-product4.jpg" alt="Produit 4" className="w-full h-auto mb-2" />
              <p className="font-semibold">Produit 4</p>
              <p className="text-gray-500">80 €</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
