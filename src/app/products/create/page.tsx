'use client';

import React, { useEffect, useState } from 'react';
import ProductService from '@/services/product.service';
import CategoryService from '@/services/category.service';
import {Product} from "@/models/product.model";

const CreateProduct = () => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [dimensions, setDimensions] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [photos, setPhotos] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [artisanId, setArtisanId] = useState('');

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setArtisanId(parsedUser._id);
        }
    }, []);

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
        const priceInCent = parseFloat(price) * 100;
        const productData = {
            name: productName,
            description,
            dimensions,
            price_in_cent: priceInCent,
            stock: parseInt(stock),
            categories: selectedCategories,
            artisan_id: artisanId,
            photos,
        };

        try {
            await ProductService.createProduct(productData as Product);
        } catch (error) {
            console.error("Erreur lors de la création du produit :", error);
        }
    };

    const handleCancel = () => {
        setProductName('');
        setDescription('');
        setDimensions('');
        setPrice('');
        setStock('');
        setSelectedCategories([]);
        setPhotos([]);
    };

    const selectCategory = (categoryId: string) => {
        if (!selectedCategories.includes(categoryId)) {
            setSelectedCategories([...selectedCategories, categoryId]);
        } else {
            setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
        }
    };

    const handleAddCategory = async () => {
        try {
            const newCategoryData = {
                name: newCategory,
                description: "Description par défaut"
            };
            const response = await CategoryService.createCategory(newCategoryData);
            setCategories([...categories, response.data]);
            setNewCategory('');
        } catch (error) {
            console.error("Erreur lors de la création de la catégorie : ", error);
        }
    };

    return (
        <div className="min-h-screen bg-easyorder-gray flex items-center justify-center py-10">
            <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-easyorder-black mb-6">Ajouter un Produit</h1>

                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Nom du Produit</label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-easyorder-green"
                        placeholder="Nom du produit"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-easyorder-green"
                        placeholder="Description du produit"
                        rows={4}
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Dimensions (L x l x H)</label>
                    <input
                        type="text"
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-easyorder-green"
                        placeholder="Dimensions"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Prix (€)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-easyorder-green"
                        placeholder="Prix"
                        step="0.01"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Stock</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-easyorder-green"
                        placeholder="Quantité en stock"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Catégorie</label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <span
                                key={category._id}
                                onClick={() => selectCategory(category._id)}
                                className={`cursor-pointer py-2 px-4 rounded-lg transition ${
                                    selectedCategories.includes(category._id)
                                        ? 'bg-easyorder-green text-white'
                                        : 'bg-gray-300 text-easyorder-black'
                                }`}
                            >
                                {category.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Nouvelle Catégorie</label>
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-easyorder-green"
                        placeholder="Ajouter une nouvelle catégorie"
                    />
                    <button
                        onClick={handleAddCategory}
                        className="mt-2 bg-easyorder-green text-white py-2 px-4 rounded-lg hover:bg-easyorder-black transition"
                    >
                        Ajouter
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Photos</label>
                    <input
                        type="file"
                        onChange={handleAddPhoto}
                        className="mb-3"
                    />
                    <div className="flex flex-wrap gap-2">
                        {photos.map((photo, index) => (
                            <img
                                key={index}
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                            />
                        ))}
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={handleSubmit}
                        className="bg-easyorder-green text-white py-2 px-4 rounded-lg hover:bg-easyorder-black transition"
                    >
                        Enregistrer
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;
