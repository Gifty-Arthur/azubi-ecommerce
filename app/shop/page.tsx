import React from "react";
import Link from "next/link";
import Image from "next/image";
import ShopSidebar from "@/componenets/Shops/ShopSided";
import { getAllProducts, Product } from "@/lib/productApi";
import ProductCard from "@/componenets/cart/ProductCard";

// This is an async Server Component to fetch data
const ShopPage = async () => {
  // Fetch products directly from Supabase on the server
  const products = await getAllProducts();

  return (
    <div className="bg-white">
      {/* Header Section */}
      <div className="w-full h-[316px] bg-gradient-to-r from-[#01589A] to-[#009CDE]">
        <div className="container mx-auto py-10 text-center flex flex-col justify-center h-full">
          <h1 className="text-5xl md:text-8xl font-bold text-white">
            New Arrivals
          </h1>
          <p className="mt-2 text-white">
            Shop through our latest selection of Products
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="container mx-auto">
        <div className="flex flex-row gap-2 items-center justify-center my-4">
          <Link href="/" className="text-sm font-semibold hover:underline">
            Home
          </Link>
          <div className="h-4 w-px bg-black" />
          <span className="text-sm font-semibold text-gray-500">Shop</span>
        </div>
      </div>

      {/* Main Content Area with Sidebar and Product Grid */}
      <div className="container mx-auto flex flex-col md:flex-row gap-8 py-8 px-4">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <ShopSidebar />
        </aside>

        {/* Product Grid */}
        <main className="w-full md:w-3/4 lg:w-4/5">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: Product) => (
                // 2. Use the interactive ProductCard for each product
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No products found. Please check your Supabase table for data.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
