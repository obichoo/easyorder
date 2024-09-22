/* eslint-disable */
'use client';
import {useState, useEffect, Suspense} from 'react';
import { FaUserCircle } from 'react-icons/fa';
import UserService from "@/services/user.service";
import {useSearchParams} from "next/navigation";
import getUser from "@/utils/get-user";
import Title from "@/app/components/title/page";
import {User} from "@/models/user.model"; // Import du service utilisateur

const ClientProfilePage = () => {
  const searchParams = useSearchParams();
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
    fetchUser()
  }, []);

  const fetchUser = async () => {
    const userToEdit = searchParams.get('userId');
    if (userToEdit && getUser()?.role === 'admin') {
      const user = await UserService.getUserById(userToEdit).then((response) => {
        const userWithoutPassword = { ...response.data, password: undefined };
        return userWithoutPassword;
      })
      setName(user?.name);
      setEmail(user?.email);
      setPreviewImage(user?.profile_pic);
      setUserId(user?._id); // Assigner l'ID de l'utilisateur
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setName(userData.name);
        setEmail(userData.email);
        setPreviewImage(userData.profile_pic);
        setUserId(userData._id); // Assigner l'ID de l'utilisateur
      }
    }
  }

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
        await UserService.updateProfilePicture(userId, profileImage).then((response) => {
          if (userId === (getUser() as User)._id) {
            localStorage.setItem("user", JSON.stringify(response.data?.user));
          }
        })
      }

      // Mise à jour des autres informations utilisateur (email, nom, mot de passe)
      const updatedUser: { name: string; email: string, password?: string} = {
        name,
        email,
        password
      }

      if (!password) {
        delete updatedUser.password;
      }

      if (userId) {
        await UserService.updateUser({ _id: userId, ...updatedUser })
        setUpdateMessage("Profil mis à jour avec succès !");
      }

      // Actualiser les données utilisateur dans le localStorage
      if (userId === (getUser() as User)._id) {
        const updatedStoredUser = JSON.parse(localStorage.getItem("user") || '{}');
        updatedStoredUser.user = {...updatedStoredUser.user, name, email, profile_pic: previewImage};
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error);
      setUpdateMessage("Une erreur est survenue lors de la mise à jour.");
    }
  };

  return (
      <div className="mx-auto pb-8">
        <Title>Modifier le profil</Title>
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
              <label htmlFor="name" className="block text-sm font-medium ">Nom</label>
              <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full px-3 py-2 border  rounded-md shadow-sm focus:outline-none focus:ring focus:ring-easyorder-green"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium ">Adresse email</label>
              <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-3 py-2 border  rounded-md shadow-sm focus:outline-none focus:ring focus:ring-easyorder-green"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium ">Nouveau mot de passe</label>
              <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full px-3 py-2 border  rounded-md shadow-sm focus:outline-none focus:ring focus:ring-easyorder-green"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium ">Confirmer le mot de passe</label>
              <input
                  type="password"
                  id="confirmPassword"
                  className="mt-1 block w-full px-3 py-2 border  rounded-md shadow-sm focus:outline-none focus:ring focus:ring-easyorder-green"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="profileImage" className="block text-sm font-medium ">Photo de profil</label>
              <input
                  type="file"
                  id="profileImage"
                  accept="image/png, image/jpeg"
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

const Page = () => {
    return (
        <Suspense>
          <ClientProfilePage />
        </Suspense>
    );
}

export default Page;