'use client';

import { useState } from 'react';
import { FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const faqs = [
  {
    question: 'Comment acheter des biens ?',
    answer: 'Dans un premier temps, connectez-vous ou inscrivez-vous afin de pouvoir accéder aux différentes fonctionnalités. Ensuite, recherchez ou sélectionnez un bien qui vous intéresse. Cliquez dessus et appuyez sur le bouton "Acheter".',
  },
  {
    question: 'Comment vendre des produits personnalisés ?',
    answer: 'Pour vendre des produits personnalisés, inscrivez-vous en tant que vendeur et ajoutez vos produits personnalisés dans votre boutique.',
  },
  {
    question: 'Comment utiliser la messagerie instantanée pour la vente sur mesure ?',
    answer: 'Il vous suffit de cliquer sur un produit qui vous intéresse. Un bouton "Contacter l\'artisan" est disponible afin d\'engager la discussion.',
  },
  {
    question: 'Les vendeurs sont-ils enregistrés au RCS ?',
    answer: 'Oui, tous les vendeurs sur notre plateforme sont enregistrés au RCS pour garantir la légalité de leurs activités.',
  },
  {
    question: 'Existe-t-il une fonctionnalité qui permet de mettre en avant ses produits ?',
    answer: 'Oui, pour cela, un abonnement à 7,99 euros/mois est disponible.',
  },
  {
    question: 'Comment ajouter des biens ?',
    answer: 'Rendez-vous dans votre profil > Modifier votre boutique > Ajouter des biens.',
  },
  {
    question: 'Des outils de gestion de stock sont-ils disponibles ?',
    answer: 'Nous offrons divers outils de gestion de stock pour vous aider à suivre et gérer vos produits efficacement. Pour les retrouver, il vous suffit de vous rendre sur votre profil en haut à droite et de cliquer sur "Gestion des stocks".',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Filtrer les FAQs en fonction du texte de recherche
  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Barre de recherche */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Rechercher dans les FAQ..."
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-easyorder-green"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-easyorder-gray" />
        </div>
      </div>

      {/* Liste des questions et réponses */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <p className="text-center text-easyorder-gray">Aucune FAQ ne correspond à votre recherche.</p>
        ) : (
          filteredFaqs.map((faq, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-easyorder-gray"
                onClick={() => toggleAnswer(index)}
              >
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                {openIndex === index ? (
                  <FaChevronUp className="text-easyorder-gray" />
                ) : (
                  <FaChevronDown className="text-easyorder-gray" />
                )}
              </div>
              {openIndex === index && (
                <div className="p-4 border-t border-easyorder-gray">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}