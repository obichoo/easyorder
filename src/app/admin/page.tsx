'use client';

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import UserService from "@/services/user.service";
import ProductService from "@/services/product.service";
import { User } from "@/models/user.model";
import { Product } from "@/models/product.model";
import { useRouter } from "next/navigation";
import Title from "@/app/components/title/page";
import Loading from "@/app/components/loading/page";

const AdminPanel = () => {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [pendingArtisans, setPendingArtisans] = useState<User[]>([]); // Nouvel état pour les artisans en attente
    const [loading, setLoading] = useState(true);
    const [currentCategory, setCurrentCategory] = useState<"users" | "products" | "validations">("users");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Nombre d'éléments par page

    // Recherche states
    const [searchTerm, setSearchTerm] = useState('');

    // Sorting state
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    useEffect(() => {
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await UserService.getAllUsers();
                setUsers(userResponse.data);

                const productResponse = await ProductService.getAllProducts();
                setProducts(productResponse.data);

                // Filtrage des artisans avec état en attente
                const artisansEnAttente = userResponse.data.filter((user: User) => user.role === 'artisan' && user.company?.etat === 'en attente');
                setPendingArtisans(artisansEnAttente);

                setLoading(false);
            } catch (error) {
                console.error("Erreur lors du chargement des données :", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, currentCategory]);

    const handleValidateUser = async (user: any) => {
        try {
            await UserService.updateUser({
                ...user,
                company: {
                    ...user.company,
                    etat: "validé"
                }
            });
            setPendingArtisans(pendingArtisans.filter((u) => u._id !== user._id));
        } catch (error) {
            console.error("Erreur lors de la validation de l'utilisateur :", error);
        }
    };

    const handleRejectUser = async (user: any) => {
        try {
            await UserService.updateUser({
                ...user,
                company: {
                    ...user.company,
                    etat: "refusé"
                }
            });
            setPendingArtisans(pendingArtisans.filter((u) => u._id !== user._id));
        } catch (error) {
            console.error("Erreur lors du rejet de l'utilisateur :", error);
        }
    };

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

    // Sorting logic
    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredUsers = React.useMemo(() => {
        let sortableUsers = [...users];
        if (searchTerm) {
            sortableUsers = sortableUsers.filter((user) =>
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user?.company?.denomination?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (sortConfig !== null) {
            sortableUsers.sort((a: any, b: any) => {
                if (a[sortConfig.key as keyof User] < b[sortConfig.key as keyof User]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key as keyof User] > b[sortConfig.key as keyof User]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableUsers;
    }, [users, sortConfig, searchTerm]);

    const sortedAndFilteredProducts = React.useMemo(() => {
        let sortableProducts = [...products];
        if (searchTerm) {
            sortableProducts = sortableProducts.filter((product) =>
                product.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (sortConfig !== null) {
            sortableProducts.sort((a: any, b: any) => {
                if (a[sortConfig.key as keyof Product] < b[sortConfig.key as keyof Product]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key as keyof Product] > b[sortConfig.key as keyof Product]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableProducts;
    }, [products, sortConfig, searchTerm]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentUsers = sortedAndFilteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const currentProducts = sortedAndFilteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (loading) {
        return <Loading />;
    }

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
                                className={`${currentPage === number ? 'bg-easyorder-black' : 'bg-easyorder-green'} text-white px-3 py-1 rounded-lg hover:bg-easyorder-black transition`}
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
                <Title>Panneau d'administration</Title>

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
                    <button
                        onClick={() => {
                            setCurrentCategory("validations");
                            setSearchTerm(''); // Réinitialise la barre de recherche
                        }}
                        className={`px-6 py-2 rounded-lg ${currentCategory === "validations" ? "bg-easyorder-green" : "bg-easyorder-black text-white"} hover:bg-easyorder-green hover:text-white transition`}
                    >
                        Gérer les validations
                    </button>
                </div>

                {/* Barre de recherche */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border  rounded-lg focus:outline-none focus:ring focus:ring-easyorder-green"
                        placeholder={`Rechercher un ${currentCategory === 'users' ? 'utilisateur' : 'produit'}`}
                    />
                </div>

                {currentCategory === "validations" && (
                    <section>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
                                <thead className="bg-easyorder-green text-white">
                                <tr>
                                    <th className="py-4 px-6 text-left">Nom</th>
                                    <th className="py-4 px-6 text-left">Email</th>
                                    <th className="py-4 px-6 text-left">Entreprise</th>
                                    <th className="py-4 px-6 text-left">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pendingArtisans.map((user) => (
                                    <tr key={user._id} className="border-b border-easyorder-gray">
                                        <td className="py-4 px-6">
                                            {user?.role == 'artisan' ? (
                                                <Link className="text-easyorder-green" href={`/artisans/${user?._id}`}>
                                                    {user?.company?.denomination} ({user.name})
                                                </Link>
                                            ) : (
                                                <p>
                                                    {user.name}
                                                </p>
                                            )
                                            }
                                        </td>
                                        <td className="py-4 px-6">{user.email}</td>
                                        <td className="py-4 px-6">{user.company?.denomination || 'N/A'}</td>
                                        <td className="py-4 px-6 space-x-2">
                                            <button
                                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                                                onClick={() => handleValidateUser(user as any)}
                                            >
                                                Valider
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                                onClick={() => handleRejectUser(user as any)}
                                            >
                                                Rejeter
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {currentCategory === "users" && (
                    <section>
                        {/* Tableau des utilisateurs */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
                                <thead className="bg-easyorder-green text-white">
                                <tr>
                                    <th className="py-4 px-6 text-left cursor-pointer" onClick={() => handleSort('name')}>Nom</th>
                                    <th className="py-4 px-6 text-left cursor-pointer" onClick={() => handleSort('email')}>Email</th>
                                    <th className="py-4 px-6 text-left cursor-pointer" onClick={() => handleSort('role')}>Rôle</th>
                                    <th className="py-4 px-6 text-left">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user._id} className="border-b border-easyorder-gray">
                                        <td className="py-4 px-6">
                                            {user?.role == 'artisan' ? (
                                                <Link className="text-easyorder-green" href={`/artisans/${user?._id}`}>
                                                    {user?.company?.denomination} ({user.name})
                                                </Link>
                                            ) : (
                                                <p>
                                                    {user.name}
                                                </p>
                                            )
                                            }
                                        </td>
                                        <td className="py-4 px-6">{user.email}</td>
                                        <td className="py-4 px-6">{user.role}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex space-x-2">
                                                <Link href={`/account?userId=${user._id}`} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                                                    {user.role === 'artisan' ? 'Modifier artisan' : 'Modifier client'}
                                                </Link>
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
                        <Pagination totalItems={sortedAndFilteredUsers.length} paginate={paginate}/>
                    </section>
                )}

                {currentCategory === "products" && (
                    <section>
                        {/* Tableau des produits */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
                                <thead className="bg-easyorder-green text-white">
                                <tr>
                                    <th className="py-4 px-6 text-left cursor-pointer" onClick={() => handleSort('name')}>Nom du produit</th>
                                    <th className="py-4 px-6 text-left cursor-pointer" onClick={() => handleSort('price_in_cent')}>Prix</th>
                                    <th className="py-4 px-6 text-left cursor-pointer" onClick={() => handleSort('stock')}>Stock</th>
                                    <th className="py-4 px-6 text-left">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentProducts.map((product) => (
                                    <tr key={product._id} className="border-b border-easyorder-gray">
                                        <td className="py-4 px-6">
                                            <Link href={`/products/${product._id}`} className="text-easyorder-black hover:underline">
                                                {product.name}
                                            </Link>
                                        </td>
                                        <td className="py-4 px-6">{(product.price_in_cent as number / 100).toFixed(2)} €</td>
                                        <td className="py-4 px-6">{product.stock}</td>
                                        <td className="py-4 px-6 space-x-2">
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
                        <Pagination totalItems={sortedAndFilteredProducts.length} paginate={paginate} />
                    </section>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
