'use client';

import StripeService from "@/services/stripe.service";
import {useEffect, useState} from "react";
import {User} from "@/models/user.model";

const StripeButton = ({ amount }: { amount: number }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [stripeId, setStripeId] = useState<string>('');

    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            const user: User = JSON.parse(userJson);
            setStripeId(user.stripe_id as string);
        }
    }, [])

    const handleCheckout = async () => {
        setLoading(true);
        StripeService.createPayment(amount, stripeId).then(() => {
            setLoading(false);
        })
    };

    return (
        <div>
            <button
                onClick={handleCheckout}
                disabled={loading}
                className="bg-easyorder-green text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition"
            >
                {loading ? 'Redirection...' : `Payer ${amount / 100} EUR`}
            </button>
        </div>
    );
};

export default StripeButton;