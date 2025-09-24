// app/admin/products/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/componenets/Account/AuthContext";
import { Edit, AlertCircle, ArrowLeft } from "lucide-react";

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
  const { supabase } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
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
  }, [supabase]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold"
          >
            <ArrowLeft size={20} />
            Back
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Header with Tabs and Total Count */}
          <div className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-[#01589A] border-b-2 border-[#01589A] pb-1">
                Products
              </h1>
              <Link
                href="/admin/products/new"
                className="text-xl font-bold text-gray-500 hover:text-[#01589A] transition-colors"
              >
                Create Product
              </Link>
            </div>
            <div className="text-lg font-semibold text-gray-700">
              Total: {products.length}
            </div>
          </div>

          {/* Main Content: Product Grid */}
          <div className="mt-8">
            {loading ? (
              <p className="text-center p-12 text-gray-500">
                Loading products...
              </p>
            ) : error ? (
              <div className="text-center p-12 text-red-600 flex flex-col items-center gap-2">
                <AlertCircle size={24} />
                <span>{error}</span>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden group"
                  >
                    <div className="relative w-full h-56 bg-gray-100">
                      <Image
                        src={
                          product.image_url ||
                          "https://placehold.co/400x400/EFEFEF/AAAAAA?text=No+Image"
                        }
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                    <div className="p-4 flex flex-col items-center">
                      <h2 className="text-lg font-bold text-gray-800 truncate">
                        {product.name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1 h-10 overflow-hidden">
                        {product.description || "No description available."}
                      </p>
                      <p className="text-lg font-semibold text-[#01589A] mt-2">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-row items-between justify-between p-8">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="text-gray-500 hover:text-[#01589A]"
                        title="Edit Product"
                      >
                        <Edit size={20} />
                      </Link>
                      <span className="text-xs text-gray-400">
                        {new Date(product.created_at).toLocaleDateString(
                          "en-GB"
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No products found.</p>
                <Link
                  href="/admin/products/new"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  Create your first product
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;
