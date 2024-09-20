'use client';

import React, { useEffect, useState } from 'react';
import StripeService from "@/services/stripe.service";
import { User } from "@/models/user.model";
import { FaSpinner } from 'react-icons/fa';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}

const pricingTableID = "prctbl_1Q0NnJLS81ZhN4fiLX1WWiYB";
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

const PricingTable = () => {
    const [customerSessionClientSecret, setCustomerSessionClientSecret] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const getCustomerSessionClientSecret = (customerId: string) => {
        StripeService.createCustomerSession(customerId).then((data: any) => {
            setCustomerSessionClientSecret(data.client_secret);
            setLoading(false);
        });
    };

    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            const user: User = JSON.parse(userJson);
            getCustomerSessionClientSecret(user.stripe_id as string);
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <>
            {loading ? (
                <div className="flex items-center justify-center mt-16">
                    <FaSpinner className="animate-spin text-easyorder-green text-4xl" />
                    <p className="ml-4 text-easyorder-black">Chargement des options d’abonnement...</p>
                </div>
            ) : (
                <stripe-pricing-table
                    style={{ width: "100%" }}
                    pricing-table-id={pricingTableID}
                    publishable-key={publishableKey}
                    customer-session-client-secret={customerSessionClientSecret}
                >
                </stripe-pricing-table>
            )}
        </>
    );
};

export default function SubscriptionPage() {
    return (
        <div className="flex flex-col items-center justify-center w-full mt-20">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-easyorder-black mb-2">Abonnement premium</h1>
                <p className="text-lg text-easyorder-black mb-4">Optez pour un abonnement et profitez des fonctionnalités exclusives d'EasyOrder !</p>
            </div>

            <div className="w-full max-w-4xl px-4">
                <PricingTable />
            </div>

            <div className="text-center mt-16">
                <p className="text-easyorder-black text-sm">Des questions sur les abonnements ? Consultez notre <a href="/faq" className="text-easyorder-green underline hover:text-easyorder-black">FAQ</a>.</p>
            </div>
        </div>
    );
}
