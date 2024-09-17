'use client';

import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; 
import Link from 'next/link'; 

// Données factices
const stockData = {
  totalSales: 1200,
  productsPending: 150,
  productsInStock: 800,
  productsOutOfStock: 50,
  topSellingProducts: [
    { id: 1, name: 'Produit A', sales: 300 },
    { id: 2, name: 'Produit B', sales: 250 },
    { id: 3, name: 'Produit C', sales: 200 },
  ],
};

// Données pour le graphique des ventes
const chartData = {
  labels: ['Produit A', 'Produit B', 'Produit C'],
  datasets: [
    {
      label: 'Ventes',
      data: [300, 250, 200],
      backgroundColor: ['#4CAF50', '#FFC107', '#FF5722'],
    },
  ],
};

// Liste de produits fictifs
const allProducts = [
  {
    id: 1,
    name: 'Vase artisanal',
    price: 29.99,
    sales: 50,
    stock: 10,
    image: 'https://via.placeholder.com/300x200?text=Vase+artisanal',
  },
  {
    id: 2,
    name: 'Lampe en bois',
    price: 49.99,
    sales: 30,
    stock: 15,
    image: 'https://via.placeholder.com/300x200?text=Lampe+en+bois',
  },
  {
    id: 3,
    name: 'Chaise en osier',
    price: 19.99,
    sales: 20,
    stock: 3,
    image: 'https://via.placeholder.com/300x200?text=Chaise+en+osier',
  },
  {
    id: 4,
    name: 'Table basse',
    price: 39.99,
    sales: 40,
    stock: 0,
    image: 'https://via.placeholder.com/300x200?text=Table+basse',
  },
];

export default function StockManagementPage() {
  const [data, setData] = useState(stockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  }, []);

  // Gestion de la recherche de produits
  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);

    const result = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredProducts(result);
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Gestion de Stock et Statistiques</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold">Total des Ventes</h2>
          <p className="text-4xl mt-2">{data.totalSales}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold">Produits en Attente</h2>
          <p className="text-4xl mt-2">{data.productsPending}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold">Produits en Stock</h2>
          <p className="text-4xl mt-2">{data.productsInStock}</p>
        </div>
        <div className="bg-red-500 text-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold">Produits Épuisés</h2>
          <p className="text-4xl mt-2">{data.productsOutOfStock}</p>
        </div>
      </div>

      {/* Top produits vendus */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Top Produits Vendus</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Produit</th>
              <th className="px-4 py-2">Ventes</th>
            </tr>
          </thead>
          <tbody>
            {data.topSellingProducts.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Graphique des ventes */}
      <div className="bg-gray-100 p-6 mt-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Statistiques de Vente</h2>
        <Bar data={chartData} />
      </div>

      {/* Barre de recherche */}
      <h2 className="text-center text-2xl font-bold mb-4 mt-8">Produits</h2>
      <form onSubmit={handleSearch} className="flex justify-center mb-8 mt-8">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Rechercher des produits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500">
            <FaSearch />
          </button>
        </div>
      </form>

      {/* Résultats de recherche */}
      {loading ? (
        <p className="text-center text-gray-500">Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProducts.map((product) => (
            //Rediriger vers la page qui ajoute/modifie un bien
            <Link key={product.id} href={`/products/${product.id}`} passHref> 
              <div
                className={`cursor-pointer shadow-md rounded-lg p-4 ${
                  product.stock === 0
                    ? 'bg-red-400 text-white'
                    : product.stock <= 5
                    ? 'bg-orange-400 text-white'
                    : 'bg-green-400 text-white'
                }`}
              >
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2" />
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-100">{product.price} €</p>
                <p className="mt-2">Stock : {product.stock}</p>
                <p className="mt-2">Ventes : {product.sales}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
