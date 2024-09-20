'use client';

import {
  FaInstagram,
  FaSnapchat,
  FaTwitter,
  FaGlobe,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaHeart,
  FaRegHeart
} from 'react-icons/fa';
import UserService from '@/services/user.service';
import ProductService from '@/services/product.service';
import CommentService from '@/services/comment.service';
import { useEffect, useState } from "react";
import Link from "next/link";
import FavoriteVendorService from "@/services/favorite-vendor.service";
import getUser from "@/utils/get-user";
import {FavoriteVendor} from "@/models/favorite-vendor.model";
import {User} from "@/models/user.model";

const RatingStars = ({ rating }: any) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
            <FaStar key={`full-${i}`} className="text-yellow-500" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-yellow-500" />}
        {[...Array(emptyStars)].map((_, i) => (
            <FaRegStar key={`empty-${i}`} className="text-yellow-500" />
        ))}
      </div>
  );
};

export default function Page({ params }: any) {
  const { id } = params;
  const [artisan, setArtisan] = useState<any>(null);
  const [products, setProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [favorites, setFavorites] = useState<{
    _id?: string,
    vendor?: string[]
  }>({});

  useEffect(() => {
    fetchArtisanById(id);
    fetchProductsByArtisanId(id);
    fetchCommentsByRecipientId(id);
    getFavoritesVendors()
  }, []);

  const getFavoritesVendors = () => {
    FavoriteVendorService.getAllFavorites().then(({data}: {data: FavoriteVendor[]}) => {
      const myFavorites = data.filter((favorite: FavoriteVendor) => (favorite.user_id as User)?._id === getUser()?._id)
      const mappedFavorites = myFavorites.map((favorite: FavoriteVendor) => ({
        _id: favorite?._id,
        vendor: favorite.vendor?.map((vendor: any) => vendor._id)
      }))
      setFavorites(mappedFavorites[0] as any)
    })
  }

  // Récupérer un artisan par ID
  const fetchArtisanById = async (id: string) => {
    try {
      const response = await UserService.getUserById(id);
      setArtisan(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'artisan :", error);
    }
  };

  // Récupérer tous les produits de l'artisan
  const fetchProductsByArtisanId = async (artisanId: string) => {
    try {
      const response = await ProductService.getAllProducts();
      const filteredProducts = response.data.filter((product: any) => product.artisan_id === artisanId);
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    }
  };

  // Récupérer les commentaires de l'artisan
  const fetchCommentsByRecipientId = async (recipientId: string) => {
    try {
      const response = await CommentService.getAllComments();
      const filteredComments = response.data.filter((comment: any) => comment.recipient_id === recipientId);
      setComments(filteredComments);
    } catch (error) {
      console.error("Erreur lors de la récupération des commentaires :", error);
    }
  };

  if (!artisan) {
    return <div className="text-center text-gray-600 py-16">Artisan non trouvé.</div>;
  }

  const toggleFavorite = () => {
    const userId = getUser()?._id;
    if (!favorites?._id) {
        FavoriteVendorService.createFavorite({
            user_id: userId,
            vendor: [artisan?._id as string]
        }).then(() => {
            getFavoritesVendors()
        })
    } else {
      if (favorites?.vendor?.includes(artisan?._id)) {
        const newFavorite = {
          _id: favorites?._id,
          vendor: favorites?.vendor?.filter((vendor: any) => vendor !== artisan?._id)
        }
        FavoriteVendorService.updateFavorite(newFavorite).then(() => {
            getFavoritesVendors()
        })
      } else {
        const newFavorite = {
          _id: favorites?._id,
          vendor: [...(favorites?.vendor as []), artisan?._id]
        }
        FavoriteVendorService.updateFavorite(newFavorite).then(() => {
            getFavoritesVendors()
        })
      }
    }
  }

  return (
      <div>
        {/* Bannière de l'artisan */}
        <div
            className="relative w-full h-64 lg:h-96 overflow-hidden flex items-center justify-center bg-easyorder-gray">
          <img
              src={artisan.banner || artisan.profile_pic}
              alt={`Bannière de ${artisan.name}`}
              className="w-full h-full object-cover filter brightness-75 rounded-b-2xl"
          />
          <div className="absolute left-6 bottom-6 flex items-end">
            <img
                src={artisan.profile_pic}
                alt={`Profil de ${artisan.name}`}
                className="w-32 h-32 lg:w-48 lg:h-48 rounded-full shadow-lg border-4 border-easyorder-green object-cover"
            />

            <button onClick={toggleFavorite} className="bg-transparent text-red-700 px-4 py-2 rounded-md transition">
              {
                (favorites?.vendor as any)?.includes(artisan._id) ? (
                    <FaHeart size={32} className="text-red-500"></FaHeart>
                ) : (
                    <FaRegHeart size={32} className="text-red-500"></FaRegHeart>
                )
              }
            </button>
          </div>
          <div className="absolute text-white text-center">
            <h1 className="text-4xl lg:text-6xl font-bold">{artisan.name}</h1>
            <p className="mt-2">{artisan.company?.denomination || artisan.company || artisan.address}</p>
          </div>
        </div>

        {/* Informations sur l'artisan */}
        {/*<div className="container mx-auto mt-12 text-center lg:text-left px-4">*/}
        {/*  <div className="text-lg lg:text-xl">*/}
        {/*    <p className="text-gray-700">{artisan.description}</p>*/}
        {/*      <div className="mt-4 flex justify-center lg:justify-start space-x-6">*/}
        {/*        {artisan.social?.instagram && (*/}
        {/*            <a href={artisan.social.instagram} className="text-gray-500 hover:text-pink-500">*/}
        {/*              <FaInstagram size={24} />*/}
        {/*            </a>*/}
        {/*        )}*/}
        {/*        {artisan.social?.snapchat && (*/}
        {/*            <a href={artisan.social.snapchat} className="text-gray-500 hover:text-yellow-500">*/}
        {/*              <FaSnapchat size={24} />*/}
        {/*            </a>*/}
        {/*        )}*/}
        {/*        {artisan.social?.twitter && (*/}
        {/*            <a href={artisan.social.twitter} className="text-gray-500 hover:text-blue-500">*/}
        {/*              <FaTwitter size={24} />*/}
        {/*            </a>*/}
        {/*        )}*/}
        {/*        {artisan.website && (*/}
        {/*            <a href={artisan.website} className="text-gray-500 hover:text-green-500">*/}
        {/*              <FaGlobe size={24} />*/}
        {/*            </a>*/}
        {/*        )}*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*</div>*/}

        {/* Produits de l'artisan */}
        <div className="container mx-auto mt-12">
          <h2 className="text-3xl font-semibold mb-6 text-center text-[#032035]">Produits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length > 0 ? (
                products.map((product: any) => (
                    <Link key={product._id} href={`/products/${product._id}`} passHref>
                      <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition p-6 cursor-pointer">
                        <img
                            src={product.pictures?.[0]?.url || 'https://via.placeholder.com/150'}
                            alt={product.name}
                            className="w-full h-40 object-cover rounded-md mb-4"
                        />
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-500">{(product.price_in_cent / 100).toFixed(2)} €</p>
                      </div>
                    </Link>
                ))
            ) : (
                <p className="text-center text-gray-500 col-span-3">Pas de produits disponibles.</p>
            )}
          </div>
        </div>

        {/* Avis clients */}
        <div className="container mx-auto mt-12 mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-center text-[#032035]">Avis clients</h2>
          <div className="space-y-6">
            {comments.length > 0 ? (
                comments.map((comment: any, index: number) => (
                    <div key={index} className="bg-white shadow-lg rounded-lg p-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{comment.sender_id?.name || comment.sender_id}</p>
                        <RatingStars rating={comment.rate} />
                      </div>
                      <p className="mt-4 text-gray-700">{comment.content}</p>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">Aucun avis disponible.</p>
            )}
          </div>
        </div>
      </div>
  );
}
