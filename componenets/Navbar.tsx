"use client";

import React from "react";
import Link from "next/link";
import { Home, Store, ShoppingCart, Heart } from "lucide-react";
import AuthModals from "./AuthModals";
import UserDropdown from "./Account/dropDown";
import { useCart } from "@/context/CartContext";
import { useAuth } from "./Account/AuthContext";

// Define navigation links as an array for easier management
const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: Store },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/favourites", label: "Favourite", icon: Heart },
];

const Navbar = () => {
  const { cartCount } = useCart();
  // Pull user and loading status from the authentication context.
  const { user, loading } = useAuth();

  // --- Loading State ---
  // Shows a skeleton UI while the user's session is being checked.
  // This prevents the UI from flickering between login/logout states.
  if (loading) {
    return (
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-black font-bold text-2xl">Azushop</div>
          <div className="hidden md:flex items-center space-x-8">
            <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* --- Logo --- */}
        <Link href="/" className="text-black font-bold text-2xl">
          Azushop
        </Link>

        {/* --- Navigation Links --- */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const LinkIcon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative flex items-center text-black transition-colors"
              >
                <div className="flex flex-row items-center gap-1.5">
                  <LinkIcon className="w-6 h-6" />
                  <span className="text-sm font-semibold">{link.label}</span>
                  {/* --- Cart Badge --- */}
                  {link.href === "/cart" && cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                {/* --- Underline Animation --- */}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </Link>
            );
          })}
        </div>

        {/* --- Authentication Section --- */}
        <div>
          {/*
           * This is the corrected logic.
           * It passes ONLY the 'user' object. The UserDropdown component
           * is responsible for checking user.user_metadata to see if the
           * user is an admin.
           */}
          {user ? <UserDropdown user={user} /> : <AuthModals />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
