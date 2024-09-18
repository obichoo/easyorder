'use client';
import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

export default function ProfileEditPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('/default-profile.png');
  const [updateMessage, setUpdateMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    setUpdateMessage("Profil mis à jour avec succès !");
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Modifier mon profil</h1>
      <div className="flex items-start space-x-8">
        <div className="flex-shrink-0">
          {/* Si aucune image n'est uploadée, afficher l'icône */}
          {previewImage === '/default-profile.png' ? (
            <FaUserCircle className="w-40 h-40 text-gray-400" />
          ) : (
            <img
              src={previewImage}
              alt="Aperçu de la photo de profil"
              className="w-40 h-40 rounded-full object-cover"
            />
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex-grow space-y-6">
          {/* Nom */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-easyorder-green"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-easyorder-green"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-easyorder-green"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirmation de mot de passe */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-easyorder-green"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Photo de profil */}
          <div>
            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">Photo de profil</label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1"
            />
          </div>

          {/* Bouton maj */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-easyorder-green text-white font-semibold rounded-md hover:bg-green-700"
            >
              Mettre à jour le profil
            </button>
          </div>

          {/* Message succès*/}
          {updateMessage && (
            <div className="text-center text-easyorder-green font-medium mt-4">
              {updateMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
