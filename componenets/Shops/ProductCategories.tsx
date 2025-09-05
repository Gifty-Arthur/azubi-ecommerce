"use client";

import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const ProductCategories = () => {
  // State to track if the dropdown is open or closed.
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full">
      {/* Clickable header */}
      <button onClick={toggleDropdown} className="flex  flex-row gap-5">
        <h2 className="text-black font-semibold">Product Categories</h2>

        {isOpen ? (
          <ChevronUp className="w-5 h-5 mt-0.5" />
        ) : (
          <ChevronDown className="w-5 h-5 mt-0.5" />
        )}
      </button>

      {/* The category list, which only appears if the dropdown is open */}
      {isOpen && (
        <div className="mt-4 space-y-2 text-gray-700 animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <p>Laptop (4)</p>
          <p>Phones (3)</p>
          <p>Cameras (5)</p>
          <p>Watches (3)</p>
        </div>
      )}
    </div>
  );
};

export default ProductCategories;
