// components/CarrouselBanner.tsx
"use client";

import { useState, useEffect } from 'react';

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
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval); // Clear the interval when component unmounts
    }, [banners.length]);

    const goToPreviousSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + banners.length) % banners.length);
    };

    const goToNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
    };

    return (
        <div className="relative w-full h-64 lg:h-96 overflow-hidden">
            {/* Slide */}
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img
                        src={banner.image}
                        alt={banner.alt}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}

            {/* Previous Button */}
            <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-easyorder-green text-white px-3 py-1 rounded-full shadow-lg hover:bg-easyorder-black"
                onClick={goToPreviousSlide}
            >
                ◀
            </button>

            {/* Next Button */}
            <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-easyorder-green text-white px-3 py-1 rounded-full shadow-lg hover:bg-easyorder-black"
                onClick={goToNextSlide}
            >
                ▶
            </button>
        </div>
    );
};

export default CarrouselBanner;
