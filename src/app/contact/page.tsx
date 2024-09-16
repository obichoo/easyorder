'use client';
import { useState } from 'react';
import Navbar from '../components/navbar/page';

export default function Page() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {/* Section Actualités */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-easyorder-black text-center">Actualités</h2>
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-easyorder-gray rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-easyorder-green"> 15/09/2024 - Nouvelle fonctionnalité déployée !</h3>
              <p className="mt-2 text-easyorder-black">
                Nous avons récemment introduit une nouvelle fonctionnalité pour améliorer l'expérience utilisateur.
              </p>
            </div>
            <div className="p-4 bg-easyorder-gray rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-easyorder-green">10/09/2024 - Mise à jour du site web</h3>
              <p className="mt-2 text-easyorder-black">
                Notre site a été mis à jour avec une interface plus moderne et des performances améliorées.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire de contact */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 bg-easyorder-gray rounded-lg shadow-md">
            <h2 className="text-3xl font-extrabold text-easyorder-black text-center p-6">Contactez-nous</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center pt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nom"
                  required
                  className="w-3/4 mt-1 px-4 py-2 border border-easyorder-black rounded-md shadow-sm text-easyorder-black focus:outline-none focus:ring-easyorder-green focus:border-easyorder-green"
                />
              </div>

              <div className="flex flex-col items-center">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-3/4 mt-1 px-4 py-2 border border-easyorder-black rounded-md shadow-sm text-easyorder-black focus:outline-none focus:ring-easyorder-green focus:border-easyorder-green"
                />
              </div>

              <div className="flex flex-col items-center">
                <textarea
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Message"
                  required
                  className="w-3/4 h-48 mt-1 px-4 py-2 border border-easyorder-black rounded-md shadow-sm text-easyorder-black focus:outline-none focus:ring-easyorder-green focus:border-easyorder-green"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-easyorder-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-easyorder-green"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
