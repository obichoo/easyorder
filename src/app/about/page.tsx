'use client';

import React from 'react';
import Image from 'next/image';

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-easyorder-green">Qui sommes-nous ?</h1>

      <section className="flex flex-col items-center mb-12 text-center">
        <Image
          src="/logo.png"
          alt="Présentation EasyOrder"
          width={300}
          height={300}
          className="rounded-full border-4 border-easyorder-green shadow-lg"
        />
        <p className="mt-6 text-lg max-w-3xl">
          <span className="font-semibold text-easyorder-green">EasyOrder</span> est une plateforme en ligne dédiée aux artisans. Elle facilite la vente de services et produits sur mesure, permettant aux clients de rechercher des produits, passer des commandes personnalisées et communiquer directement avec les artisans via une messagerie instantanée.
        </p>
      </section>
    </div>
  );
}
