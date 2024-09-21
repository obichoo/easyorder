'use client';

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import UserService from "@/services/user.service";
import ProductService from "@/services/product.service";
import { User } from "@/models/user.model";
import { Product } from "@/models/product.model";
import { useRouter } from "next/navigation";

const AdminPanel = () => {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentCategory, setCurrentCategory] = useState<"users" | "products">("users");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Nombre d'éléments par page

    // Recherche states
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Vérifier si l'utilisateur est bien un admin
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            if (parsedUser.role === 'admin') {
                setIsAdmin(true);
            } else {
                router.push('/home'); // Redirection si l'utilisateur n'est pas admin
            }
        } else {
            router.push('/login'); // Redirection si pas de user dans localStorage
        }
    }, [router]);

    // Fetch users and products on load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await UserService.getAllUsers();
                setUsers(userResponse.data);

                const productResponse = await ProductService.getAllProducts();
                setProducts(productResponse.data);

                setLoading(false);
            } catch (error) {
                console.error("Erreur lors du chargement des données :", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handle user deletion
    const handleDeleteUser = async (userId: string) => {
        try {
            await UserService.deleteUser(userId);
            setUsers(users.filter((user) => user._id !== userId));
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur :", error);
        }
    };

    // Handle product deletion
    const handleDeleteProduct = async (productId: string) => {
        try {
            await ProductService.deleteProduct(productId);
            setProducts(products.filter((product) => product._id !== productId));
        } catch (error) {
            console.error("Erreur lors de la suppression du produit :", error);
        }
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Filtrage des utilisateurs et des produits en fonction de la barre de recherche
    const filteredUsers = users.filter((user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredProducts = products.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (loading) {
        return <p className="text-center text-easyorder-black">Chargement des données...</p>;
    }

    // Si l'utilisateur n'est pas admin, on retourne un message en attendant la redirection
    if (!isAdmin) {
        return <p>Redirection en cours...</p>;
    }

    // Pagination component
    const Pagination = ({ totalItems, paginate }: { totalItems: number; paginate: (pageNumber: number) => void }) => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
            pageNumbers.push(i);
        }

        return (
            <nav>
                <ul className="flex justify-center space-x-2 mt-4">
                    {pageNumbers.map((number) => (
                        <li key={number}>
                            <button
                                onClick={() => paginate(number)}
                                className={`${currentPage == number ? 'bg-easyorder-black' : 'bg-easyorder-green'} text-white px-3 py-1 rounded-lg hover:bg-easyorder-black transition`}
                            >
                                {number}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        );
    };

    return (
        <div className="min-h-screen bg-easyorder-gray">
            <div className="container mx-auto py-8">
                <h1 className="text-4xl font-bold text-center text-easyorder-black mb-8">Panneau d'administration</h1>

                {/* Navigation par catégorie */}
                <div className="flex justify-center space-x-4 mb-8">
                    <button
                        onClick={() => {
                            setCurrentCategory("users");
                            setSearchTerm(''); // Réinitialise la barre de recherche
                        }}
                        className={`px-6 py-2 rounded-lg ${currentCategory === "users" ? "bg-easyorder-green" : "bg-easyorder-black text-white"} hover:bg-easyorder-green hover:text-white transition`}
                    >
                        Gérer les utilisateurs
                    </button>
                    <button
                        onClick={() => {
                            setCurrentCategory("products");
                            setSearchTerm(''); // Réinitialise la barre de recherche
                        }}
                        className={`px-6 py-2 rounded-lg ${currentCategory === "products" ? "bg-easyorder-green" : "bg-easyorder-black text-white"} hover:bg-easyorder-green hover:text-white transition`}
                    >
                        Gérer les produits
                    </button>
                </div>

                {/* Barre de recherche */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-easyorder-green"
                        placeholder={`Rechercher un ${currentCategory === 'users' ? 'utilisateur' : 'produit'}`}
                    />
                </div>

                {currentCategory === "users" && (
                    <section>
                        <h2 className="text-2xl font-semibold text-easyorder-black mb-4">Liste des utilisateurs</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg shadow-lg">
                                <thead className="bg-easyorder-green text-white">
                                <tr>
                                    <th className="py-4 px-6 text-left">Nom</th>
                                    <th className="py-4 px-6 text-left">Email</th>
                                    <th className="py-4 px-6 text-left">Rôle</th>
                                    <th className="py-4 px-6 text-left">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user._id} className="border-b border-easyorder-gray">
                                        <td className="py-4 px-6">{user.name}</td>
                                        <td className="py-4 px-6">{user.email}</td>
                                        <td className="py-4 px-6">{user.role}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex space-x-2">
                                                {/* Bouton modifier */}
                                                    <Link href={`/account?userId=${user._id}`} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                                                        {user.role === 'artisan' ? 'Modifier artisan' : 'Modifier client'}
                                                    </Link>
                                                {/* Bouton supprimer */}
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                                    onClick={() => handleDeleteUser(user._id as string)}
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <Pagination totalItems={filteredUsers.length} paginate={paginate}/>
                    </section>
                )}

                {currentCategory === "products" && (
                    <section>
                        <h2 className="text-2xl font-semibold text-easyorder-black mb-4">Liste des produits</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg shadow-lg">
                                <thead className="bg-easyorder-green text-white">
                                <tr>
                                    <th className="py-4 px-6 text-left">Nom du produit</th>
                                    <th className="py-4 px-6 text-left">Prix</th>
                                    <th className="py-4 px-6 text-left">Stock</th>
                                    <th className="py-4 px-6 text-left">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentProducts.map((product) => (
                                    <tr key={product._id} className="border-b border-easyorder-gray">
                                        {/* Lien vers la page du produit */}
                                        <td className="py-4 px-6">
                                            <Link href={`/products/${product._id}`} className="text-easyorder-black hover:underline">
                                                {product.name}
                                            </Link>
                                        </td>
                                        <td className="py-4 px-6">{(product.price_in_cent as number / 100).toFixed(2)} €</td>
                                        <td className="py-4 px-6">{product.stock}</td>
                                        <td className="py-4 px-6 space-x-2">
                                            {/* Bouton pour la page d'édition */}
                                            <button
                                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                                onClick={() => router.push(`/products/edit/${product._id}`)}
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                                onClick={() => handleDeleteProduct(product._id as string)}
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <Pagination totalItems={filteredProducts.length} paginate={paginate} />
                    </section>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
