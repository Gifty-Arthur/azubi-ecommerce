"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";
import ShopSidebar from "@/componenets/Shops/ShopSided";

const brands = ["Apple", "Samsung", "Lenovo", "Sony"];

const ShopPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<Record<string, boolean>>(
    {}
  );
  const [isBrandsOpen, setIsBrands] = useState(true);

  const handleCheckboxChange = (brandName: string) => {
    setSelectedBrands((prev) => ({
      ...prev,
      [brandName]: !prev[brandName],
    }));
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const isCategoriesOpen = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="">
      <div className="w-full h-[316px] bg-gradient-to-r from-[#01589A] to-[#009CDE]">
        <div className="container mx-auto py-10 text-center">
          <h1 className="text-[80px] font-bold text-white">New Arrival</h1>
          <p className="mt-1 text-white">
            Shop through our latest selection of Products
          </p>
        </div>
        {/* home and shop */}
      </div>
      <div className="">
        <div className="flex flex-row gap-2 items-center justify-center mt-4">
          <Link
            href="/"
            className="group relative flex items-center text-black  transition-colors"
          >
            <span className="text-sm font-semibold">Home</span>

            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </Link>

          <div className="h-4 w-px bg-black" />

          <Link
            href="/shop"
            className="group relative text-black  transition-colors"
          >
            <span className="text-sm font-semibold">Shop</span>

            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </Link>

          {/* shop by */}
        </div>
        <ShopSidebar />
      </div>
    </div>
  );
};

export default ShopPage;
