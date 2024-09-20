'use client';

import React, { useEffect, useState } from 'react';
import {FaHeart, FaRegHeart, FaShoppingCart} from 'react-icons/fa';
import { useRouter, useParams } from 'next/navigation';
import ProductService from '@/services/product.service';
import Link from "next/link";
import {Product} from "@/models/product.model";
import OrderService from "@/services/order.service";
import {Order} from "@/models/order.model";
import {User} from "@/models/user.model";
import getUser from "@/utils/get-user";
import FavoriteProductService from "@/services/favorite-product.service";
import {FavoriteProduct} from "@/models/favorite-product.model"; // Importer le service ProductService

export default function Page() {
  const router = useRouter(); // Utilisation du hook useRouter
  const { id } = useParams(); // Récupérer l'ID du produit depuis l'URL
  const [product, setProduct] = useState<Product | any>(null); // État pour stocker les données du produit
  const [suggestions, setSuggestions] = useState<any[]>([]); // État pour stocker les produits suggérés
  const [userId, setUserId] = useState<User['_id'] | null>(null);
  const [favorites, setFavorites] = useState<{
    _id?: string,
    products?: string[]
  }>({});

  useEffect(() => {
    const userId = getUser()?._id;

    setUserId(userId);
    getFavoritesProducts()
  }, []);

  const getFavoritesProducts = () => {
    FavoriteProductService.getAllFavorites().then(({data}: {data: FavoriteProduct[]}) => {
      const myFavorites = data.filter((favorite: FavoriteProduct) => (favorite.user_id as User)?._id === getUser()?._id)
      const mappedFavorites = myFavorites.map((favorite: FavoriteProduct) => ({
        _id: favorite?._id,
        products: favorite.products?.map((product: any) => product._id)
      }))
      setFavorites(mappedFavorites[0] as any)
    })
  }

  // Récupérer les détails du produit
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await ProductService.getProductById(id as string);
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

  const addToCart = () => {
    OrderService.getAllOrders().then(({data}) => {
      const existingOrder = data.find((order: Order) => (order.user_id as User)?._id == userId && order.status === 'pending');
      if (existingOrder) {
        OrderService.addItemToOrder({
          order_id: existingOrder._id,
          product_id: product._id,
          quantity: 1,
          user_id: userId as string
        }).then(() => {
          router.push('/cart');
        })
      } else {
        OrderService.addItemToOrder({
          product_id: product._id,
          quantity: 1,
          user_id: userId as string
        }).then(() => {
          router.push('/cart');
        })
      }
    })
  }

  const toggleFavorite = () => {
    const userId = getUser()?._id;
    if (!favorites?._id) {
      FavoriteProductService.createFavorite({
        user_id: userId,
        products: [product?._id as string]
      }).then(() => {
        getFavoritesProducts()
      })
    } else {
      if (favorites?.products?.includes(product?._id)) {
        const newFavorite = {
          _id: favorites?._id,
          products: favorites?.products?.filter((p: any) => p !== product?._id)
        }
        FavoriteProductService.updateFavorite(newFavorite).then(() => {
          getFavoritesProducts()
        })
      } else {
        const newFavorite = {
          _id: favorites?._id,
          products: [...(favorites?.products as []), product?._id]
        }
        FavoriteProductService.updateFavorite(newFavorite).then(() => {
          getFavoritesProducts()
        })
      }
    }
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
                <p>{product.price_in_cent / 100} €</p>
              </div>

              {/* Boutons avec redirections */}
              <div className="flex space-x-4">
                <button onClick={toggleFavorite}
                        className="bg-transparent text-red-700 px-4 py-2 rounded-md transition">
                  {
                    (favorites?.products as any)?.includes(product._id) ? (
                        <FaHeart size={32} className="text-red-500"></FaHeart>
                    ) : (
                        <FaRegHeart size={32} className="text-red-500"></FaRegHeart>
                    )
                  }
                </button>

                <Link href={`/chat?user=${product?.artisan_id}`}>
                  <button className="h-full bg-easyorder-black text-white px-4 py-2 rounded">
                    Contacter l'artisan
                  </button>
                </Link>

                <button
                    className="flex items-center bg-easyorder-green px-4 py-2 text-white px-4 rounded hover:bg-easyorder-black transition"
                    onClick={() => addToCart()}
                >
                  <FaShoppingCart size={20} className="text-white mr-2"/>
                  Ajouter au panier
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
                      <div key={suggestedProduct._id} className="flex flex-col items-center">
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
