'use client';
import { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import UserService from "@/services/user.service"; // Import du service utilisateur

export default function ProfileEditPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState('/default-profile.png');
  const [updateMessage, setUpdateMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null); // ID de l'utilisateur

  // Charger les informations de l'utilisateur depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser).user;
      setName(userData.name);
      setEmail(userData.email);
      setPreviewImage(userData.profile_pic || '/default-profile.png');
      setUserId(userData._id); // Assigner l'ID de l'utilisateur
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      // Mise à jour de l'image de profil si un fichier a été sélectionné
      if (profileImage && userId) {
        await UserService.updateProfilePicture(userId, profileImage);
      }

      // Mise à jour des autres informations utilisateur (email, nom, mot de passe)
      const updatedUser = { name, email };
      if (password) {
        updatedUser.password = password; // Si le mot de passe est modifié
      }

      if (userId) {
        await UserService.updateUser({ id: userId, ...updatedUser });
        setUpdateMessage("Profil mis à jour avec succès !");
      }

      // Actualiser les données utilisateur dans le localStorage
      const updatedStoredUser = JSON.parse(localStorage.getItem("user") || '{}');
      updatedStoredUser.user = { ...updatedStoredUser.user, name, email, profile_pic: previewImage };
      localStorage.setItem("user", JSON.stringify(updatedStoredUser));

    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error);
      setUpdateMessage("Une erreur est survenue lors de la mise à jour.");
    }
  };

  return (
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-8">Modifier mon profil</h1>
        <div className="flex items-start space-x-8">
          <div className="flex-shrink-0">
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

            <div>
              <button
                  type="submit"
                  className="w-full py-2 px-4 bg-easyorder-green text-white font-semibold rounded-md hover:bg-green-700"
              >
                Mettre à jour le profil
              </button>
            </div>

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
