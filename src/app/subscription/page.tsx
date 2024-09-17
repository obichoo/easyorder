import Navbar from '@/app/components/navbar/page';
import React from 'react';

export default function SubscriptionPage() {
  return (
    <div className="min-h-scree overflow-hidden">
      <div className="flex flex-col items-center justify-center min-h-[80vh] ">
        <h1 className="text-3xl font-bold mb-6">Abonnement EasyOrder</h1>
        <div className="bg-easyorder-gray rounded-lg shadow-lg p-8 w-96 bg-white">
          <h2 className="text-2xl font-semibold text-center mb-4">Plan Unique</h2>
          <p className="text-center text-4xl font-bold text-easyorder-green mb-4">7,99 € / mois</p>
          <ul className="text-center mb-6">
            <li className="mb-2">Mise en avant de votre entreprise</li>
            <li className="mb-2">Mise en avant de vos produits</li>
            <li className="mb-2">Support prioritaire</li>
          </ul>
          <div className="flex justify-center">
            <button className="bg-easyorder-green text-white px-6 py-3 rounded-full hover:bg-green-600">
              S'abonner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
