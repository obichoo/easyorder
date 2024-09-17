'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';

export default function ArtisansList() {
  const artisans = [
    {
      id: 1,
      logo: '/path/to/logo1.png',
      name: 'Entreprise 1',
      address: '123 Rue des Artisans, Ville, Pays',
    },
    {
      id: 2,
      logo: '/path/to/logo2.png',
      name: 'Entreprise 2',
      address: '456 Avenue du Travail, Ville, Pays',
    },
    {
      id: 3,
      logo: '/path/to/logo3.png',
      name: 'Entreprise 3',
      address: '789 Boulevard de la Création, Ville, Pays',
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');

  // Fonction pour filtrer les artisans en fonction de la recherche
  const filteredArtisans = artisans.filter((artisan) =>
    artisan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto mt-12">
        <h1 className="text-3xl font-bold text-center mb-8">Les Artisans</h1>

        {/* Barre de recherche */}
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

        {/* Grid des artisans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredArtisans.length > 0 ? (
            filteredArtisans.map((artisan) => (
              <Link key={artisan.id} href={`/detailsArtisan/${artisan.id}`} passHref>
                <div className="bg-white shadow-lg rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition">
                  {/* Logo de l'artisan */}
                  <img
                    src={artisan.logo}
                    alt={`Logo de ${artisan.name}`}
                    className="w-24 h-24 mx-auto rounded-full mb-4"
                  />
                  {/* Nom */}
                  <h2 className="text-xl font-semibold mb-2">{artisan.name}</h2>
                  {/* Adresse */}
                  <p className="text-gray-600">{artisan.address}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">Aucun artisan trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
}
