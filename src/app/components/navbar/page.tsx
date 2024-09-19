'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();

    const fetchUserFromLocalStorage = () => {
        const storedData = localStorage.getItem("user");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData) {
                setUser(parsedData);
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

    useEffect(() => {
        fetchUserFromLocalStorage();
    }, [pathname]);

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
        <div className="bg-[#e7e6e6] border-b border-gray-300 p-6 shadow-md">
            <nav className="container mx-auto flex justify-between items-center">
                {/* Logo et Titre */}
                <div className="flex items-center">
                    <img src="/logo.png" alt="Logo Easyorder"
                         className="h-16 mr-4 rounded-full border-2 border-[#032035] shadow-lg"/>
                    <h1 className="text-2xl font-semibold text-[#032035]">EasyOrder</h1>
                </div>

                {/* Liens de navigation */}
                <ul className="hidden md:flex space-x-8 text-lg">
                    <li>
                        <Link href="/home" className="text-[#032035] hover:text-[#77ad86] transition duration-200 ease-in-out">
                            Accueil
                        </Link>
                    </li>
                    <li>
                        <Link href="/artisans" className="text-[#032035] hover:text-[#77ad86] transition duration-200 ease-in-out">
                            Les artisans
                        </Link>
                    </li>
                    {isLoggedIn && (
                        <>
                            <li>
                                <Link href="/favorites" className="text-[#032035] hover:text-[#77ad86] transition duration-200 ease-in-out">
                                    Mes favoris
                                </Link>
                            </li>
                            <li>
                                <Link href="/chat" className="text-[#032035] hover:text-[#77ad86] transition duration-200 ease-in-out">
                                    Messagerie
                                </Link>
                            </li>
                        </>
                    )}
                </ul>

                {/* Barre de recherche */}
                <div className="relative flex items-center space-x-3 w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Rechercher un bien..."
                        className="border border-gray-300 rounded-full py-2 px-4 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#77ad86] transition"
                    />
                    <FaSearch size={32} className="text-[#032035]"/>
                </div>

                {/* Section utilisateur */}
                <div className="relative flex items-center space-x-4">
                    {isLoggedIn && user ? (
                        <>
                            <Link href="/cart" className="hidden md:block">
                                <FaShoppingCart size={32} className="text-[#032035] hover:text-[#77ad86] transition duration-200 ease-in-out" />
                            </Link>
                            <div className="relative flex items-center" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="text-[#032035] hover:text-[#77ad86] flex items-center transition duration-200 ease-in-out"
                                >
                                    {user.profile_pic ? (
                                        <img
                                            src={user.profile_pic}
                                            alt="Photo de profil"
                                            className="w-10 h-10 rounded-full object-cover shadow-md"
                                        />
                                    ) : (
                                        <FaUserCircle size={40} className="text-[#032035]" />
                                    )}
                                    <span className="ml-2 font-medium hidden md:block">
                                        {user.name}
                                    </span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                                        <ul className="py-2">
                                            <li>
                                                <Link
                                                    href={user.role === 'artisan' ? "/my-account/shopkeeper" : "/my-account/customer"}
                                                    className="block px-4 py-2 text-[#032035] hover:bg-[#77ad86] hover:text-white transition duration-200 ease-in-out"
                                                >
                                                    Mon profil
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/history" className="block px-4 py-2 text-[#032035] hover:bg-[#77ad86] hover:text-white transition duration-200 ease-in-out">
                                                    Historique
                                                </Link>
                                            </li>
                                            {user.role === 'artisan' && (
                                                <li>
                                                    <Link href="/stock" className="block px-4 py-2 text-[#032035] hover:bg-[#77ad86] hover:text-white transition duration-200 ease-in-out">
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
                                                        localStorage.removeItem("user");
                                                        router.push('/home');
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-[#032035] hover:bg-[#77ad86] hover:text-white transition duration-200 ease-in-out"
                                                >
                                                    Déconnexion
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link href="/login" className="text-[#032035] hover:text-[#77ad86] transition duration-200 ease-in-out">
                            Se connecter
                        </Link>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
