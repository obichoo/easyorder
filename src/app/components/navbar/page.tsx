'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // Import de useRouter

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter(); // Utiliser useRouter pour détecter les changements de route

    // Fonction pour récupérer l'utilisateur depuis le localStorage
    const fetchUserFromLocalStorage = () => {
        const storedData = localStorage.getItem("user");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            // Vérifier si les données contiennent un utilisateur
            if (parsedData && parsedData.user) {
                setUser(parsedData.user); // Utiliser les données de l'utilisateur
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        } else {
            setIsLoggedIn(false);
            setUser(null);
        }
    };

    // Utilisation de useEffect pour charger l'utilisateur à l'initialisation et à chaque changement de route
    useEffect(() => {
        fetchUserFromLocalStorage();
    }, [router]); // Dépendance au changement de route pour déclencher la mise à jour

    // Gérer le clic extérieur pour fermer le dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

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
                        <Link href="/home" className="text-gray-700 hover:text-gray-900">Accueil</Link>
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

                {/* Section utilisateur avec photo de profil ou icône */}
                <div className="relative flex items-center space-x-4">
                    {isLoggedIn && user ? (
                        <div className="relative flex items-center" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="text-gray-700 hover:text-gray-900 flex items-center"
                            >
                                {user.profile_pic ? (
                                    <img
                                        src={user.profile_pic}
                                        alt="Photo de profil"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <FaUserCircle size={40} className="text-gray-700" />
                                )}
                                {/* Affichage du nom de l'utilisateur */}
                                <span className="ml-2 text-gray-700 font-medium">
                                    {user.name}
                                </span>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                                    <ul className="py-1">
                                        <li>
                                            <Link
                                                href={user.role === 'artisant' ? "/my-account/shopkeeper" : "/my-account/customer"}
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                Mon profil
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/history" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                Historique
                                            </Link>
                                        </li>
                                        {user.role === 'artisant' && (
                                            <li>
                                                <Link href="/stock" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                    Gérer le stock
                                                </Link>
                                            </li>
                                        )}
                                        <li>
                                            <button
                                                onClick={() => {
                                                    setIsLoggedIn(false);
                                                    setUser(null);
                                                    setIsDropdownOpen(false);
                                                    localStorage.removeItem("user"); // Déconnexion
                                                    router.push('/home'); // Redirection vers la page d'accueil
                                                }}
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                Déconnexion
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
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
