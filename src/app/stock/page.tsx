'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Link from 'next/link';
import OrderService from '@/services/order.service';
import ProductService from '@/services/product.service';
import getUser from '@/utils/get-user';
import {Product} from "@/models/product.model";

const initialChartData = {
  labels: [],
  datasets: [
    {
      label: 'Ventes',
      data: [],
      backgroundColor: ['#77ad86', '#FFC107', '#FF5722'],
    },
  ],
};

export default function StockManagementPage() {
  const [data, setData] = useState({
    totalSales: 0,
    productsPending: 0,
    productsInStock: 0,
    productsOutOfStock: 0,
    topSellingProducts: [],
  });
  const [chartData, setChartData] = useState(initialChartData);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const user = getUser();
    setUserId(user?._id || '');
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(
        allProducts.filter((product: Product) =>
          (product?.name as string).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, allProducts]);

  useEffect(() => {
    if (!userId) return;

    async function fetchData() {
      setLoading(true);

      try {
        const productsResponse = await ProductService.getProductsByUserId(userId);
        const products = productsResponse.data;

        const inStock = products.reduce((sum: any, p: any) => sum + p.stock, 0);
        const outOfStock = products.filter((p: any) => p.stock === 0).length;
        const totalProducts = products.length;

        const ordersResponse = await OrderService.getAllOrders();
        const orders = ordersResponse.data;

        const totalSales = orders
          .filter((order: any) => order.status === 'delivered' && order.items.some((item: any) => item.product_id.artisan_id._id === userId))
          .reduce((sum: any, order: any) => sum + order.total_in_cent, 0) / 100;

        const topSellingProducts = orders.flatMap((order: any) => order.items)
          .filter((item: any) => products.some((p: any) => p._id === item.product_id._id))
          .reduce((acc: any, item: any) => {
            const productIndex = acc.findIndex((p: any) => p.id === item.product_id._id);
            if (productIndex !== -1) {
              acc[productIndex].sales += item.quantity;
            } else {
              acc.push({
                id: item.product_id._id,
                name: item.product_id.name,
                sales: item.quantity,
              });
            }
            return acc;
          }, [])
          .sort((a: any, b: any) => b.sales - a.sales)
          .slice(0, 3);

        const labels = topSellingProducts.map((product: any) => product.name);
        const salesData = topSellingProducts.map((product: any) => product.sales);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Ventes',
              data: salesData,
              backgroundColor: ['#77ad86', '#FFC107', '#FF5722'],
            },
          ],
        });

        setData({
          totalSales,
          productsPending: 0,
          productsInStock: inStock,
          productsOutOfStock: outOfStock,
          topSellingProducts,
        });

        setAllProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-black text-center">Gestion du stock</h1>
      
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow-md p-4 text-center">
          <h2 className="text-lg font-semibold">Ventes totales</h2>
          <p className="text-2xl font-bold">${data.totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-md p-4 text-center">
          <h2 className="text-lg font-semibold">Produits en stock</h2>
          <p className="text-2xl font-bold">{data.productsInStock}</p>
        </div>
        <div className="bg-white shadow-md p-4 text-center">
          <h2 className="text-lg font-semibold">Produits hors stock</h2>
          <p className="text-2xl font-bold">{data.productsOutOfStock}</p>
        </div>
        <div className="bg-white shadow-md p-4 text-center">
          <h2 className="text-lg font-semibold">Produits en attente</h2>
          <p className="text-2xl font-bold">{data.productsPending}</p>
        </div>
      </div>

      <div className="bg-white shadow-md p-6 mb-8">
        <Bar data={chartData} />
      </div>

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          className="w-1/2 py-2 px-4 rounded-lg border border-gray-300 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {filteredProducts.map((product: any) => (
          <Link key={product._id} href={`/products/${product._id}`} className="bg-white shadow-md p-4 text-center">
            <img
              src={product.pictures[0] || 'https://via.placeholder.com/300x200'}
              alt={product.name}
              className="mb-4"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-500">${(product.price_in_cent / 100).toFixed(2)}</p>
            <p className={product.stock > 0 ? 'text-green-500' : 'text-red-500'}>
              {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
            </p>
          </Link>
        ))}
      </div>

      {loading && <p>Chargement des données...</p>}
    </div>
  );
}
