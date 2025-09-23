// app/admin/products/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
// 1. IMPORT the useAuth hook to get the correct supabase instance
import { useAuth } from "@/componenets/Account/AuthContext";
import { PlusCircle, Edit, Trash2, Search, AlertCircle } from "lucide-react";

// Define a type for your product for better code quality and autocompletion
interface Product {
  id: number;
  name: string;
  price: number;
  description: string | null;
  stock: number;
  image_url: string | null;
  created_at: string;
}

const AdminProductsPage = () => {
  // 2. GET the stable supabase client instance from our corrected AuthContext
  const { supabase } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase.from("products").select("*");

    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`);
    }

    query = query.order("created_at", { ascending: false });
    const { data, error: supabaseError } = await query;

    if (supabaseError) {
      console.error("Error fetching products:", supabaseError);
      setError(
        "Could not fetch products. Please check the console and RLS policies."
      );
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }, [searchTerm, supabase]); // Add supabase to the dependency array

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (productId: number, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .match({ id: productId });

      if (deleteError) {
        console.error("Error deleting product:", deleteError);
        alert(`Failed to delete product: ${deleteError.message}`);
      } else {
        fetchProducts();
      }
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Products
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your store's inventory.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
        >
          <PlusCircle size={20} />
          Add New Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name..."
            className="w-full max-w-sm border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Main Content: Product Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden ring-1 ring-black ring-opacity-5">
        {loading ? (
          <p className="text-center p-12 text-gray-500">Loading products...</p>
        ) : error ? (
          <div className="text-center p-12 text-red-600 flex flex-col items-center gap-2">
            <AlertCircle size={24} />
            <span>{error}</span>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-md object-cover"
                            src={
                              product.image_url ||
                              "https://placehold.co/48x48/EFEFEF/AAAAAA?text=No+Image"
                            }
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        ${product.price.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.stock > 10
                            ? "bg-green-100 text-green-800"
                            : product.stock > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1"
                      >
                        <Edit size={16} /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-red-600 hover:text-red-900 ml-4 inline-flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-500">
                    No products found.{" "}
                    {searchTerm && "Try adjusting your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
