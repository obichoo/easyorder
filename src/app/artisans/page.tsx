'use client';
import React, { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import {FaCheck, FaQuestion, FaSearch} from 'react-icons/fa';
import UserService from '@/services/user.service';
import { User } from "@/models/user.model";
import Title from "@/app/components/title/page";
import Loading from "@/app/components/loading/page";
import {ImCross} from "react-icons/im"; // Import du service

export default function ArtisansList() {
  const [artisans, setArtisans] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const response = await UserService.getAllArtisans();
        setArtisans(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des artisans :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);

  const filteredArtisans = artisans.filter((artisan: any) =>
      artisan?.company?.denomination?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="min-h-screen bg-easyorder-gray">
        <div className="container mx-auto py-12">
          <Title>
            Artisans
          </Title>

          {/* Barre de recherche */}
          <div className="flex justify-center mb-12">
            <div className="relative w-full max-w-md">
              <input
                  type="text"
                  placeholder="Rechercher un artisan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 pl-12 pr-4 border  rounded-full shadow focus:outline-none focus:ring-2 focus:ring-easyorder-green text-easyorder-black"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 " />
            </div>
          </div>

          {/* Liste des artisans */}
          {loading ? (
              <Loading />
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
                {filteredArtisans?.length > 0 ? (
                    filteredArtisans?.map((artisan: User) => (
                        <Link key={artisan._id} className="block h-full" href={`/artisans/${artisan._id}`} passHref>
                          <div className=" bg-white h-full shadow-lg rounded-lg p-6 text-center cursor-pointer hover:shadow-xl transition duration-300">
                            <div className="relative flex justify-center w-24 mx-auto mb-4">
                              <img
                                  src={artisan.company?.profile_pic}
                                  alt={`Photo de ${artisan?.company?.denomination}`}
                                  className="w-24 h-24 rounded-full shadow object-cover"
                              />
                              {
                                artisan.company?.etat == 'validé' ? (
                                    <span
                                        className="bg-green-500 text-white rounded-full p-1 text-xs absolute right-0 bottom-0 tooltip">
                                              <FaCheck/>
                                              <span className="tooltiptext">Entreprise vérifiée</span>
                                          </span>
                                ) : artisan.company?.etat == 'en attente' ? (
                                    <span
                                        className="bg-gray-500 text-white rounded-full block p-1 text-xs absolute right-0 bottom-0 tooltip">
                                              <FaQuestion/>
                                              <span className="tooltiptext">Entreprise en attente de vérification</span>
                                          </span>
                                ) : (
                                    <span
                                        className="bg-red-500 text-white rounded-full p-1 text-xs absolute right-0 bottom-0 tooltip">
                                              <ImCross/>
                                              <span className="tooltiptext">Entreprise non vérifiée</span>
                                          </span>
                                )
                              }
                            </div>
                            <p className="">
                              {(artisan.company?.denomination as ReactNode) || (artisan.company as ReactNode)}
                            </p>
                          </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-center col-span-3 ">Aucun artisan trouvé.</p>
                )}
              </div>
          )}
        </div>
      </div>
  );
}
