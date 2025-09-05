"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/lib/productApi";
import { useCart } from "@/context/CartContext"; // Corrected import path
import { Eye, Heart, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="w-full h-[425px] bg-[#f9fbfc] rounded-lg p-4 flex flex-col items-center text-center shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
      <div
        className={
          product.name === "Iphone 15"
            ? "relative w-[126px] h-[168px]"
            : "relative w-full h-[168px]"
        }
      >
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      <div className="mt-3 text-black flex flex-col flex-grow">
        <h2 className="text-md font-bold ">{product.name}</h2>
        <p className="text-xs font-light h-8 overflow-hidden my-1 flex-grow">
          {product.description}
        </p>
        <p className="mt-1 font-semibold text-xl text-[#01589A]">
          ${product.price.toFixed(2)}
        </p>
        <div className="flex flex-row gap-8 items-center justify-center mt-auto">
          {/* This is now a clickable button */}
          <button
            onClick={() => addToCart(product)}
            className="text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart />
          </button>
          <button
            className="text-gray-600 hover:text-red-500 transition-colors"
            aria-label="Add to favourites"
          >
            <Heart />
          </button>
          <button
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="View product"
          >
            <Eye />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
