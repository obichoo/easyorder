"use client";

import Link from 'next/link';
import { useState } from 'react';
import { FaUserCircle, FaSearch } from 'react-icons/fa'; // Icônes utilisateur et loupe

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div className={'bg-gray-100 border-b border-gray-300 p-4'}>
            <nav className="container flex justify-between items-center">
                <div className="flex items-center">
                    <img src="/logo.png" alt="Logo Easyorder"
                         className="h-16 mr-3 rounded-full border-2 border-teal-500"/>
                    <h1 className="text-xl font-semibold">EasyOrder</h1>
                </div>

                <ul className="flex space-x-8 text-lg">
                    <li>
                        <Link href="/" className="text-gray-700 hover:text-gray-900">Accueil</Link>
                    </li>
                    <li>
                        <Link href="/artisans" className="text-gray-700 hover:text-gray-900">Les artisans</Link>
                    </li>
                    <li>
                        <Link href="/favorites" className="text-gray-700 hover:text-gray-900">Mes favoris</Link>
                    </li>
                    <li>
                        <Link href="/chat" className="text-gray-700 hover:text-gray-900">Messagerie</Link>
                    </li>
                </ul>

                {/* Barre de recherche centrée */}
                <div className="relative flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Rechercher un bien..."
                        className="border border-gray-300 rounded-full py-2 px-4 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <FaSearch className="text-gray-500"/>
                </div>

                {/* Section utilisateur avec icône */}
                <div className="flex items-center space-x-4">
                    <FaUserCircle size={40} className="text-gray-700"/>
                    {isLoggedIn ? (
                        <Link href="/profil" className="text-gray-700 hover:text-gray-900">
                            Mon profil
                        </Link>
                    ) : (
                        <div>
                            <Link href="/login" className="text-gray-700 hover:text-gray-900">
                                Se connecter
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
