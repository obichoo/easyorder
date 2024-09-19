"use client";

import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import des icônes

const CarrouselBanner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const banners = [
        { id: 1, image: 'https://via.placeholder.com/1200x400?text=Entreprise+1', alt: 'Entreprise 1' },
        { id: 2, image: 'https://via.placeholder.com/1200x400?text=Entreprise+2', alt: 'Entreprise 2' },
        { id: 3, image: 'https://via.placeholder.com/1200x400?text=Entreprise+3', alt: 'Entreprise 3' },
        { id: 4, image: 'https://via.placeholder.com/1200x400?text=Entreprise+4', alt: 'Entreprise 4' },
        { id: 5, image: 'https://via.placeholder.com/1200x400?text=Entreprise+5', alt: 'Entreprise 5' },
    ];

    // Change slide every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [banners.length]);

    const goToPreviousSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + banners.length) % banners.length);
    };

    const goToNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
    };

    return (
        <div className="relative w-full h-64 lg:h-96 overflow-hidden rounded-lg shadow-lg">
            {/* Slide */}
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <img
                        src={banner.image}
                        alt={banner.alt}
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
            ))}

            {/* Previous Button */}
            <button
                className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 bg-[#77ad86] text-white p-3 rounded-full shadow-lg hover:bg-[#032035] transition duration-200"
                onClick={goToPreviousSlide}
            >
                <FaArrowLeft size={20} />
            </button>

            {/* Next Button */}
            <button
                className="absolute z-10 right-4 top-1/2 transform -translate-y-1/2 bg-[#77ad86] text-white p-3 rounded-full shadow-lg hover:bg-[#032035] transition duration-200"
                onClick={goToNextSlide}
            >
                <FaArrowRight size={20} />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {banners.map((_, index) => (
                    <div
                        key={index}
                        className={`h-3 w-3 rounded-full ${index === currentSlide ? 'bg-[#77ad86]' : 'bg-gray-300'} transition-all duration-300`}
                    />
                ))}
            </div>
        </div>
    );
};

export default CarrouselBanner;
