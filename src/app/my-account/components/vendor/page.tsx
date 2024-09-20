'use client';

import { useState, useEffect, useRef } from 'react';
import {FaUpload, FaPlus, FaSave, FaEdit, FaList, FaArrowRight, FaArrowLeft} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import ProductService from '@/services/product.service';
import CategoryService from '@/services/category.service';
import UserService from "@/services/user.service";
import { User } from '@/models/user.model';
import getUser from "@/utils/get-user";
import {FaS} from "react-icons/fa6";
import ClientProfilePage from "@/app/my-account/components/customer/page";

const VendorProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | any>({});
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [isEditingCompanyName, setIsEditingCompanyName] = useState<boolean>(false);
    const [isEditingPersonalProfile, setIsEditingPersonalProfile] = useState<boolean>(false);

    const { isOpen: isCategoryModalOpen, onOpen: openCategoryModal, onClose: closeCategoryModal } = useDisclosure();
    const { isOpen: isProductModalOpen, onOpen: openProductModal, onClose: closeProductModal } = useDisclosure();

    const bannerInputRef = useRef<HTMLInputElement | null>(null);
    const logoInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const userId = (getUser() as User)._id;

        UserService.getUserById(userId).then((response) => {
            const userWithoutPassword = response.data;
            delete userWithoutPassword.password;
            setUser(userWithoutPassword);
            localStorage.setItem('user', JSON.stringify(response.data));
        })
    }, []);

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
                localStorage.setItem('user', JSON.stringify(response.data.user));
            })
        }
    };

    const handleLogoUpload = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            UserService.updateCompanyPictures(user._id, { profilePicture: file }).then((response) => {
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            })
        }
    };

    const handleSaveChanges = async () => {
        try {
            await UserService.updateUser(user);
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.error("Erreur lors de la sauvegarde des modifications:", error);
        }
    };

    const handleSubscribeClick = () => {
        router.push('/subscription');
    };

    const handleCategoriesChange = (selectedCategories: any) => {

    }

    const handleProductsChange = (selectedProducts: any) => {

    }

    const handleOpenCategoryModal = () => {
        setSelectedCategories(user.company.categories);
        openCategoryModal();
    }

    return (
        <>
            <button
                onClick={() => setIsEditingPersonalProfile(!isEditingPersonalProfile)}
                className="mt-10 mx-8 bg-easyorder-black text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex justify-center items-center gap-2"
            >
                {isEditingPersonalProfile && <FaArrowLeft size={16} />}
                {isEditingPersonalProfile ? "Voir mon entreprise" : "Voir mon profil personnel"}
                {!isEditingPersonalProfile && <FaArrowRight size={16} />}
            </button>
            {isEditingPersonalProfile ?
                <ClientProfilePage/> :
                <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold text-center mb-8">Modifier mon entreprise</h1>

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
                            <h1 className="text-3xl font-bold">{user.company?.denomination || "Mon entreprise"}</h1>
                        )}
                    </div>
                    <button
                        onClick={handleSubscribeClick}
                        className="bg-easyorder-green text-white font-semibold py-2 px-4 rounded-lg hover:bg-easyorder-black transition duration-300 ml-4"
                    >
                        {user.subscriber ? "Voir mon abonnement" : "Souscrire à l'abonnement Premium"}
                    </button>
                </div>

                <div className="flex items-center w-full mb-6">
                    <div className="flex items-center">
                        <div
                            className="mr-8 w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer"
                            onClick={() => logoInputRef.current?.click()}
                        >
                            {user.company?.profile_pic ? (
                                <img src={user.company?.profile_pic} alt="Logo"
                                     className="w-full h-full object-cover rounded-full"/>
                            ) : (
                                <p className="text-center">Ajouter un logo</p>
                            )}
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
                <div className="mb-6">
                    <label className="block text-easyorder-black font-semibold mb-2">Description de l'entreprise</label>
                    <textarea
                        value={user.company?.description || ''}
                        onChange={(e) => setUser({...user, company: {...user.company, description: e.target.value}})}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        rows={5}
                    ></textarea>
                </div>

                {/* Informations entreprise */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Informations de l'entreprise</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="font-semibold">Email</label>
                            <input
                                type="email"
                                value={user.email || ''}
                                onChange={(e) => setUser({...user, email: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="font-semibold">SIREN</label>
                            <p>{user.company?.siren || 'Non défini'}</p>
                        </div>
                        <div>
                            <label className="font-semibold">SIRET</label>
                            <p>{user.company?.siret || 'Non défini'}</p>
                        </div>
                        <div>
                            <label className="font-semibold">Adresse</label>
                            <p>{user.company?.address || 'Non défini'}</p>
                        </div>
                        <div>
                            <label className="font-semibold">Code Postal</label>
                            <p>{user.company?.postalCode || 'Non défini'}</p>
                        </div>
                        <div>
                            <label className="font-semibold">Ville</label>
                            <p>{user.company?.city || 'Non défini'}</p>
                        </div>
                    </div>
                </div>

                {/* Modification du mot de passe */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Modifier le mot de passe</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="font-semibold">Nouveau mot de passe</label>
                            <input
                                type="password"
                                value={user.password || ''}
                                onChange={(e) => setUser({...user, password: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Mot de passe"
                            />
                        </div>
                        <div>
                            <label className="font-semibold">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                value={user.confirmPassword || ''}
                                onChange={(e) => setUser({...user, confirmPassword: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Confirmer le mot de passe"
                            />
                        </div>
                    </div>
                </div>

                {/* Catégories */}
                <div className="flex mb-4">
                    <button onClick={handleOpenCategoryModal}
                            className="bg-easyorder-green text-white px-4 py-2 flex items-center rounded-md hover:bg-easyorder-black transition">
                        <FaList className="mr-2"/> Modifier les catégories
                    </button>
                </div>

                {/* Liste des catégories */}
                <div className="mb-8">
                    <h3 className="font-bold mb-2">Catégories actuelles</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {categories.length > 0 ? (
                            categories.map((category, index) => (
                                <div
                                    key={index}
                                    className="bg-white shadow-sm rounded-md p-2 text-sm flex items-center justify-center text-center hover:bg-easyorder-green hover:text-white transition-all duration-300"
                                >
                                    <p className="font-medium">{category.name}</p>
                                </div>
                            ))
                        ) : (
                            <p>Aucune catégorie sélectionnée</p>
                        )}
                    </div>
                </div>

                {/* Boutons d'ajout et d'édition des produits */}
                <div className="flex mb-4">
                    <button onClick={openProductModal}
                            className="bg-easyorder-green text-white px-4 py-2 flex items-center rounded-md hover:bg-easyorder-black transition mr-2">
                        <FaList className="mr-2"/> Modifier les produits
                    </button>
                    <button onClick={() => router.push('/products/create')}
                            className="bg-easyorder-green text-white px-4 py-2 flex items-center rounded-md hover:bg-easyorder-black transition">
                        <FaPlus className="mr-2"/> Ajouter un produit
                    </button>
                </div>

                {/* Modal pour modification des catégories */}
                <Modal isOpen={isCategoryModalOpen} onClose={closeCategoryModal}>
                    <ModalContent>
                        <ModalHeader>
                            <h2>Modifier les catégories</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Select isMulti value={selectedCategories} onChange={(e: any) => setSelectedCategories(e)}
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

                {/* Modal pour modification des produits */}
                <Modal isOpen={isProductModalOpen} onClose={closeProductModal}>
                    <ModalContent>
                        <ModalHeader>
                            <h2>Modifier les produits</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Select isMulti value={selectedProducts} onChange={(e: any) => setSelectedProducts(e)}
                                    options={products.map(p => ({value: p._id, label: p.name}))}/>
                        </ModalBody>
                        <ModalFooter>
                            <button onClick={closeProductModal}
                                    className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition">
                                Annuler
                            </button>
                            <button onClick={handleProductsChange}
                                    className="bg-easyorder-green text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition">
                                Confirmer
                            </button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Produits sous forme de cartes */}
                <div className="flex flex-wrap gap-6 mb-4">
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                                 onClick={() => router.push(`/products/${product._id}`)}>
                                <h4 className="font-bold text-lg mb-2">{product.name}</h4>
                                <p className="text-gray-700">{product.description}</p>
                                <p className="text-gray-700">Prix : {product.price_in_cent / 100} €</p>
                                <p className="text-gray-700">Stock : {product.stock}</p>
                            </div>
                        ))
                    ) : (
                        <p>Aucun produit ajouté</p>
                    )}
                </div>

                <div className="flex justify-end mb-8">
                    <button
                        onClick={handleSaveChanges}
                        className="bg-easyorder-green text-white px-6 py-2 rounded-md hover:bg-easyorder-black transition"
                    >
                        <FaSave className="mr-2 inline-block"/> Sauvegarder les changements
                    </button>
                </div>
            </div>
            }
        </>


    );
};

export default VendorProfilePage;
