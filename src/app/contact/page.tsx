'use client';
import { useState } from 'react';
import axios from 'axios';
import Title from "@/app/components/title/page";

export default function Page() {
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState<any>({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus({ ...status, submitting: true });

    try {
      await axios({
        method: 'POST',
        url: 'https://formspree.io/f/mkgwlgpp',
        data: formData,
      });
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: 'Merci, votre message a été envoyé.' },
      });
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: "Une erreur est survenue lors de l'envoi du message." },
      });
    }
  };

  return (
      <div className="bg-easyorder-gray">
        {/* Formulaire de contact */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <Title>Contactez-nous</Title>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center">
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
                      disabled={status.submitting}
                      className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-easyorder-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-easyorder-green"
                  >
                    {status.submitting ? 'Envoi...' : status.submitted ? 'Envoyé' : 'Envoyer'}
                  </button>
                </div>
                {status.info.error && (
                    <div className="text-red-500 text-center mt-4">Erreur : {status.info.msg}</div>
                )}
                {!status.info.error && status.info.msg && (
                    <div className="text-green-500 text-center mt-4">{status.info.msg}</div>
                )}
              </form>
            </div>
          </div>
        </section>
      </div>
  );
}
