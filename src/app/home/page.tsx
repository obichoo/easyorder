// pages/index.tsx ou Home.tsx

import Navbar from '../components/navbar/page';
import CarrouselBanner from '../components/carousel/page';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100">

            <main className="mt-8 px-6">

                <CarrouselBanner />


                <div className="mt-12 mb-8">
                    <h2 className="text-center text-lg font-semibold mb-4 text-easyorder-black">Catégories cliquables</h2>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                        {["Poterie", "Sculptures", "Bijoux", "Vêtements", "Verres", "Décoration"].map((category, index) => (
                            <button
                                key={index}
                                className="bg-easyorder-green text-white hover:bg-easyorder-black py-2 px-4 rounded-lg transition duration-200"
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Liste des produits */}
                <div className="mt-12 mb-12"> {/* Ajout de marges */}
                    <h2 className="text-center text-lg font-semibold mb-4 text-easyorder-black">Produits</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="bg-white border border-easyorder-green h-48 flex justify-center items-center rounded-lg text-easyorder-black">
                                Produit
                            </div>
                        ))}
                    </div>
                </div>
            </main>

        </div>
    );
};

export default Home;
