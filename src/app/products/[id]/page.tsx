'use client';

import React, { useEffect, useState } from 'react';
import {FaEdit, FaHeart, FaRegHeart, FaShoppingCart} from 'react-icons/fa';
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
import Carousel, {CarouselSlide} from "@/app/components/carousel/page";

export default function Page() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [userId, setUserId] = useState<User['_id'] | null>(null);
  const [favorites, setFavorites] = useState<{ _id?: string, products?: string[] }>({});
  const [slides, setSlides] = useState<CarouselSlide[]>([]);

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

  const fetchProduct = async () => {
    try {
      const response = await ProductService.getProductById(id as string);
      setProduct(response.data);

      const suggestedProducts = await ProductService.getAllProducts();
      const shuffleArray = (array: any[]) => {
        return array.sort(() => Math.random() - 0.5);
      };
      setSuggestions(shuffleArray(suggestedProducts.data.filter((p: any) => p.id !== id)).splice(0, 4));
    } catch (error) {
      console.error("Erreur lors du chargement du produit :", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      const slides = product.pictures?.map((picture: any) => ({
        src: picture.url,
        alt: product.name,

      })) || [];
      setSlides(slides);
    }
  }, [product]);

  if (!product) {
    return <p className="text-center text-easyorder-black text-2xl font-bold mt-40">Chargement du produit...</p>;
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
        <div className="w-2/3 mx-auto">
          <h1 className="text-center text-4xl font-bold mb-12 text-easyorder-black">{product.name}</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Carousel */}
          <div className="w-full lg:w-1/2">
            <Carousel slides={slides} options={{loop: true}} slidesPerView={1} slidesHeight={'300px'} slidesSpacing={'2rem'} />
          </div>

          {/* Détails du produit */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <div className="space-y-2">
              <div>
                <h2 className="text-xl font-semibold text-easyorder-black">Description</h2>
                <p className="text-gray-700">{product.description}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-easyorder-black">Catégories</h2>
                <p className="text-gray-700">
                  {product.categories && product.categories.length > 0
                      ? product.categories.map((cat: any) => cat.name).join(', ')
                      : 'Aucune catégorie'}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-easyorder-black">Dimensions</h2>
                <p className="text-gray-700">{product.dimensions || 'Pas de dimensions renseignées'}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-easyorder-black">Prix</h2>
                <p className="text-gray-700">{(product.price_in_cent / 100).toFixed(2)} €</p>
              </div>
            </div>

            {/* Boutons avec redirections */}
            <div className="flex space-x-4">
              <button onClick={toggleFavorite} className="text-red-500 transition-transform transform hover:scale-110">
                {favorites?.products?.includes(product._id) ? <FaHeart size={32}/> : <FaRegHeart size={32}/>}
              </button>

              <Link href={`/chat?user=${product?.artisan_id}`}>
                <button
                    className="bg-easyorder-black text-white px-4 py-2 rounded shadow hover:bg-black transition">Contacter
                  l'artisan
                </button>
              </Link>

              <button
                  onClick={addToCart}
                  className="flex items-center bg-easyorder-green text-white px-4 py-2 rounded shadow hover:bg-easyorder-black transition">
                <FaShoppingCart size={20} className="mr-2"/>
                Ajouter au panier
              </button>

              {
                userId === product?.artisan_id &&
                <Link href={`/products/edit/${product?._id}`}>
                  <button className="bg-easyorder-gray text-easyorder-black px-4 py-2 rounded shadow hover:bg-easyorder-black hover:text-white transition flex">
                    <FaEdit size={20} className="mr-2"/>
                    Modifier ce produit
                  </button>

                </Link>
              }
            </div>
          </div>
        </div>

        {/* Suggestions de produits */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-easyorder-black">Suggestions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {suggestions?.length ? suggestions?.map((product: any) => (
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
                  <p className="text-gray-600 mb-2">
                    {(product?.description as string).substring(0, 60)}
                    {(product?.description as string).length > 59 && '...'}
                  </p>
                  <p className="text-easyorder-black font-semibold">Prix
                    : {((product?.price_in_cent as number) / 100).toFixed(2)} €</p>
                </Link>
            )
            ):
            (<p className="text-center text-lg text-easyorder-black">
              Aucun produit trouvé.
            </p>)
            }
          </div>
        </div>
      </div>
  );
}
