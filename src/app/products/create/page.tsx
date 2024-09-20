'use client';

import { useEffect, useState } from 'react';
import ProductService from '@/services/product.service'; // Service pour les produits
import CategoryService from '@/services/category.service'; // Service pour les catégories

const CreateProduct = () => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [dimensions, setDimensions] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [photos, setPhotos] = useState<any[]>([]); // Photos ajoutées
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Stocker plusieurs catégories sélectionnées
    const [categories, setCategories] = useState<any[]>([]); // Liste des catégories venant de l'API
    const [newCategory, setNewCategory] = useState(''); // Pour la création d'une nouvelle catégorie
    const [artisanId, setArtisanId] = useState(''); // ID de l'artisan

    // Récupérer l'ID de l'utilisateur connecté (artisan) depuis le local storage
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setArtisanId(parsedUser._id); // Définir l'ID de l'utilisateur (artisan)
        }
    }, []);

    // Récupérer les catégories depuis l'API lors du chargement de la page
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryService.getAllCategories();
                setCategories(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement des catégories :", error);
            }
        };
        fetchCategories();
    }, []);

    const handleAddPhoto = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            setPhotos((prevPhotos: any) => [...prevPhotos, window.URL.createObjectURL(file)]);
        }
    };

    const handleSubmit = async () => {
        // Convertir le prix en centimes avant l'envoi
        const priceInCent = parseFloat(price) * 100;

        // Préparer les données à envoyer, y compris l'ID de l'artisan et les catégories sélectionnées
        const productData = {
            name: productName,
            description,
            dimensions,
            price_in_cent: priceInCent,
            stock: parseInt(stock),
            categories: selectedCategories, // Envoyer les catégories sélectionnées sous forme de tableau
            artisan_id: artisanId, // Utiliser l'ID de l'utilisateur connecté (artisan)
            photos, // Gérer ici les images
        };

        try {
            await ProductService.createProduct(productData);
            console.log("Produit créé avec succès");
        } catch (error) {
            console.error("Erreur lors de la création du produit :", error);
        }
    };

    const handleCancel = () => {
        // Réinitialisation du formulaire
        setProductName('');
        setDescription('');
        setDimensions('');
        setPrice('');
        setStock('');
        setSelectedCategories([]); // Réinitialiser les catégories sélectionnées
        setPhotos([]); // Réinitialisation des photos
    };

    const selectCategory = (categoryId: string) => {
        if (!selectedCategories.includes(categoryId)) {
            setSelectedCategories([...selectedCategories, categoryId]); // Ajouter la catégorie si elle n'est pas déjà sélectionnée
        } else {
            // Supprimer la catégorie si elle est déjà sélectionnée
            setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
        }
    };

    const handleAddCategory = async () => {
        try {
            const newCategoryData = {
                name: newCategory,
                description: "Description par défaut" // Description par défaut
            };
            const response = await CategoryService.createCategory(newCategoryData);
            setCategories([...categories, response.data]); // Ajouter la nouvelle catégorie à la liste
            setNewCategory('');
        } catch (error) {
            if (error.response) {
                console.error("Erreur lors de la création de la catégorie : ", error.response.data);
            } else {
                console.error("Erreur lors de la création de la catégorie : ", error.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-easyorder-gray">
            {/* Section principale avec espace sous la navbar */}
            <div className="mt-8 px-6 py-8">
                <h1 className="text-center text-2xl font-semibold text-easyorder-black mb-8">Ajouter un bien</h1>

                {/* Formulaire */}
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <div className="mb-6">
                        <label className="block text-easyorder-black font-semibold mb-2">Nom du bien</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Nom du bien"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-easyorder-black font-semibold mb-2">Description du bien</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Description du bien"
                            rows={5}
                        ></textarea>
                    </div>

                    <div className="mb-6">
                        <label className="block text-easyorder-black font-semibold mb-2">Dimensions (L x l x H)</label>
                        <input
                            type="text"
                            value={dimensions}
                            onChange={(e) => setDimensions(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Dimensions"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-easyorder-black font-semibold mb-2">Prix en euros</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Prix"
                            step="0.01"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-easyorder-black font-semibold mb-2">Nombre en stock</label>
                        <input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Stock"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-easyorder-black font-semibold mb-2">Catégorie</label>
                        <div className="flex flex-wrap gap-4">
                            {categories.map((category) => (
                                <span
                                    key={category._id}
                                    onClick={() => selectCategory(category._id)} // Sélectionner/désélectionner l'ID de la catégorie
                                    className={`cursor-pointer py-2 px-4 rounded-lg ${
                                        selectedCategories.includes(category._id)
                                            ? 'bg-easyorder-green text-white'
                                            : 'bg-gray-300 text-easyorder-black'
                                    } hover:bg-easyorder-green hover:text-white transition duration-200`}
                                >
                                    {category.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-easyorder-black font-semibold mb-2">Ajouter une nouvelle catégorie</label>
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Nouvelle catégorie"
                        />
                        <button
                            onClick={handleAddCategory}
                            className="mt-2 bg-easyorder-green text-white py-2 px-4 rounded-lg hover:bg-easyorder-black"
                        >
                            Ajouter la catégorie
                        </button>
                    </div>

                    <div className="mb-6">
                        <label className="block text-easyorder-black font-semibold mb-2">Ajouter des photos</label>
                        <input
                            type="file"
                            onChange={handleAddPhoto}
                            className="mb-3"
                        />
                        <div className="flex flex-wrap gap-4">
                            {photos.map((photo: any, index: any) => (
                                <img
                                    key={index}
                                    src={photo}
                                    alt={`Photo ${index + 1}`}
                                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handleSubmit}
                            className="bg-easyorder-green text-white py-2 px-4 rounded-lg hover:bg-easyorder-black"
                        >
                            Enregistrer
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;
