'use client';

import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { useRouter, useParams } from 'next/navigation';
import ProductService from '@/services/product.service';
import Link from "next/link";
import { Product } from "@/models/product.model";
import OrderService from "@/services/order.service";
import { Order } from "@/models/order.model";
import { User } from "@/models/user.model";
import getUser from "@/utils/get-user";
import FavoriteProductService from "@/services/favorite-product.service";
import { FavoriteProduct } from "@/models/favorite-product.model";
import CarrouselBanner from "@/app/components/carousel/page";

export default function Page() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [userId, setUserId] = useState<User['_id'] | null>(null);
  const [favorites, setFavorites] = useState<{ _id?: string, products?: string[] }>({});

  useEffect(() => {
    const userId = getUser()?._id;
    setUserId(userId);
    getFavoritesProducts();
  }, []);

  const getFavoritesProducts = () => {
    FavoriteProductService.getAllFavorites().then(({ data }: { data: FavoriteProduct[] }) => {
      const myFavorites = data.filter((favorite: FavoriteProduct) => (favorite.user_id as User)?._id === getUser()?._id);
      const mappedFavorites = myFavorites.map((favorite: FavoriteProduct) => ({
        _id: favorite?._id,
        products: favorite.products?.map((product: any) => product._id)
      }));
      setFavorites(mappedFavorites[0] as any);
    });
  };

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await ProductService.getProductById(id as string);
          setProduct(response.data);

          const suggestedProducts = await ProductService.getAllProducts();
          setSuggestions(suggestedProducts.data.filter((p: any) => p.id !== id));
        } catch (error) {
          console.error("Erreur lors du chargement du produit :", error);
        }
      };

      fetchProduct();
    }
  }, [id]);

  if (!product) {
    return <p className="text-center text-gray-500">Chargement du produit...</p>;
  }

  const addToCart = () => {
    OrderService.getAllOrders().then(({ data }) => {
      const existingOrder = data.find((order: Order) => (order.user_id as User)?._id === userId && order.status === 'pending');
      const newOrderItem = {
        product_id: product._id,
        quantity: 1,
        user_id: userId as string
      };
      if (existingOrder) {
        OrderService.addItemToOrder({ ...newOrderItem, order_id: existingOrder._id }).then(() => {
          router.push('/cart');
        });
      } else {
        OrderService.addItemToOrder(newOrderItem).then(() => {
          router.push('/cart');
        });
      }
    });
  };

  const toggleFavorite = () => {
    const userId = getUser()?._id;
    if (!favorites?._id) {
      FavoriteProductService.createFavorite({
        user_id: userId,
        products: [product?._id as string]
      }).then(() => {
        getFavoritesProducts();
      });
    } else {
      if (favorites?.products?.includes(product?._id)) {
        const newFavorite = {
          _id: favorites?._id,
          products: favorites?.products?.filter((p: any) => p !== product?._id)
        };
        FavoriteProductService.updateFavorite(newFavorite).then(() => {
          getFavoritesProducts();
        });
      } else {
        const newFavorite = {
          _id: favorites?._id,
          products: [...(favorites?.products as []), product?._id]
        };
        FavoriteProductService.updateFavorite(newFavorite).then(() => {
          getFavoritesProducts();
        });
      }
    }
  };

  return (
      <div className="container mx-auto mb-8 mt-12">
        {/* Nom du produit */}
        <h1 className="text-center text-4xl font-bold mb-12 text-easyorder-black">{product.name}</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Carousel */}
          <div className="w-full lg:w-1/2">
            <img src={product.image || "https://via.placeholder.com/400x300"} alt={product.name} className="w-full h-auto rounded-lg shadow-md" />
          </div>

          {/* Détails du produit */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-easyorder-black">Catégories</h2>
                  <p className="text-gray-700">
                    {product.categories && product.categories.length > 0
                        ? product.categories.map((cat: any) => cat.name).join(', ')
                        : 'Aucune catégorie'}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-easyorder-black">Description</h2>
                  <p className="text-gray-700">{product.description}</p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-easyorder-black">Dimensions</h2>
                  <p className="text-gray-700">{product.dimensions}</p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-easyorder-black">Prix</h2>
                  <p className="text-gray-700">{(product.price_in_cent / 100).toFixed(2)} €</p>
                </div>
            </div>

            {/* Boutons avec redirections */}
            <div className="flex space-x-4">
              <button onClick={toggleFavorite} className="text-red-500 transition-transform transform hover:scale-110">
                {favorites?.products?.includes(product._id) ? <FaHeart size={32} /> : <FaRegHeart size={32} />}
              </button>

              <Link href={`/chat?user=${product?.artisan_id}`}>
                <button className="bg-easyorder-black text-white px-4 py-2 rounded shadow hover:bg-easyorder-gray transition">Contacter l'artisan</button>
              </Link>

              <button
                  onClick={addToCart}
                  className="flex items-center bg-easyorder-green text-white px-4 py-2 rounded shadow hover:bg-easyorder-black transition">
                <FaShoppingCart size={20} className="mr-2" />
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>

        {/* Suggestions de produits */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-easyorder-black">Suggestions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestions.length > 0 ? (
                suggestions.map((suggestedProduct) => (
                    <div key={suggestedProduct._id} className="flex flex-col items-center bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                      <img src={suggestedProduct.image || "https://via.placeholder.com/200"} alt={suggestedProduct.name} className="w-full h-auto mb-2 rounded-lg" />
                      <p className="text-lg font-semibold">{suggestedProduct.name}</p>
                      <p className="text-gray-700">{(suggestedProduct.price_in_cent / 100).toFixed(2)} €</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">Aucune suggestion disponible</p>
            )}
          </div>
        </div>
      </div>
  );
}
