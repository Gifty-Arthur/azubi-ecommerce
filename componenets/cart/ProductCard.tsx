"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/productApi";
import { useCart } from "@/context/CartContext";
import { Eye, Heart, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  // Create a handler that stops the click from navigating
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault(); // This stops the link navigation
    addToCart(product);
  };

  return (
    // Wrap the entire card in a Link component
    <Link href={`/product/${product.id}`} className="block">
      <div className="w-full h-[376px] bg-[#f9fbfc] rounded-lg p-4 flex flex-col items-center text-center shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
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
        <div className=" mt-6 text-black flex flex-col flex-grow">
          <h2 className="text-md font-bold ">{product.name}</h2>
          <p className="text-xs font-light h-8 mt-3 overflow-hidden  flex-grow">
            {product.description}
          </p>
          <p className=" font-semibold text-xl text-[#01589A]">
            ${product.price.toFixed(2)}
          </p>
          <div className="flex flex-row gap-8 items-center justify-center mt-auto">
            {/* Use the new handler for the button's onClick */}
            <button
              onClick={handleAddToCartClick}
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
            {/* The Eye icon is now redundant since the whole card is a link, but can be kept for design */}
            <button
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="View product"
            >
              <Eye />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
