'use client';

import { useState, useRef, useEffect } from 'react';
import { FaUpload, FaPlus, FaSave, FaTimes, FaEdit, FaList } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import ProductService from '@/services/product.service';
import CategoryService from '@/services/category.service';

const VendorProfilePage = () => {
    const router = useRouter();
    const [banner, setBanner] = useState<string>('');
    const [logo, setLogo] = useState<string>('');
    const [companyName, setCompanyName] = useState<string>('Nom de l\'entreprise');
    const [description, setDescription] = useState<string>('Description de l\'entreprise');
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<any>([]);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [address, setAddress] = useState<string>('Adresse de l\'entreprise');
    const [postalCode, setPostalCode] = useState<string>('12345');
    const [city, setCity] = useState<string>('Ville de l\'entreprise');
    const [email, setEmail] = useState<string>('contact@entreprise.com');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [siren, setSiren] = useState<string>('123456789');
    const [siret, setSiret] = useState<string>('12345678901234');
    const [subscriber, setSubscriber] = useState<boolean>(false);
    const [etat, setEtat] = useState<string>('en attente');
    const [isEditingCompanyName, setIsEditingCompanyName] = useState<boolean>(false);

    // Gestion des modales pour catégories et produits
    const { isOpen: isCategoryModalOpen, onOpen: openCategoryModal, onClose: closeCategoryModal } = useDisclosure();
    const { isOpen: isProductModalOpen, onOpen: openProductModal, onClose: closeProductModal } = useDisclosure();

    // Références pour les inputs de fichier invisibles
    const bannerInputRef = useRef<HTMLInputElement | null>(null);
    const logoInputRef = useRef<HTMLInputElement | null>(null);

    // Gestion des fichiers pour bannière et logo
    const handleBannerUpload = (e: any) => {
        const file = e.target.files[0];
        if (file) setBanner(URL.createObjectURL(file));
    };

    const handleLogoUpload = (e: any) => {
        const file = e.target.files[0];
        if (file) setLogo(URL.createObjectURL(file));
    };

    // Fonction pour charger les produits créés par l'utilisateur connecté
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Récupérer l'utilisateur connecté depuis le local storage
                const user = localStorage.getItem('user');
                if (user) {
                    const parsedUser = JSON.parse(user);
                    const artisanId = parsedUser._id; // Récupérer l'ID de l'utilisateur (artisan)

                    // Appel à l'API pour récupérer les produits de cet utilisateur
                    const response = await ProductService.getProductsByUserId(artisanId);
                    setProducts(response.data);
                } else {
                    console.error("Utilisateur non trouvé dans le local storage");
                }
            } catch (error) {
                console.error("Erreur lors du chargement des produits :", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await CategoryService.getAllCategories();
                setCategories(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement des catégories :", error);
            }
        };

        fetchProducts();
        fetchCategories();
    }, []);

    // Fonction pour mettre à jour les catégories sélectionnées
    const updateCategories = () => {
        setCategories(selectedCategories);
        closeCategoryModal();
    };

    // Fonction pour mettre à jour les produits sélectionnés
    const updateProducts = () => {
        setProducts(selectedProducts);
        closeProductModal();
    };

    // Fonction pour rediriger vers la page de souscription
    const handleSubscribeClick = () => {
        router.push('/subscription');
    };

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-center items-center mb-8">
                {isEditingCompanyName ? (
                    <input
                        type="text"
                        className="border p-2 rounded-md text-3xl font-bold outline-none"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                ) : (
                    <h1 className="text-3xl font-bold">{companyName || "Mon entreprise"}</h1>
                )}
                <button
                    onClick={() => setIsEditingCompanyName(!isEditingCompanyName)}
                    className="ml-4 bg-easyorder-green text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition flex items-center"
                >
                    <FaEdit className="mr-2" /> {isEditingCompanyName ? "Enregistrer" : "Modifier"}
                </button>
                <button
      onClick={handleSubscribeClick}
      className="bg-easyorder-green text-white font-semibold py-2 px-4 rounded-lg hover:bg-easyorder-black transition duration-300 ml-4"
    >
      Souscrire à l'abonnement Premium
    </button>
            </div>

            {/* Bannière */}
            <div className="flex justify-between items-center mb-4">
                <div
                    className="flex-grow bg-gray-200 h-32 flex items-center justify-center rounded-xl shadow cursor-pointer"
                    onClick={() => bannerInputRef.current?.click()}
                >
                    {banner ? (
                        <img src={banner} alt="Bannière" className="h-full w-full object-cover rounded-md"/>
                    ) : (
                        <span>Ajouter une bannière</span>
                    )}
                </div>
                <input ref={bannerInputRef} type="file" accept="image/*" className="hidden"
                       onChange={handleBannerUpload}/>
            </div>

            {/* Logo */}
            <div className="flex items-center mb-8">
                <div
                    className="mr-8 w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer"
                    onClick={() => logoInputRef.current?.click()}
                >
                    {logo ? (
                        <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-full"/>
                    ) : (
                        <div
                            className="w-full h-full object-cover rounded-full bg-easyorder-green flex items-center justify-center">
                            <p className="text-center">Ajouter un logo</p>
                        </div>
                    )}
                </div>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload}/>
            </div>

            {/* Description de l'entreprise */}
            <div className="mb-6">
                <label className="block text-easyorder-black font-semibold mb-2">Description de l'entreprise</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Description de l'entreprise"
                    rows={5}
                ></textarea>
            </div>

            {/* Informations de l'entreprise non modifiables */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 className="text-xl font-semibold mb-4">Informations de l'entreprise</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="font-semibold">SIREN</label>
                        <p>{siren}</p>
                    </div>
                    <div>
                        <label className="font-semibold">SIRET</label>
                        <p>{siret}</p>
                    </div>
                    <div>
                        <label className="font-semibold">Adresse</label>
                        <p>{address}</p>
                    </div>
                    <div>
                        <label className="font-semibold">Code Postal</label>
                        <p>{postalCode}</p>
                    </div>
                    <div>
                        <label className="font-semibold">Ville</label>
                        <p>{city}</p>
                    </div>
                    <div>
                        <label className="font-semibold">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Mot de passe"
                        />
                    </div>
                    <div>
                        <label className="font-semibold">Confirmer le mot de passe</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Confirmer le mot de passe"
                        />
                    </div>
                </div>
            </div>

            {/* Catégories */}
            <div className="flex mb-4">
                <button onClick={openCategoryModal}
                        className="bg-easyorder-green text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition">
                    <FaList className="mr-2"/> Modifier les catégories
                </button>
            </div>

            {/* Liste des catégories */}
            <div className="bg-gray-200 rounded-md mb-8 p-4">
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
                        className="bg-easyorder-green text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition mr-2">
                    <FaList className="mr-2"/> Modifier les produits
                </button>
                <button onClick={() => router.push('/products/create')}
                        className="bg-easyorder-green text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition">
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
                        <Select isMulti value={selectedCategories} onChange={setSelectedCategories}
                                options={categories.map(c => ({value: c._id, label: c.name}))}/>
                    </ModalBody>
                    <ModalFooter>
                        <button onClick={closeCategoryModal}
                                className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition">
                            Annuler
                        </button>
                        <button onClick={updateCategories}
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
                        <button onClick={updateProducts}
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

        </div>
    );
};

export default VendorProfilePage;
