'use client';

import React from 'react';
import Image from 'next/image';

export default function AboutUsPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            {/* Titre principal */}
            <h1 className="text-5xl font-extrabold mb-12 text-center text-[#77ad86]">
                Qui sommes-nous ?
            </h1>

            {/* Section principale */}
            <section className="flex flex-col items-center mb-16 text-center">
                {/* Image de présentation */}
                <Image
                    src="/logo.png"
                    alt="Présentation EasyOrder"
                    width={300}
                    height={300}
                    className="rounded-full border-4 border-[#77ad86] shadow-xl hover:shadow-2xl transition-shadow duration-300"
                />
                {/* Description de l'entreprise */}
                <p className="mt-8 text-xl max-w-4xl text-[#032035] leading-relaxed">
                    <span className="font-bold text-[#77ad86]">EasyOrder</span> est une plateforme en ligne dédiée aux artisans. Elle
                    facilite la vente de services et produits sur mesure, permettant aux clients de rechercher des produits, passer
                    des commandes personnalisées et communiquer directement avec les artisans via une messagerie instantanée.
                </p>
            </section>
        </div>
    );
}
