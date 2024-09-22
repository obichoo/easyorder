'use client';

import {useEffect, useState} from "react";
import { useRouter } from 'next/navigation'; // Import du router pour redirection
import UserService from "@/services/user.service";
import { FaSpinner } from 'react-icons/fa';
import Stripe from 'stripe';
import {User} from "@/models/user.model";
import Title from "@/app/components/title/page";

const secretKey = process.env.NEXT_PUBLIC_STRIPE_PRIVATE_KEY as string;
const stripe = new Stripe(secretKey);

type LoginType = 'signin' | 'signup';
type Errors = { email?: string; password?: string; name?: string; server?: string; role?: string; denomination?: string; siret?: string }

const Login = () => {
    const [type, setType] = useState<LoginType>('signin');
    const [isArtisan, setIsArtisan] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
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
        const denomination = (type === 'signup' && role == 'artisan') ? form.denomination.value : undefined;
        const siret = (type === 'signup' && role == 'artisan') ? form.siret.value?.replace(/\D/g, '') : undefined;

        let newErrors: Errors = {};

        if (!email) newErrors.email = "L'email est requis.";
        if (!password) newErrors.password = "Le mot de passe est requis.";
        if (type === 'signup' && !name) newErrors.name = "Le nom est requis.";
        if (type === 'signup' && !role) newErrors.role = "Le rôle est requis.";
        if (type === 'signup' && role == 'artisan' && !denomination) newErrors.denomination = "Le nom de l'entreprise est requis.";
        if (type === 'signup' && role == 'artisan' && (!siret || siret.length !== 14)) newErrors.siret = "Le SIRET est invalide.";

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
                const user: User = { email, password, name, role };

                if (role == 'artisan') {
                    user.company = {denomination, siret}
                }

                const customer = await stripe.customers.create({
                    email: email,
                    name: name,
                });
                response = await UserService.createUser({ ...user, stripe_id: customer.id})
            }

            if ([200, 201].includes(response.status)) {
                setRefreshing(true);

                const userData = response.data;

                if (siret) {
                    UserService.addCompanyToUser(userData._id, siret).then((response) => {
                        localStorage.setItem("user", JSON.stringify(userData));
                        router.push('/home');
                    })
                } else {
                    localStorage.setItem("user", JSON.stringify(userData));
                    router.push('/home');
                }
            }
        } catch (error: any) {
            const serverError = error.response?.data?.message || "Une erreur est survenue lors de la connexion.";
            setErrors({ server: serverError });
        }

        setLoading(false);
    };

    const onRoleChange = (e: any) => {
        const role = e.target.value;
        setIsArtisan(role === 'artisan');
    }

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            router.push('/home');
        }
    }, [])

    return (
        <div className="flex items-center justify-center bg-easyorder-gray mt-28">
            <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
                <Title className="text-easyorder-green">Bienvenue sur EasyOrder !</Title>

                {/* Formulaire de connexion/inscription */}
                <form onSubmit={handleSubmit} id="form" className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4 text-center text-easyorder-black">
                        {type === 'signin' ? 'Connexion' : 'Inscription'}
                    </h2>

                    {/* Affichage des erreurs serveur */}
                    {errors.server && <p className="text-red-500 text-center mb-4">{errors.server}</p>}

                    {/* Champs email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-easyorder-black">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`mt-1 block w-full p-2 border ${errors.email ? 'border-red-500' : ''} rounded-md focus:ring-easyorder-green focus:border-easyorder-green`}
                            placeholder="Votre email"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    {type === 'signup' && (
                        <>
                            <div>
                                <label htmlFor="name"
                                       className="block text-sm font-medium text-easyorder-black">Nom</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className={`mt-1 block w-full p-2 border ${errors.name ? 'border-red-500' : ''} rounded-md focus:ring-easyorder-green focus:border-easyorder-green`}
                                    placeholder="Votre nom"
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="role"
                                       className="block text-sm font-medium text-easyorder-black">Rôle</label>
                                <select
                                    name="role"
                                    id="role"
                                    defaultValue=""
                                    onChange={onRoleChange}
                                    className={`mt-1 block w-full p-2 border ${errors.role ? 'border-red-500' : ''} rounded-md focus:ring-easyorder-green focus:border-easyorder-green`}
                                >
                                    <option value="">Choisissez un rôle</option>
                                    <option value="artisan">Artisan</option>
                                    <option value="client">Client</option>
                                </select>
                                {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
                            </div>
                            {
                                isArtisan && (
                                    <>
                                        <div>
                                            <label htmlFor="denomination"
                                                   className="block text-sm font-medium text-easyorder-black">Nom de l'entreprise</label>
                                            <input
                                                type="text"
                                                id="denomination"
                                                name="denomination"
                                                className={`mt-1 block w-full p-2 border ${errors.denomination ? 'border-red-500' : ''} rounded-md focus:ring-easyorder-green focus:border-easyorder-green`}
                                                placeholder="Nom de l'entreprise"
                                            />
                                            {errors.denomination && <p className="text-red-500 text-sm">{errors.denomination}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="siret"
                                                   className="block text-sm font-medium text-easyorder-black">SIRET</label>
                                            <input
                                                type="text"
                                                id="siret"
                                                name="siret"
                                                className={`mt-1 block w-full p-2 border ${errors.siret ? 'border-red-500' : ''} rounded-md focus:ring-easyorder-green focus:border-easyorder-green`}
                                                placeholder="SIRET"
                                            />
                                            {errors.siret && <p className="text-red-500 text-sm">{errors.siret}</p>}
                                        </div>
                                    </>
                                )
                            }
                        </>
                    )}

                    {/* Champs mot de passe */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-easyorder-black">Mot de
                            passe</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={`mt-1 block w-full p-2 border ${errors.password ? 'border-red-500' : ''} rounded-md focus:ring-easyorder-green focus:border-easyorder-green`}
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
                <p className="mt-4 text-center text-sm text-easyorder-black">
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
        </div>
    );
};

export default Login;
