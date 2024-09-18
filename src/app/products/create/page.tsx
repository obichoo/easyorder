// pages/CreateProduct.tsx
"use client";

import { useState } from 'react';
import Navbar from '../../components/navbar/page'; // Import de la navbar

const CreateProduct = () => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [dimensions, setDimensions] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [photos, setPhotos] = useState<any>([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const categories = ["Poterie", "Sculptures", "Bijoux", "Vêtements", "Verres", "Décoration"]; // Exemples de catégories

    const handleAddPhoto = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            setPhotos((prevPhotos: any) => [...prevPhotos, window.URL.createObjectURL(file)]);
        }
    };

    const handleSubmit = () => {
        // Logic de soumission
        console.log("Produit enregistré");
    };

    const handleCancel = () => {
        // Reset du formulaire
        setProductName('');
        setDescription('');
        setDimensions('');
        setPrice('');
        setStock('');
        setSelectedCategory('');
        setPhotos([]);
    };

    const selectCategory = (category: any) => {
        setSelectedCategory(category);
    };

    return (
        <div className="min-h-screen bg-easyorder-gray">
            {/* Navbar */}
            <Navbar />

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
                        <label className="block text-easyorder-black font-semibold mb-2">Prix</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Prix"
                        />
                    </div>

                    {/* Champ pour le nombre en stock */}
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

                    {/* Sélection de catégorie avec des étiquettes */}
                    <div className="mb-6">
                        <label className="block text-easyorder-black font-semibold mb-2">Catégorie</label>
                        <div className="flex flex-wrap gap-4">
                            {categories.map((category) => (
                                <span
                                    key={category}
                                    onClick={() => selectCategory(category)}
                                    className={`cursor-pointer py-2 px-4 rounded-lg ${
                                        selectedCategory === category
                                            ? 'bg-easyorder-green text-white'
                                            : 'bg-gray-300 text-easyorder-black'
                                    } hover:bg-easyorder-green hover:text-white transition duration-200`}
                                >
                  {category}
                </span>
                            ))}
                        </div>
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
