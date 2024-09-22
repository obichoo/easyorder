'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProductService from '@/services/product.service';
import CategoryService from '@/services/category.service';
import { Product } from "@/models/product.model";
import { Category } from "@/models/category.model";
import getUser from "@/utils/get-user";
import Title from "@/app/components/title/page";
import Loading from "@/app/components/loading/page";

const EditProduct = () => {
    const router = useRouter();
    const { id } = useParams(); // Récupération de l'ID du produit depuis l'URL
    const [product, setProduct] = useState<Product | any>(null);
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [sizeLabel, setSizeLabel] = useState(''); // Pour le sizeLabel
    const [height, setHeight] = useState(''); // Pour la hauteur
    const [width, setWidth] = useState(''); // Pour la largeur
    const [depth, setDepth] = useState(''); // Pour la profondeur
    const [unit, setUnit] = useState('cm'); // Unité de mesure, par défaut "cm"
    const [weightValue, setWeightValue] = useState(''); // Valeur du poids
    const [weightUnit, setWeightUnit] = useState('kg'); // Unité du poids, par défaut "kg"
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [pictures, setPictures] = useState<File[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [artisanId, setArtisanId] = useState('');
    const [existingPictures, setExistingPictures] = useState<{ url: string; _id: string }[]>([]); // Pour stocker les images existantes

    // Récupération des infos de l'utilisateur connecté
    useEffect(() => {
        const user = getUser();
        if (user) {
            if (user.role == 'client') {
                router.push('/');
            }
            setArtisanId(user._id as string);
        }
    }, []);

    // Charger les catégories disponibles
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

    // Charger les infos du produit à partir de l'ID
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await ProductService.getProductById(id as string);
                const productData = response.data;

                if (productData.artisan_id !== getUser()?._id && getUser()?.role !== 'admin') {
                    router.push('/');
                    return;
                }

                // Pré-remplir les champs avec les données du produit
                setProduct(productData);
                setProductName(productData.name || '');
                setDescription(productData.description || '');
                setSizeLabel(productData.size?.sizeLabel || '');
                setHeight(productData.size?.dimensions?.height?.value?.toString() || '');
                setWidth(productData.size?.dimensions?.width?.value?.toString() || '');
                setDepth(productData.size?.dimensions?.depth?.value?.toString() || '');
                setUnit(productData.size?.dimensions?.unit || 'cm');
                setWeightValue(productData.size?.weight?.value?.toString() || '');
                setWeightUnit(productData.size?.weight?.unit || 'kg');
                setPrice((productData.price_in_cent / 100).toFixed(2) || '');
                setStock(productData.stock?.toString() || '');
                setSelectedCategories(productData.categories?.map((category: any) => category._id) || []);

                // Récupérer les images existantes
                const existingPics = productData.pictures?.map((picture: any) => ({ url: picture.url, _id: picture._id })) || [];
                setExistingPictures(existingPics);
                setPictures([]); // Remise à zéro des nouvelles images
            } catch (error) {
                console.error("Erreur lors du chargement du produit :", error);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleAddPhoto = (event: any) => {
        const files = event.target.files;
        if (files?.length) {
            setPictures(files);
        }
    };

    const handleRemoveExistingPicture = (pictureId: string) => {
        ProductService.deleteProductPicture(id as string, pictureId)
            .then(() => {
                setExistingPictures(existingPictures.filter(picture => picture._id !== pictureId));
            })
            .catch((error) => {
                console.error("Erreur lors de la suppression de l'image :", error);
            });
    };

    const handleSubmit = async () => {
        const priceInCent = parseFloat(price) * 100;
        const productData: Product = {
            _id: id as string, // Inclure l'ID pour la mise à jour
            name: productName,
            description,
            size: {
                sizeLabel,
                dimensions: {
                    height: { value: parseFloat(height), unit },
                    width: { value: parseFloat(width), unit },
                    depth: { value: parseFloat(depth), unit }
                },
                weight: { value: parseFloat(weightValue), unit: weightUnit }
            },
            price_in_cent: priceInCent,
            stock: parseInt(stock),
            initial_stock: parseInt(stock),
            categories: selectedCategories as Category[],
            artisan_id: artisanId
        };

        await ProductService.updateProduct(productData as Product).then(() => {
            if (pictures.length === 0) {
                router.push(`/products/${id}`);
                return;
            } else {
                ProductService.uploadProductPictures(id as string, pictures).then(() => {
                    router.push(`/products/${id}`);
                }).catch((error) => {
                    console.error("Erreur lors de l'ajout des photos du produit : ", error);
                });
            }
        }).catch((error) => {
            console.error("Erreur lors de la mise à jour du produit : ", error);
        });
    };

    const handleCancel = () => {
        router.push(`/products/${id}`);
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
            console.error("Erreur lors de la création de la catégorie :", error);
        }
    };

    if (!product) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-easyorder-gray flex items-center justify-center py-10">
            <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
                <Title>Modifier un produit</Title>

                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Nom du produit</label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full p-3 border  rounded-lg focus:outline-none focus:ring focus:ring-easyorder-green"
                        placeholder="Nom du produit"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 border  rounded-lg focus:outline-none focus:ring focus:ring-easyorder-green"
                        placeholder="Description du produit"
                        rows={4}
                    ></textarea>
                </div>

                {/* Taille du produit */}
                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Taille (label)</label>
                    <input
                        type="text"
                        value={sizeLabel}
                        onChange={(e) => setSizeLabel(e.target.value)}
                        className="w-full p-3 border  rounded-lg focus:outline-none focus:ring focus:ring-easyorder-green"
                        placeholder="Taille (ex: M, L)"
                    />
                </div>

                {/* Dimensions */}
                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Dimensions (L x l x H)</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            className="w-full p-3 border  rounded-lg focus:outline-none focus:ring focus:ring-easyorder-green"
                            placeholder="Longueur"
                        />
                        <input
                            type="number"
                            value={depth}
                            onChange={(e) => setDepth(e.target.value)}
                            className="w-full p-3 border  rounded-lg focus:outline-none focus:ring focus:ring-easyorder-green"
                            placeholder="Largeur"
                        />
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-full p-3 border  rounded-lg focus:outline-none focus:ring focus:ring-easyorder-green"
                            placeholder="Hauteur"
                        />
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="p-3 border  rounded-lg"
                        >
                            <option value="cm">cm</option>
                            <option value="in">in</option>
                        </select>
                    </div>
                </div>

                {/* Poids */}
                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Poids</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={weightValue}
                            onChange={(e) => setWeightValue(e.target.value)}
                            className="w-full p-3 border  rounded-lg focus:outline-none focus:ring focus:ring-easyorder-green"
                            placeholder="Poids"
                        />
                        <select
                            value={weightUnit}
                            onChange={(e) => setWeightUnit(e.target.value)}
                            className="p-3 border  rounded-lg"
                        >
                            <option value="kg">kg</option>
                            <option value="lb">lb</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Prix (€)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-3 border  rounded-lg focus:outline-none focus:ring focus:ring-easyorder-green"
                        placeholder="Prix"
                        step="0.01"
                        min={0}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Stock</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full p-3 border  rounded-lg focus:outline-none focus:ring focus:ring-easyorder-green"
                        placeholder="Quantité en stock"
                        min={0}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Catégorie</label>
                    <div className="flex flex-wrap gap-2">
                        {categories?.length > 0 ? categories.map((category) => (
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
                        )) : (
                            <span className="text-easyorder-black">Aucune catégorie disponible</span>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Nouvelle catégorie</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full px-4 py-2 border  rounded-lg focus:outline-none focus:ring focus:ring-easyorder-green"
                            placeholder="Ajouter une nouvelle catégorie"
                        />
                        <button
                            onClick={handleAddCategory}
                            className="bg-easyorder-green text-white py-2 px-4 rounded-lg hover:bg-easyorder-black transition"
                        >
                            Ajouter
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Photos existantes</label>
                    <div className="flex flex-wrap gap-2">
                        {existingPictures?.length > 0 ? (
                            existingPictures.map((picture, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={picture.url}
                                        alt={`Photo ${index + 1}`}
                                        className="w-32 h-32 object-cover rounded-lg border "
                                    />
                                    <button
                                        onClick={() => handleRemoveExistingPicture(picture._id)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                    >
                                        X
                                    </button>
                                </div>
                            ))
                        ) : (
                            <span>Aucune image existante</span>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-easyorder-black font-semibold">Nouvelle photo</label>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        multiple={true}
                        onChange={handleAddPhoto}
                        className="mb-3"
                    />
                    <div className="flex flex-wrap gap-2">
                        {[...pictures].map((file: File, index: number) => (
                            <img
                                key={index}
                                src={window.URL.createObjectURL(file)}
                                alt={`Photo ${index + 1}`}
                                className="w-32 h-32 object-cover rounded-lg border "
                            />
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={handleCancel}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-easyorder-green text-white py-2 px-4 rounded-lg hover:bg-easyorder-black transition"
                    >
                        Enregistrer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
