'use client';

import StripeService from "@/services/stripe.service";
import {useState} from "react";

const StripeButton = ({ amount }: { amount: number }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleCheckout = async () => {
        setLoading(true);
        StripeService.createPayment(amount).then(() => {
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