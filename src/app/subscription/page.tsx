'use client';

import React, {useEffect, useState} from 'react';
import StripeService from "@/services/stripe.service";
import {User} from "@/models/user.model";

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
            setCustomerSessionClientSecret(data.client_secret)
            setLoading(false)
        })
    }

    useEffect(() => {
        const userJson = localStorage.getItem('user');

        if (userJson) {
            const user: User = JSON.parse(userJson);
            getCustomerSessionClientSecret(user.stripe_id as string)
        } else {
            setLoading(false)
        }
    }, [])

    return (
        <>
            {loading ?
            <p className="mt-6">Chargement...</p> : (
                <stripe-pricing-table
                    style={{width: "100%"}}
                    pricing-table-id={pricingTableID}
                    publishable-key={publishableKey}
                    customer-session-client-secret={customerSessionClientSecret}
                >
                </stripe-pricing-table>
            )}
        </>
    )

}

export default function SubscriptionPage() {
  return (
      <div className="flex flex-col items-center justify-center w-full mt-20">
        <h1 className="text-3xl font-bold">Abonnement EasyOrder</h1>
        <PricingTable />
      </div>
  );
}
