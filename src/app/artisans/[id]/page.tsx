'use client';

import {
  FaInstagram,
  FaTwitter,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaHeart,
  FaRegHeart, FaTiktok, FaFacebook
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
import Title from "@/app/components/title/page";

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
    return <div className="text-center  py-16">Artisan non trouvé.</div>;
  }

  const toggleFavorite = () => {
    const userId = getUser()?._id;
    if (!favorites?._id) {
        FavoriteVendorService.createFavorite({
            user_id: userId as any,
            vendor: [artisan?._id] as any
        }).then(() => {
            getFavoritesVendors()
        })
    } else {
      if (favorites?.vendor?.includes(artisan?._id)) {
        FavoriteVendorService.updateFavorite(favorites?._id, favorites?.vendor?.filter((vendor: any) => vendor?._id !== artisan?._id)).then(() => {
            getFavoritesVendors()
        })
      } else {
        FavoriteVendorService.updateFavorite(favorites?._id, [...(favorites?.vendor as []), artisan?._id]).then(() => {
            getFavoritesVendors()
        })
      }
    }
  }

  return (
      <div>
        {/* Bannière de l'artisan */}
        <div
            className="relative w-full h-52 lg:h-72 overflow-hidden flex items-center justify-center bg-easyorder-gray">
          <img
              src={artisan?.company?.banner_pic || 'https://via.placeholder.com/150'}
              alt={`Bannière de ${artisan?.name}`}
              className="w-full h-full object-cover filter brightness-50 rounded-b-2xl"
          />
          <div className="absolute left-6 bottom-6 flex items-end">
            <img
                src={artisan?.company?.profile_pic}
                alt={`Profil de ${artisan.name}`}
                className="w-20 h-20 lg:w-20 lg:h-20 rounded-full shadow-lg object-cover"
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
            <Title>{artisan.company?.denomination}</Title>
            <p className="text-white text-center mx-40">{artisan.description}</p>
          </div>
          <div className="absolute right-6 bottom-6">
            <div className="mt-4 flex justify-center lg:justify-start space-x-6">
                {artisan.social_network?.facebook && (
                    <a href={artisan.social_network.facebook} className="text-white">
                      <FaFacebook size={32}/>
                    </a>
                )}
                {artisan.social_network?.instagram && (
                    <a href={artisan.social_network.instagram} className="text-white">
                      <FaInstagram size={32}/>
                    </a>
                )}
                {artisan.social_network?.twitter && (
                    <a href={artisan.social_network.twitter} className="text-white">
                      <FaTwitter size={32}/>
                    </a>
                )}
                {artisan.social_network?.tiktok && (
                    <a href={artisan.social_network?.tiktok} className="text-white">
                      <FaTiktok size={32}/>
                    </a>
                )}
              </div>
          </div>
        </div>

        {/* Produits de l'artisan */}
        <div className="container mx-auto mt-12">
          <Title>Produits</Title>
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
                        <p className="">{(product.price_in_cent / 100).toFixed(2)} €</p>
                      </div>
                    </Link>
                ))
            ) : (
                <p className="text-center  col-span-3">Pas de produits disponibles.</p>
            )}
          </div>
        </div>

        {/* Avis clients */}
        <div className="container mx-auto mt-12 mb-12">
          <Title>Avis clients</Title>
          <div className="space-y-6">
            {comments.length > 0 ? (
                comments.map((comment: any, index: number) => (
                    <div key={index} className="bg-white shadow-lg rounded-lg p-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{comment.sender_id?.name || comment.sender_id}</p>
                        <RatingStars rating={comment.rate}/>
                      </div>
                      <p className="mt-4 ">{comment.content}</p>
                    </div>
                ))
            ) : (
                <p className="text-center ">Aucun avis disponible.</p>
            )}
          </div>
        </div>
      </div>
  );
}
