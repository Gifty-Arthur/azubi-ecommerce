"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { User as UserIcon, LogOut, ChevronDown, Package } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface UserDropdownProps {
  user: User;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // Refresh the page to update the navbar
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
      {/* This is the button that toggles the dropdown */}
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

      {/* The dropdown menu, which is only rendered if isOpen is true */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border animate-in fade-in-0 zoom-in-95">
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
            <span>Orders</span>
          </Link>
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
