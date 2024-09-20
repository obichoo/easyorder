'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
    FaUserCircle,
    FaSearch,
    FaShoppingCart,
    FaBars,
    FaTimes,
    FaHeart,
    FaHome,
    FaComments,
    FaUsers
} from 'react-icons/fa'; // Importation d'icônes
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // État pour la recherche
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // État pour le menu mobile
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
    }, [dropdownRef]);

    // Fonction de gestion de la recherche
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
        } else {
            router.push('/search');
        }
    };

    return (
        <div className="bg-[#e7e6e6] border-b border-gray-300 p-4">
            <nav className="container mx-auto flex justify-between items-center">
                {/* Logo et Titre */}
                <div className="flex items-center">
                    <img src="/logo.png" alt="Logo Easyorder"
                         className="h-12 md:h-16 mr-4 rounded-full border-2 border-[#032035] shadow-lg"/>
                    <h1 className="lg:block hidden text-xl md:text-2xl font-semibold text-[#032035]">EasyOrder</h1>
                </div>

                {/* Liens de navigation pour grand écran */}
                <ul className="hidden md:flex space-x-8 text-lg">
                    <li>
                        <Link href="/home"
                              className="text-[#032035] hover:text-[#77ad86] transition duration-200 ease-in-out">
                            <FaHome className="md:inline-block xl:hidden" size={20}/>
                            <span className="hidden xl:inline-block">Accueil</span>
                        </Link>
                    </li>
                    {isLoggedIn && (
                        <>
                            <li>
                                <Link href="/favorites"
                                      className="text-[#032035] hover:text-[#77ad86] transition duration-200 ease-in-out">
                                    <FaHeart className="md:inline-block xl:hidden" size={20}/>
                                    <span className="hidden xl:inline-block">Mes favoris</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/chat"
                                      className="text-[#032035] hover:text-[#77ad86] transition duration-200 ease-in-out">
                                    <FaComments className="md:inline-block xl:hidden" size={20}/>
                                    <span className="hidden xl:inline-block">Messagerie</span>
                                </Link>
                            </li>
                        </>
                    )}
                    <li>
                        <Link href="/artisans"
                              className="text-[#032035] hover:text-[#77ad86] transition duration-200 ease-in-out">
                            <FaUsers className="md:inline-block xl:hidden" size={20}/>
                            <span className="hidden xl:inline-block">Artisans</span>
                        </Link>
                    </li>
                </ul>

                {/* Barre de recherche */}
                <form onSubmit={handleSearch} className="relative flex items-center w-60">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} // Mettre à jour la requête de recherche
                        placeholder="Rechercher un produit..."
                        className="border border-gray-300 rounded-full py-2 pl-4 pr-10 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#77ad86] transition"
                    />
                    <button type="submit" className="absolute right-2 top-2 text-gray-500">
                        <FaSearch size={18} className="text-[#032035]" />
                    </button>
                </form>

                {/* Section utilisateur pour grand écran */}
                <div className="hidden md:flex items-center space-x-4">
                    {isLoggedIn && user ? (
                        <>
                            <Link href="/cart">
                                <FaShoppingCart size={20} className="text-[#032035] hover:text-[#77ad86] transition duration-200 ease-in-out" />
                            </Link>
                            <div className="relative" ref={dropdownRef}>
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
                                    <span className="ml-2 font-medium hidden xl:inline-block">{user.name}</span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                                        <ul className="py-2">
                                            <li>
                                                <Link
                                                    href="/my-account"
                                                    className="block px-4 py-2 text-[#032035] hover:bg-[#77ad86] hover:text-white transition duration-200 ease-in-out"
                                                >
                                                    {
                                                        user.role === 'artisan' ? 'Mon entreprise' : 'Mon compte'
                                                    }
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

                {/* Menu Burger pour mobile */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-[#032035] focus:outline-none"
                    >
                        {isMobileMenuOpen ? <FaTimes size={32} /> : <FaBars size={32} />}
                    </button>
                </div>
            </nav>

            {/* Menu mobile */}
            {isMobileMenuOpen && (
                <div className="md:hidden flex flex-col items-center space-y-4 mt-4">
                    <ul className="space-y-4 text-lg">
                        <li>
                            <Link href="/home"
                                  className="text-[#032035] hover:text-[#77ad86] flex items-center gap-2 transition duration-200 ease-in-out">
                                <FaHome size={20}/> Accueil
                            </Link>
                        </li>
                        {isLoggedIn && (
                            <>
                                <li>
                                    <Link href="/favorites"
                                          className="text-[#032035] hover:text-[#77ad86] flex items-center gap-2 transition duration-200 ease-in-out">
                                        <FaHeart size={20}/> Favoris
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/chat"
                                          className="text-[#032035] hover:text-[#77ad86] flex items-center gap-2 transition duration-200 ease-in-out">
                                        <FaComments size={20}/> Messagerie
                                    </Link>
                                </li>
                            </>
                        )}
                        <li>
                            <Link href="/artisans"
                                  className="text-[#032035] hover:text-[#77ad86] flex items-center gap-2 transition duration-200 ease-in-out">
                                <FaUsers size={20}/> Artisans
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navbar;
