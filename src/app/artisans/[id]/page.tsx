'use client';

import { FaInstagram, FaSnapchat, FaTwitter, FaGlobe, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import UserService from '@/services/user.service'; 
import ProductService from '@/services/product.service'; 
import CommentService from '@/services/comment.service';
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Link from "next/link";

// Fonction pour afficher les étoiles en fonction de la note
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
  const router = useRouter();
  const { id } = params;
  const [artisan, setArtisan] = useState<any>(null);
  const [products, setProducts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchArtisanById(id);
    fetchProductsByArtisanId(id);
    fetchCommentsByRecipientId(id);
  }, [])

  // Fonction pour récupérer un artisan par ID
  const fetchArtisanById = (id: string) => {
    try {
      UserService.getUserById(id).then((response) => {
        setArtisan(response.data);
      })
    } catch (error) {
      console.error("Erreur lors de la récupération de l'artisan :", error);
      return null;
    }
  }

// Fonction pour récupérer tous les produits et filtrer par ID d'artisan
  const fetchProductsByArtisanId = (artisanId: string) => {
    try {
      ProductService.getAllProducts().then((response) => {
        const products = response.data.filter((product: any) => product.artisan_id === artisanId);
        setProducts(products);
      })
      return products;
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
      return [];
    }
  }

// Fonction pour récupérer les commentaires filtrés par recipient_id
  const fetchCommentsByRecipientId = (recipientId: string) => {
    try {
      CommentService.getAllComments().then((response) => {
        const comments = response.data.filter((comment: any) => comment.recipient_id === recipientId);
        setComments(comments);
      })
    } catch (error) {
      console.error("Erreur lors de la récupération des commentaires :", error);
      return [];
    }
  }
  
  if (!artisan) {
    return <div>Artisan non trouvé.</div>;
  }

  const goToProduct = (productId: string) => {
    router.push(`/products/${productId}`);
  }

  return (
    <div>
      <div className="w-full h-44 bg-gray-400 overflow-hidden flex items-center">
        <img
          src={artisan.banner || artisan.profile_pic}
          alt={`Bannière de ${artisan.name}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto mt-6 flex items-center justify-center">
        <img
          src={artisan.profile_pic}
          alt={`Logo de ${artisan.name}`}
          className="w-24 h-24 mr-4 rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold">{artisan.name}</h1>
          <p className="text-gray-600 text-sm">{artisan.company?.denomination || artisan.company || artisan.address}</p>
          <p className="text-lg mt-4">{artisan.description}</p>
        </div>
      </div>

      <div className="container mx-auto mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-center">Nos Produits</h2>
        <div className="flex overflow-x-auto space-x-4 p-4">
          {products.length > 0 ? (
            products.map((product: any) => (
              <Link className="min-w-[200px] p-4 bg-white shadow-md rounded-lg cursor-pointer" href={`/products/${product?._id}`} key={product.id}>
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-2" />
                  <p className="text-center font-semibold">{product.name}</p>
                  <p className="text-center text-gray-500">{(product.price_in_cent / 100).toFixed(2)} €</p>
              </Link>
            ))
          ) : (
            <p className="text-center w-full text-gray-500">Pas de produits disponibles.</p>
          )}
        </div>
      </div>

      <div className="container mx-auto mt-12 mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-center">Avis Clients</h2>
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment: any, index: number) => (
              <div key={index} className="p-4 bg-white shadow-md rounded-lg">
                <p className="font-semibold">{comment.sender_id?.name || comment.sender_id}</p>
                <RatingStars rating={comment.rate} />
                <p className="mt-2">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-center w-full text-gray-500">Aucun avis disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
}
