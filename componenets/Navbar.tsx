"use client";

import React from "react";
import Link from "next/link";
import { Home, Store, ShoppingCart, Heart, LogIn, User } from "lucide-react";
import AuthModals from "./AuthModals";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const { cartCount } = useCart();
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto  py-4 flex justify-between items-center">
        <div>
          <Link href="/" className="text-black font-bold text-2xl">
            Azushop
          </Link>
        </div>

        {/* Navigation Links with Icons */}
        <div className="flex items-center space-x-8">
          {/* Home Link */}
          <Link
            href="/"
            className="group relative flex items-center text-black  transition-colors"
          >
            <div className="flex flex-row items-center gap-1.5">
              <Home className="w-6 h-6" />
              <span className="text-sm font-semibold">Home</span>
            </div>
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </Link>

          {/* Shop Link */}
          <Link
            href="/shop"
            className="group relative flex items-center text-black  transition-colors"
          >
            <div className="flex flex-row items-center gap-1.5">
              <Store className="w-6 h-6" />
              <span className="text-sm font-semibold">Shop</span>
            </div>
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </Link>

          {/* Cart Link */}
          <Link
            href="/cart"
            className="group relative flex items-center text-black transition-colors"
          >
            {/* 4. Use a relative container for the badge */}
            <div className="relative flex flex-row items-center gap-1.5">
              <ShoppingCart className="w-6 h-6" />
              <span className="text-sm font-semibold">Cart</span>
              {/* 5. Conditionally render the badge if cartCount > 0 */}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </Link>

          {/* Favourite Link */}
          <Link
            href="/favourites"
            className="group relative flex items-center text-black  transition-colors"
          >
            <div className="flex flex-row items-center gap-1.5">
              <Heart className="w-6 h-6" />
              <span className="text-sm font-semibold">Favourite</span>
            </div>
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </Link>
        </div>

        {/* login and register */}
        <div className="flex flex-row gap-4">
          <AuthModals />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
