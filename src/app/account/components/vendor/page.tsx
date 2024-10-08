'use client';

import {useState, useEffect, useRef, Suspense} from 'react';
import {
    FaPlus,
    FaSave,
    FaEdit,
    FaList,
    FaArrowRight,
    FaArrowLeft,
    FaFacebook,
    FaInstagram,
    FaTiktok,
    FaYoutube, FaCheck, FaQuestion, FaCross
} from 'react-icons/fa';
import {useRouter, useSearchParams} from 'next/navigation';
import Select from 'react-select';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import ProductService from '@/services/product.service';
import CategoryService from '@/services/category.service';
import UserService from "@/services/user.service";
import { User } from '@/models/user.model';
import getUser from "@/utils/get-user";
import {FaS, FaX} from "react-icons/fa6";
import ClientProfilePage from "@/app/account/components/customer/page";
import Link from "next/link";
import Title from "@/app/components/title/page";
import {ImCross} from "react-icons/im";

const VendorProfilePage = () => {
    const searchParams = useSearchParams()
    const router = useRouter();
    const [user, setUser] = useState<User | any>({});
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
    const [isEditingCompanyName, setIsEditingCompanyName] = useState<boolean>(false);
    const [isEditingPersonalProfile, setIsEditingPersonalProfile] = useState<boolean>(false);

    const { isOpen: isCategoryModalOpen, onOpen: openCategoryModal, onClose: closeCategoryModal } = useDisclosure();

    const bannerInputRef = useRef<HTMLInputElement | null>(null);
    const logoInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        fetchUser()
    }, []);

    const fetchUser = async () => {
        const userId = (getUser()?.role === 'admin' && searchParams.get('userId')) || (getUser() as User)._id;

        UserService.getUserById(userId).then((response) => {
            const userWithoutPassword = response.data;
            delete userWithoutPassword.password;
            setUser(userWithoutPassword);
            saveUserToLocalStorage(userWithoutPassword);
        })
    }

    const saveUserToLocalStorage = (user: User) => {
        if (user._id === (getUser() as User)._id) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }

    useEffect(() => {
        if (user._id) {
            fetchProductsAndCategories();
        }
    }, [user._id]);

    const fetchProductsAndCategories = async () => {
        try {
            const responseProducts = await ProductService.getProductsByUserId(user._id);
            setProducts(responseProducts.data);
            const responseCategories = await CategoryService.getAllCategories();
            setCategories(responseCategories.data);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    };

    const handleBannerUpload = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            UserService.updateCompanyPictures(user._id, { bannerPicture: file }).then((response) => {
                setUser(response.data.user);
                saveUserToLocalStorage(response.data.user);
            })
        }
    };

    const handleLogoUpload = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            UserService.updateCompanyPictures(user._id, { profilePicture: file }).then((response) => {
                setUser(response.data.user);
                saveUserToLocalStorage(response.data.user);
            })
        }
    };

    const handleSaveChanges = async () => {
        try {
            await UserService.updateUser(user);
            saveUserToLocalStorage(user);
        } catch (error) {
            console.error("Erreur lors de la sauvegarde des modifications:", error);
        }
    };

    const handleSubscribeClick = () => {
        router.push('/subscription');
    };

    const handleCategoriesChange = () => {
        UserService.updateUser({
            _id: user._id,
            categories: selectedCategories?.map((c: any) => c.value)
        }).then((response) => {
            setUser(response.data);
            saveUserToLocalStorage(response.data);
            closeCategoryModal();
        })
    }

    const handleOpenCategoriesModal = () => {
        setSelectedCategories(user.categories.map((c: any) => ({ value: c, label: categories.find((cat) => cat._id == c)?.name })));
        openCategoryModal();
    }

    return (
        <>
            <button
                onClick={() => setIsEditingPersonalProfile(!isEditingPersonalProfile)}
                className="mt-10 mx-8 bg-easyorder-black text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex justify-center items-center gap-2"
            >
                {isEditingPersonalProfile && <FaArrowLeft size={16} />}
                {isEditingPersonalProfile ? "Voir l'entreprise" : "Voir le profil personnel"}
                {!isEditingPersonalProfile && <FaArrowRight size={16} />}
            </button>
            {isEditingPersonalProfile ?
                <ClientProfilePage/> :
                <div className="container mx-auto p-8">
                    <Title>Modifier l'entreprise</Title>

                    <div className="flex justify-between items-center mb-8">
                        <div className="flex">
                            <button
                                onClick={() => setIsEditingCompanyName(!isEditingCompanyName)}
                                className="mr-4 py-2 px-3 bg-easyorder-green text-white rounded-md flex items-center justify-center"
                            >
                                {isEditingCompanyName ?
                                    (<FaSave size={20}/>) :
                                    (<FaEdit size={20}/>)
                                }

                            </button>
                            {isEditingCompanyName ? (
                                <input
                                    type="text"
                                    className="border p-1 rounded-md text-2xl font-bold outline-none"
                                    value={user.company?.denomination || ''}
                                    onChange={(e) => setUser({
                                        ...user,
                                        company: {...user.company, denomination: e.target.value}
                                    })}
                                />
                            ) : (
                                <Title>{user.company?.denomination || "Mon entreprise"}</Title>
                            )}
                        </div>
                        <button
                            onClick={handleSubscribeClick}
                            className="bg-easyorder-green text-white font-semibold py-2 px-4 rounded-lg hover:bg-easyorder-black transition duration-300 ml-4"
                        >
                            {user.subscriber ? "Voir l'abonnement" : "Souscrire à l'abonnement Premium"}
                        </button>
                    </div>

                    <div className="flex items-center w-full mb-6">
                        <div className="flex items-center">
                            <div
                                className="relative mr-8 w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer shadow"
                                onClick={() => logoInputRef.current?.click()}
                            >
                                {user.company?.profile_pic ? (
                                    <img src={user.company?.profile_pic} alt="Logo"
                                         className="w-full h-full object-cover rounded-full"/>
                                ) : (
                                    <p className="text-center">Ajouter un logo</p>
                                )}

                                {
                                    user.company?.etat == 'validé' ? (
                                        <span
                                            className="bg-green-500 text-white rounded-full p-1 text-xs absolute right-0 bottom-0 tooltip">
                                            <FaCheck/>
                                            <span className="tooltiptext">Entreprise vérifiée</span>
                                        </span>
                                    ) : user.company?.etat == 'en attente' ? (
                                        <span
                                            className="bg-gray-500 text-white rounded-full block p-1 text-xs absolute right-0 bottom-0 tooltip">
                                            <FaQuestion/>
                                            <span className="tooltiptext">Entreprise en attente de vérification</span>
                                        </span>
                                    ) : (
                                        <span
                                            className="bg-red-500 text-white rounded-full p-1 text-xs absolute right-0 bottom-0 tooltip">
                                            <ImCross/>
                                            <span className="tooltiptext">Entreprise non vérifiée</span>
                                        </span>
                                    )
                                }
                            </div>
                            <input ref={logoInputRef} type="file" accept="image/png, image/jpeg" className="hidden"
                                   onChange={handleLogoUpload}/>
                        </div>

                        <div className="flex-grow h-32 rounded-xl shadow cursor-pointer"
                             onClick={() => bannerInputRef.current?.click()}>
                            {user.company?.banner_pic ? (
                                <img src={user.company?.banner_pic} alt="Bannière"
                                     className="h-full w-full object-cover rounded-md"/>
                            ) : (
                                <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                                    <span>Ajouter une bannière</span>
                                </div>
                            )}
                        </div>
                        <input ref={bannerInputRef} type="file" accept="image/png, image/jpeg" className="hidden"
                               onChange={handleBannerUpload}/>
                    </div>

                    {/* Formulaire complet avec description, informations entreprise, mot de passe */}
                    <div className="mb-4">
                        <label className="block font-semibold mb-1">Description de
                            l'entreprise</label>
                        <textarea
                            value={user?.description || ''}
                            onChange={(e) => setUser({
                                ...user,
                                description: e.target.value
                            })}
                            className="w-full p-3 border  rounded-lg"
                            rows={5}
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="font-semibold mb-1 block">Réseaux sociaux</label>
                        <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                            <div className="w-full flex items-center gap-2">
                                <FaFacebook size={32}/>
                                <input
                                    type="text"
                                    placeholder="Lien de votre page Facebook"
                                    value={user.social_network?.facebook || ''}
                                    onChange={(e) => setUser({...user, social_network: { ...user.social_network, facebook: e.target.value}})}
                                    className="w-full p-2 border  rounded-md"
                                />
                            </div>
                            <div className="w-full flex items-center gap-2">
                                <FaInstagram size={32}/>
                                <input
                                    type="text"
                                    placeholder="Lien de votre page Instagram"
                                    value={user.social_network?.instagram || ''}
                                    onChange={(e) => setUser({
                                        ...user,
                                        social_network: {...user.social_network, instagram: e.target.value}
                                    })}
                                    className="w-full p-2 border  rounded-md"
                                />
                            </div>
                            <div className="w-full flex items-center gap-2">
                                <FaYoutube size={32}/>
                                <input
                                    type="text"
                                    placeholder="Lien de votre page Youtube"
                                    value={user.social_network?.youtube || ''}
                                    onChange={(e) => setUser({
                                        ...user,
                                        social_network: {...user.social_network, youtube: e.target.value}
                                    })}
                                    className="w-full p-2 border  rounded-md"
                                />
                            </div>
                            <div className="w-full flex items-center gap-2">
                                <FaTiktok size={32}/>
                                <input
                                    type="text"
                                    placeholder="Lien de votre page TikTok"
                                    value={user.social_network?.tiktok || ''}
                                    onChange={(e) => setUser({
                                        ...user,
                                        social_network: {...user.social_network, tiktok: e.target.value}
                                    })}
                                    className="w-full p-2 border  rounded-md"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Informations entreprise */}
                    <div className="mb-4">
                        <label className="font-semibold mb-1 block">Informations de l'entreprise</label>
                        <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="font-semibold">SIRET</label>
                                    <p>{user.company?.siret || 'Non défini'}</p>
                                </div>
                                <div>
                                    <label className="font-semibold">SIREN</label>
                                    <p>{user.company?.siren || 'Non défini'}</p>
                                </div>
                                <div>
                                    <label className="font-semibold">Catégorie d'entreprise</label>
                                    <p>{user.company?.categorie_entreprise || 'Non défini'}</p>
                                </div>
                                <div>
                                    <label className="font-semibold">Code d'activité</label>
                                    <p>{user.company?.activitite_principale_legale || 'Non défini'}</p>
                                </div>
                                <div
                                    className="col-span-2"
                                >
                                    <label className="font-semibold mb-1 block">Adresse</label>
                                    <p>{
                                        [
                                            user?.company?.adresse_etablissement?.typeVoieEtablissement,
                                            user?.company?.adresse_etablissement?.libelleVoieEtablissement,
                                            user?.company?.adresse_etablissement?.libelleCommuneEtablissement,
                                            user?.company?.adresse_etablissement?.codePostalEtablissement,
                                        ].filter((x) => x).join(' ')
                                        || 'Non défini'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handleSaveChanges}
                            className="bg-easyorder-green text-white px-6 py-2 rounded-md hover:bg-easyorder-black transition"
                        >
                            <FaSave className="mr-2 inline-block"/> Sauvegarder les changements
                        </button>
                    </div>

                    <hr className="w-full border-easyorder-black my-4"/>

                    {/* Catégories */}
                    <div className="flex mb-4">
                        <button onClick={handleOpenCategoriesModal}
                                className="bg-easyorder-green text-white px-4 py-2 flex items-center rounded-md hover:bg-easyorder-black transition">
                            <FaList className="mr-2"/> Modifier les catégories
                        </button>
                    </div>

                    {/* Liste des catégories */}
                    <div className="mb-8">
                        <h3 className="font-bold mb-2">Catégories actuelles</h3>
                        {user?.categories?.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {user?.categories?.map((category: any, index: any) => (
                                    <div
                                        key={index}
                                        className="bg-white shadow-sm rounded-md p-2 text-sm flex items-center justify-center text-center hover:bg-easyorder-green hover:text-white transition-all duration-300"
                                    >
                                        <p className="font-medium">{categories.find((c) => c._id == category)?.name}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Aucune catégorie sélectionnée</p>
                        )}
                    </div>

                    {/* Boutons d'ajout et d'édition des produits */}
                    <div className="flex mb-4">
                        <button onClick={() => router.push('/products/create')}
                                className="bg-easyorder-green text-white px-4 py-2 flex items-center rounded-md hover:bg-easyorder-black transition">
                            <FaPlus className="mr-2"/> Ajouter un produit
                        </button>
                    </div>

                    {/* Modal pour modification des catégories */}
                    <Modal className="overflow-visible" isOpen={isCategoryModalOpen} onClose={closeCategoryModal}>
                        <ModalContent>
                            <ModalHeader>
                                <h2>Modifier les catégories</h2>
                            </ModalHeader>
                            <ModalBody>
                                <Select isMulti value={selectedCategories}
                                        onChange={(e: any) => setSelectedCategories(e)}
                                        options={categories.map(c => ({value: c._id, label: c.name}))}/>
                            </ModalBody>
                            <ModalFooter>
                                <button onClick={closeCategoryModal}
                                        className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition">
                                    Annuler
                                </button>
                                <button onClick={handleCategoriesChange}
                                        className="bg-easyorder-green text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition">
                                    Confirmer
                                </button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                    {/* Produits sous forme de cartes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                <Link
                                    key={product._id}
                                    className="bg-white p-4 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl cursor-pointer"
                                    href={`/products/${product._id}`}
                                >
                                    <img
                                        src={(product.pictures && product.pictures.length > 0) ? product.pictures[0]?.url : 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <div>
                                        <h4 className="font-bold text-xl text-easyorder-black mb-2 truncate">{product.name}</h4>
                                    </div>
                                    <p className=" mb-2">
                                        {(product?.description as string).substring(0, 60)}
                                        {(product?.description as string).length > 59 && '...'}
                                    </p>
                                    <p className="text-easyorder-black font-semibold">Prix
                                        : {((product?.price_in_cent as number) / 100).toFixed(2)} €</p>
                                    <p className="">Stock
                                        : {(product?.stock as number) > 0 ? product.stock : 'Rupture de stock'}</p>
                                </Link>
                            ))
                        ) : (
                            <p>Aucun produit ajouté</p>
                        )}
                    </div>
                </div>
            }
        </>


    );
};

const Page = () => {
    return (
        <Suspense>
            <VendorProfilePage/>
        </Suspense>
    );
}

export default Page;
