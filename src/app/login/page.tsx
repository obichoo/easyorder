'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation'; // Import du router pour redirection
import UserService from "@/services/user.service";
import { FaSpinner } from 'react-icons/fa';
import Stripe from 'stripe';

const secretKey = process.env.NEXT_PUBLIC_STRIPE_PRIVATE_KEY as string;
const stripe = new Stripe(secretKey);

type LoginType = 'signin' | 'signup';

const Login = () => {
    const [type, setType] = useState<LoginType>('signin');
    const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string; server?: string; role?: string; }>({});
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false); // Nouveau state pour le refresh
    const router = useRouter(); // Utilisation du router pour la redirection

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        const form = e.target as any;
        const email = form.email.value;
        const password = form.password.value;
        const name = type === 'signup' ? form.name.value : undefined;
        const role = type === 'signup' ? form.role.value : undefined;

        let newErrors: { email?: string; password?: string; name?: string; role?: string; } = {};

        if (!email) newErrors.email = "L'email est requis.";
        if (!password) newErrors.password = "Le mot de passe est requis.";
        if (type === 'signup' && !name) newErrors.name = "Le nom est requis.";
        if (type === 'signup' && !role) newErrors.role = "Le rôle est requis.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            let response;
            if (type === 'signin') {
                response = await UserService.login(email, password)
                response.data = response.data.user;
            } else {
                const user = { email, password, name, role };
                const customer = await stripe.customers.create({
                    email: email,
                    name: name,
                });
                response = await UserService.createUser({ ...user, stripe_id: customer.id})
            }

            if ([200, 201].includes(response.status)) {
                const userData = response.data;

                // Sauvegarder les informations de l'utilisateur dans le localStorage
                localStorage.setItem("user", JSON.stringify(userData));

                // Déclencher l'animation de chargement et rediriger
                setRefreshing(true);
                setTimeout(() => {
                    // Redirection vers la page d'accueil
                    router.push('/home');
                }, 1500);
            }
        } catch (error: any) {
            const serverError = error.response?.data?.message || "Une erreur est survenue lors de la connexion.";
            setErrors({ server: serverError });
        }

        setLoading(false);
    };

    return (
        <div className="mt-16">
            <h1 className="text-3xl mb-16 text-center">Bienvenue sur EasyOrder !</h1>
            <div className="mx-auto w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {type === 'signin' ? 'Connexion' : 'Inscription'}
                </h2>

                {/* Affichage des erreurs serveur */}
                {errors.server && <p className="text-red-500 text-center mb-4">{errors.server}</p>}

                {/* Formulaire de connexion/inscription */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`mt-1 block w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Votre email"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    {type === 'signup' && (
                        <>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className={`mt-1 block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                    placeholder="Votre nom"
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rôle</label>
                                <select
                                    name="role"
                                    id="role"
                                    defaultValue=""
                                    className={`mt-1 block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                >
                                    <option value="">Choisissez un rôle</option>
                                    <option value="artisan">Artisan</option>
                                    <option value="client">Client</option>
                                </select>
                                {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
                            </div>
                        </>
                    )}

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={`mt-1 block w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Votre mot de passe"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || refreshing}
                        className={`w-full bg-easyorder-green text-white p-2 rounded-md hover:bg-easyorder-black transition ${loading || refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {loading ? 'Chargement...' : refreshing ? (
                            <FaSpinner className="animate-spin inline mr-2" /> /* Loader animation */
                        ) : type === 'signin' ? 'Se connecter' : 'S’inscrire'}
                    </button>
                </form>

                {/* Switch between signin/signup */}
                <p className="mt-4 text-center text-sm text-gray-600">
                    {type === 'signin' ? (
                        <>
                            Pas encore de compte ?{' '}
                            <button
                                type="button"
                                onClick={() => setType('signup')}
                                className="text-easyorder-green hover:underline">
                                S’inscrire
                            </button>
                        </>
                    ) : (
                        <>
                            Vous avez déjà un compte ?{' '}
                            <button
                                type="button"
                                onClick={() => setType('signin')}
                                className="text-easyorder-green hover:underline">
                                Se connecter
                            </button>
                        </>
                    )}
                </p>
            </div>

            {/* Animation pendant le refresh */}
            {refreshing && (
                <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex justify-center items-center z-50">
                    <FaSpinner className="text-easyorder-green animate-spin" size={50} />
                </div>
            )}
        </div>
    );
};

export default Login;
