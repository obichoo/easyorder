'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import UserService from '@/services/user.service'; // Import du service

export default function ArtisansList() {
  const [artisans, setArtisans] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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

  const filteredArtisans = artisans.filter((artisan) =>
    artisan.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto mt-12">
        <h1 className="text-3xl font-bold text-center mb-8">Les Artisans</h1>

        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Rechercher un artisan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring focus:ring-easyorder-green"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <p className="text-center">Chargement des artisans...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredArtisans.length > 0 ? (
              filteredArtisans.map((artisan) => (
                <Link key={artisan._id} href={`/artisans/${artisan._id}`} passHref>
                  <div className="bg-white shadow-lg rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition">
                    <img
                      src={artisan.profile_pic}
                      alt={`Logo de ${artisan.name}`}
                      className="w-24 h-24 mx-auto rounded-full mb-4"
                    />
                    <h2 className="text-xl font-semibold mb-2">{artisan.name}</h2>
                    <p className="text-gray-600">{artisan.company?.denomination || artisan.company}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center col-span-3 text-gray-500">Aucun artisan trouvé.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
