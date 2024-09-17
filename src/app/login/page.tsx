'use client';

import { useState } from "react";

type LoginType = 'signin' | 'signup';

const Login = () => {
    const [type, setType] = useState<LoginType>('signin');
    const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string; server?: string }>({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({}); // Réinitialiser les erreurs
        setLoading(true);

        const form = e.target as HTMLFormElement;
        const email = form.email.value;
        const password = form.password.value;
        const name = type === 'signup' ? form.name.value : null;

        let newErrors: { email?: string; password?: string; name?: string } = {};

        // Validation front-end
        if (!email) newErrors.email = "L'email est requis.";
        if (!password) newErrors.password = "Le mot de passe est requis.";
        if (type === 'signup' && !name) newErrors.name = "Le nom est requis.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            // Simuler une requête vers le backend
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors({ server: errorData.message || "Une erreur est survenue lors de la connexion." });
            } else {
                // Traitement en cas de succès
                alert(type === 'signin' ? 'Connexion réussie' : 'Inscription réussie');
            }
        } catch (error) {
            setErrors({ server: "Erreur serveur. Veuillez réessayer plus tard." });
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
                    {type === 'signup' && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nom
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={`mt-1 block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="Votre nom"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`mt-1 block w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Votre email"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mot de passe
                        </label>
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
                        disabled={loading}
                        className={`w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {loading ? 'Chargement...' : type === 'signin' ? 'Se connecter' : 'S’inscrire'}
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
                                className="text-blue-500 hover:underline">
                                S’inscrire
                            </button>
                        </>
                    ) : (
                        <>
                            Vous avez déjà un compte ?{' '}
                            <button
                                type="button"
                                onClick={() => setType('signin')}
                                className="text-blue-500 hover:underline">
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
