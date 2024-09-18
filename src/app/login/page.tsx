'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaSearch } from 'react-icons/fa';
import UserService from '@/services/user.service';
import {User} from "@/models/user.model";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fonction pour récupérer n'importe quel utilisateur
    const fetchAnyUser = async () => {
        try {
            const response = await UserService.getAllUsers();
            const users = response.data;

            if (users.length > 0) {
                setUser(users[0]);
                setIsLoggedIn(true); // Simule que l'utilisateur est connecté
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs', error);
            setIsLoggedIn(false);
        }
    };

    // Utilisation de useEffect pour récupérer un utilisateur à l'initialisation
    useEffect(() => {
        fetchAnyUser();
    }, []);

    // Handle outside click to close the dropdown
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

                {/* Section utilisateur avec icône */}
                <div className="relative flex items-center space-x-4">
                    {isLoggedIn && user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="text-gray-700 hover:text-gray-900 flex items-center"
                            >
                                <FaUserCircle size={40} className="text-gray-700"/>
                                <span className="ml-2">{user.name}</span> {/* Affiche le nom de l'utilisateur */}
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
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
                                                    setIsDropdownOpen(false);
                                                    // Log out functionality here
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
