'use client';

import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';
import UserService from "@/services/user.service";
import {Suspense, useEffect} from "react";
import { useSearchParams } from 'next/navigation'
import OrderService from "@/services/order.service";

const ConfirmationPage = () => {
    return (
        <Suspense>
            <Page />
        </Suspense>
    )
}

const Page = () => {
    const searchParams = useSearchParams()

    const setSubscriber = () => {
        const userJson = localStorage.getItem('user');
        if (!userJson) return;
        const user = JSON.parse(userJson);
        user.subscriber = true;
        UserService.updateUser(user).then(() => {
            localStorage.setItem('user', JSON.stringify(user));
        })
    }

    const setOrderToPaid = (orderId: string) => {
        OrderService.updateOrder({
            _id: orderId,
            status: 'processing'
        })
    }

    useEffect(() => {
        console.log(searchParams);
        if (searchParams.get('subscription') === 'true') {
            setSubscriber();
        }

        if (searchParams.get('orderId')) {
            setOrderToPaid(searchParams.get('orderId') as string);
        }
    }, [])

    return (
        <div className="flex flex-col items-center justify-center h-full mb-10">
            <div className="text-center">
                <div className="flex justify-center items-center mb-6">
                    <FaCheckCircle className="text-green-500" size={50} />
                </div>
                <h1 className="text-3xl font-semibold mb-4">Paiement Réussi !</h1>
                <p className="text-gray-700 mb-8">
                    Merci pour votre paiement. Votre transaction a été complétée avec succès.
                </p>

                <Link href="/home">
                    <button className="bg-easyorder-green text-white px-6 py-3 rounded-md hover:bg-easyorder-black transition">
                        Retour à l'accueil
                    </button>
                </Link>

                <Link href="/my-account">
                    <button className="ml-4 bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition">
                        Voir mon compte
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default ConfirmationPage;
