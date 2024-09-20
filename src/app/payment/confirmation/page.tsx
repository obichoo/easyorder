'use client';

import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';
import UserService from "@/services/user.service";
import {Suspense, useEffect} from "react";
import { useSearchParams } from 'next/navigation';
import OrderService from "@/services/order.service";

const ConfirmationPage = () => {
    return (
        <Suspense>
            <Page />
        </Suspense>
    );
};

const Page = () => {
    const searchParams = useSearchParams();

    const setSubscriber = () => {
        const userJson = localStorage.getItem('user');
        if (!userJson) return;
        const user = JSON.parse(userJson);
        user.subscriber = true;
        UserService.updateUser({
            _id: user._id,
            subscriber: true
        }).then(() => {
            localStorage.setItem('user', JSON.stringify(user));
        });
    };

    const setOrderToPaid = (orderId: string) => {
        OrderService.validateOrder(orderId);
    };

    useEffect(() => {
        if (searchParams.get('subscription') === 'true') {
            setSubscriber();
        }

        if (searchParams.get('orderId')) {
            setOrderToPaid(searchParams.get('orderId') as string);
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center mt-28 bg-easyorder-gray px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg text-center">
                <div className="flex justify-center items-center mb-6">
                    {/* Animation de l'icône */}
                    <FaCheckCircle className="text-easyorder-green animate-pulse" size={60} />
                </div>
                <h1 className="text-3xl font-bold mb-4 text-easyorder-black">Paiement Réussi !</h1>
                <p className="text-easyorder-black mb-8 text-lg">
                    Merci pour votre paiement. Votre transaction a été complétée avec succès.
                </p>

                {/* Boutons */}
                <div className="flex justify-center space-x-4">
                    <Link href="/home">
                        <button className="bg-easyorder-green text-white px-6 py-3 rounded-md hover:bg-easyorder-black transition duration-300 ease-in-out transform hover:scale-105">
                            Retour à l'accueil
                        </button>
                    </Link>

                    <Link href="/my-account">
                        <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105">
                            Voir mon compte
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPage;
