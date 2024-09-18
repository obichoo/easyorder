import React from 'react';
// import Stripe from 'stripe';

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
  return (
      <stripe-pricing-table
          style={{ width: "100%" }}
          pricing-table-id={pricingTableID}
          publishable-key={publishableKey}
      >
      </stripe-pricing-table>
  );
}

export default function SubscriptionPage() {
  return (
      <div className="flex flex-col items-center justify-center w-full mt-20">
        <h1 className="text-3xl font-bold">Abonnement EasyOrder</h1>
        <PricingTable />
      </div>
  );
}
