// components/Account/dropDown.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  LogOut,
  ChevronDown,
  Package,
  ShieldCheck,
  LayoutGrid,
  Users,
  ShoppingBag,
} from "lucide-react";
import { User } from "@supabase/supabase-js";
// 1. REMOVE the direct import of the old supabase client
// import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
// 2. IMPORT the useAuth hook to get the correct supabase instance
import { useAuth } from "./AuthContext";

interface UserDropdownProps {
  user: User;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user }) => {
  const router = useRouter();
  // 3. GET the stable supabase client instance from our corrected AuthContext
  const { supabase } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // This line is correct and derives isAdmin internally
  const isAdmin = user.user_metadata?.is_admin === true;

  // 4. UPDATED LOGOUT FUNCTION for more reliability
  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Use router.push('/') to force a full page navigation. This is the most
    // reliable way to reset the UI and component state after logging out.
    router.push("/");
    router.refresh();
  };

  // Effect to close the dropdown if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 font-semibold"
      >
        <span>{user.user_metadata?.full_name || user.email}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border animate-in fade-in-0 zoom-in-95">
          {isAdmin ? (
            // Admin Menu
            <>
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold"
              >
                <ShieldCheck size={16} />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <ShoppingBag size={16} />
                <span>Products</span>
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LayoutGrid size={16} />
                <span>Category</span>
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Package size={16} />
                <span>Orders</span>
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Users size={16} />
                <span>Users</span>
              </Link>
              <div className="border-t my-1"></div>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <UserIcon size={16} />
                <span>Profile</span>
              </Link>
            </>
          ) : (
            // Regular User Menu
            <>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <UserIcon size={16} />
                <span>Profile</span>
              </Link>
              <Link
                href="/orders"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Package size={16} />
                <span>My Orders</span>
              </Link>
            </>
          )}

          {/* Logout is available to both users and admins */}
          <div className="border-t my-1"></div>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
