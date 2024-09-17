'use client';

import { useState, useRef } from "react";
import { FaUpload, FaPlus, FaSave, FaTimes, FaEdit, FaList } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // For redirection to product creation page
import Select from 'react-select'; // Import React Select
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";

const EditProfile = () => {
    const router = useRouter(); // Used for redirection
    const [banner, setBanner] = useState<string>("");
    const [logo, setLogo] = useState<string>("");
    const [companyName, setCompanyName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [isEditingCompanyName, setIsEditingCompanyName] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<any[]>(categories);
    const [selectedProducts, setSelectedProducts] = useState<any[]>(products);

    // Options for the categories and products
    const categoryOptions = [
        { value: 'Mode', label: 'Mode' },
        { value: 'Décoration', label: 'Décoration' },
        { value: 'Alimentation', label: 'Alimentation' },
    ];

    const productOptions = [
        { value: 'Vêtement', label: 'Vêtement' },
        { value: 'Décoration', label: 'Décoration' },
        { value: 'Aliment', label: 'Aliment' },
    ];

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

    // Mise à jour des catégories
    const updateCategories = () => {
        setCategories(selectedCategories);
        closeCategoryModal();
    };

    // Mise à jour des produits
    const updateProducts = () => {
        setProducts(selectedProducts);
        closeProductModal();
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
            </div>

            {/* Bannière */}
            <div className="flex justify-between items-center mb-4">
                <div
                    className="flex-grow bg-gray-200 h-32 flex items-center justify-center rounded-xl shadow cursor-pointer"
                    onClick={() => bannerInputRef.current?.click()}
                >
                    {banner ? (
                        <img
                            src={banner}
                            alt="Bannière"
                            className="h-full w-full object-cover rounded-md"
                        />
                    ) : (
                        <span>Ajouter une bannière</span>
                    )}
                </div>
                <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerUpload}
                />
            </div>

            {/* Logo et description */}
            <div className="flex items-center mb-8">
                <div
                    className="mr-8 w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer"
                    onClick={() => logoInputRef.current?.click()}
                >
                    {logo ? (
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        <div className="w-full h-full object-cover rounded-full bg-easyorder-green flex items-center justify-center">
                            <p className="text-center">Ajouter un logo</p>
                        </div>
                    )}
                </div>
                <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                />
                <div className="flex-grow">
                    <textarea
                        className="w-full h-24 p-2 border border-gray-300 rounded-md outline-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description de l'entreprise"
                    />
                </div>
            </div>

            {/* Catégories */}
            <div className="flex mb-8">
                <button
                    onClick={openCategoryModal}
                    className="bg-easyorder-green text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition mr-2 flex items-center"
                >
                    <FaList className="mr-2" /> Modifier la liste des catégories
                </button>
            </div>
            <div className="bg-gray-200 p-4 rounded-md mb-8">
                <h3 className="font-bold mb-2">Liste des catégories pour être référencé</h3>
                <ul>
                    {categories.length > 0 ? (
                        categories.map((category, index) => <li key={index} className="mb-2">{category.label}</li>)
                    ) : (
                        <p>Aucune catégorie ajoutée</p>
                    )}
                </ul>
            </div>

            {/* Produits */}
            <div className="flex mb-8">
                <button
                    onClick={openProductModal}
                    className="bg-easyorder-green text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition mr-2 flex items-center"
                >
                    <FaList className="mr-2" /> Modifier la liste des produits
                </button>
                <button
                    onClick={() => router.push('/products/create')}
                    className="bg-easyorder-green text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition flex items-center"
                >
                    <FaPlus className="mr-2" /> Ajouter un produit
                </button>
            </div>
            <div className="bg-gray-200 p-4 rounded-md mb-8">
                <h3 className="font-bold mb-2">Liste des produits ajoutés</h3>
                <ul>
                    {products.length > 0 ? (
                        products.map((product: any, index: any) => <li key={index} className="mb-2">{product.label}</li>)
                    ) : (
                        <p>Aucun produit ajouté</p>
                    )}
                </ul>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-4">
                <button className="bg-easyorder-green text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition flex items-center">
                    <FaSave className="mr-2" /> Enregistrer
                </button>
                <button className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition flex items-center">
                    <FaTimes className="mr-2" /> Annuler
                </button>
            </div>

            {/* Modal pour ajout/modification de la liste des catégories */}
            <Modal isOpen={isCategoryModalOpen} onClose={closeCategoryModal}>
                <ModalContent>
                    <>
                        <ModalHeader>
                            <h2>Modifier la liste des catégories</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Select
                                isMulti
                                value={selectedCategories}
                                onChange={setSelectedCategories}
                                options={categoryOptions}
                                className="outline-none"
                            />
                        </ModalBody>
                        <ModalFooter>
                            <button className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition" onClick={closeCategoryModal}>
                                Annuler
                            </button>
                            <button className="bg-easyorder-green text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition" onClick={updateCategories}>
                                Confirmer
                            </button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>

            {/* Modal pour ajout/modification de la liste des produits */}
            <Modal isOpen={isProductModalOpen} onClose={closeProductModal}>
                <ModalContent>
                    <>
                        <ModalHeader>
                            <h2>Modifier la liste des produits</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Select
                                isMulti
                                value={selectedProducts}
                                onChange={setSelectedProducts}
                                options={productOptions}
                                className="outline-none"
                            />
                        </ModalBody>
                        <ModalFooter>
                            <button className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition" onClick={closeProductModal}>
                                Annuler
                            </button>
                            <button className="bg-easyorder-green text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition" onClick={updateProducts}>
                                Confirmer
                            </button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default EditProfile;
