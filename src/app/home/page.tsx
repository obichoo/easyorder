'use client';

import { useEffect, useState } from "react";
import ProductService from "@/services/product.service";
import CategoryService from "@/services/category.service";
import { Product } from "@/models/product.model";
import { Category } from "@/models/category.model";
import Carousel, {CarouselSlide} from "@/app/components/carousel/page";
import UserService from "@/services/user.service";
import {EmblaOptionsType} from "embla-carousel";

const Home = () => {
    const [artisansSlides, setArtisansSlides] = useState<CarouselSlide[]>([]);
    const [categoriesSlides, setCategoriesSlides] = useState<CarouselSlide[]>([]);
    const [productsSlides, setProductsSlides] = useState<CarouselSlide[]>([]);
    const [options, setOptions] = useState<EmblaOptionsType>({
        loop: true,
    });

    const shuffleArray = (array: any[]) => {
        return array.sort(() => Math.random() - 0.5);
    };

    const getCategoriesSlides = () => {
            CategoryService.getAllCategories().then((response) => {
                const categories = response.data.map((category: Category): CarouselSlide => ({
                    link: `/search?category=${category._id}`,
                    text: category.name as string,
                    data: category
                }));
                setCategoriesSlides(categories);
            })
    };

    const getProductsSlides = () => {
        ProductService.getAllProducts().then((response) => {
            const shuffledProducts = shuffleArray(response.data).map((product: Product): CarouselSlide => ({
                link: `/products/${product._id}`,
                image: (product.pictures as Array<any>)?.[0]?.url,
                text: product.name as string,
                data: product
            }));
            setProductsSlides(shuffledProducts);
        })
    }

    const getArtisansSlides =  () => {
        UserService.getAllArtisans().then((response) => {
            const artisans = response.data.map((user: any): CarouselSlide  => ({
                link: `/artisans/${user._id}`,
                image: user.company?.banner_pic,
                text: user.company?.denomination
            }));
            setArtisansSlides(artisans);
        })
    }

    useEffect(() => {
        getArtisansSlides();
        getCategoriesSlides()
        getProductsSlides()
    }, []);

    return (
        <div className="bg-[#e7e6e6]">
            <main className="mt-8 px-6">
                <Carousel slidesPerView={1} slidesHeight="250px" slidesSpacing="2rem" key="artisans-carousel" options={options} slides={artisansSlides} />

                {/* Catégories */}
                <div className="mt-12 mb-8">
                    <h2 className="text-center text-2xl font-bold mb-6 text-[#032035]">Explorez les Catégories</h2>
                    {categoriesSlides.length > 0 ? (
                        <Carousel type="category" slidesPerView={7} slidesHeight="30px" slidesSpacing="1rem" key="categories-carousel" options={options} slides={categoriesSlides} />
                    ) : (
                        <p className="text-center col-span-6 text-lg text-[#032035]">Aucune catégorie disponible</p>
                    )}
                </div>

                {/* Liste des produits */}
                <div className="mt-12 mb-12">
                    <h2 className="text-center text-2xl font-bold mb-6 text-[#032035]">Nos Produits</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {productsSlides.length > 0 ? (
                            <Carousel type="product" slidesPerView={4} slidesHeight="200px" slidesSpacing="2rem" key="products-carousel" options={options} slides={productsSlides} />
                        ) : (
                            <p className="text-center col-span-4 text-lg text-[#032035]">Aucun produit disponible</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
