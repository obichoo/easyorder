'use client';

import Link from 'next/link';
import { FaTimesCircle } from 'react-icons/fa';
import {Suspense} from 'react';

const FailurePage = () => {
    return (
        <Suspense>
            <Page />
        </Suspense>
    );
};

const Page = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-28 bg-easyorder-gray px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg text-center">
                <div className="flex justify-center items-center mb-6">
                    {/* Animation de l'icône */}
                    <FaTimesCircle className="text-red-500 animate-pulse" size={60} />
                </div>
                <h1 className="text-3xl font-bold mb-4 text-easyorder-black">Échec du Paiement</h1>
                <p className="text-easyorder-black mb-8 text-lg">
                    Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer ou contacter l'assistance si le problème persiste.
                </p>

                {/* Boutons */}
                <div className="flex justify-center space-x-4">
                    <Link href="/home">
                        <button className="bg-easyorder-green text-white px-6 py-3 rounded-md hover:bg-easyorder-black transition duration-300 ease-in-out transform hover:scale-105">
                            Retour à l'accueil
                        </button>
                    </Link>

                    <Link href="/account">
                        <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105">
                            Voir mon compte
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FailurePage;
