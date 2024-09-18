import { FaInstagram, FaSnapchat, FaTwitter, FaGlobe, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

async function fetchArtisanById(id: string) {
  const artisans = [
    {
      id: 1,
      name: 'Entreprise 1',
      address: '123 Rue des Artisans, Ville, Pays',
      description: 'Description de l\'entreprise 1',
      logo: '/path/to/logo1.png',
      banner: '/path/to/logo1.png',
      products: [
        { name: 'Produit 1', price: 50, image: '/path/to/product1.jpg' },
        { name: 'Produit 2', price: 75, image: '/path/to/product2.jpg' },
      ],
      reviews: [
        { name: 'Client 1', comment: 'Super service!', rating: 4.5 },
        { name: 'Client 2', comment: 'Produits de qualité!', rating: 5 }
      ],
    },
    {
      id: 2,
      name: 'Entreprise 2',
      address: '456 Avenue du Travail, Ville, Pays',
      description: 'Description de l\'entreprise 2',
      logo: '/path/to/logo2.png',
      banner: '/path/to/logo1.png',
      products: [
        { name: 'Produit A', price: 100, image: '/path/to/productA.jpg' },
        { name: 'Produit B', price: 150, image: '/path/to/productB.jpg' },
      ],
      reviews: [
        { name: 'Client A', comment: 'Excellent!', rating: 5 },
        { name: 'Client B', comment: 'Très satisfait!', rating: 4 }
      ],
    }
  ];

  return artisans.find((artisan) => artisan.id === parseInt(id));
}

// Fonction pour afficher les étoiles en fonction de la note
const RatingStars = ({ rating }: any) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="text-yellow-500" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-500" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="text-yellow-500" />
      ))}
    </div>
  );
};

export default async function Page({ params }: any) {
  const { id } = params; // Récupérer l'ID de l'URL
  const artisan = await fetchArtisanById(id);

  if (!artisan) {
    return <div>Artisan non trouvé.</div>;
  }

  return (
    <div>
      {/* Bannière */}
      <div className="h-48 bg-gray-400 flex items-center justify-center">
      <img
          src={artisan.banner}
        />
      </div>

      {/* Logo et nom */}
      <div className="container mx-auto mt-6 flex items-center justify-center">
        <img
          src={artisan.logo}
          alt={`Logo de ${artisan.name}`}
          className="w-24 h-24 mr-4 rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold">{artisan.name}</h1>
          <p className="text-gray-600 text-sm">{artisan.address}</p>
          <p className="text-lg mt-4">{artisan.description}</p>
        </div>
      </div>

      {/* Carrousel de produits */}
      <div className="container mx-auto mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-center">Nos Produits</h2>
        <div className="flex overflow-x-auto space-x-4 p-4">
          {artisan.products.map((product, index) => (
            <div key={index} className="min-w-[200px] p-4 bg-white shadow-md rounded-lg">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-2" />
              <p className="text-center font-semibold">{product.name}</p>
              <p className="text-center text-gray-500">{product.price} €</p>
            </div>
          ))}
        </div>
      </div>

      {/* Commentaires */}
      <div className="container mx-auto mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-center">Avis Clients</h2>
        <div className="space-y-4">
          {artisan.reviews.map((review, index) => (
            <div key={index} className="p-4 bg-white shadow-md rounded-lg">
              <p className="font-semibold">{review.name}</p>
              <RatingStars rating={review.rating} />
              <p className="mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Réseaux sociaux */}
      <div className="container mx-auto mt-12 mb-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Suivez-nous sur les réseaux sociaux</h2>
        <div className="flex justify-center space-x-6">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="w-8 h-8 text-gray-700 hover:text-gray-900" />
          </a>
          <a href="https://www.snapchat.com" target="_blank" rel="noopener noreferrer">
            <FaSnapchat className="w-8 h-8 text-gray-700 hover:text-gray-900" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="w-8 h-8 text-gray-700 hover:text-gray-900" />
          </a>
          <a href="https://www.companywebsite.com" target="_blank" rel="noopener noreferrer">
            <FaGlobe className="w-8 h-8 text-gray-700 hover:text-gray-900" />
          </a>
        </div>
      </div>
    </div>
  );
}
