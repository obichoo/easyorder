'use client';

import React from 'react';
import Image from 'next/image';
import Title from "@/app/components/title/page";

export default function AboutUsPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            {/* Titre principal */}
            <Title>
                Qui sommes-nous ?
            </Title>

            {/* Section principale */}
            <section className="flex flex-col items-center mb-16 text-center">
                {/* Image de présentation */}
                <Image
                    src="/logo.png"
                    alt="Présentation EasyOrder"
                    width={300}
                    height={300}
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
