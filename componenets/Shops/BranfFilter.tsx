"use client";

import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

// A list of brands - in a real app, this would come from an API
const brands = ["Apple", "Samsung", "Google", "Sony", "Dell"];

const BrandFilter = () => {
  // State to track if the dropdown is open or closed
  const [isOpen, setIsOpen] = useState(true); // Start open by default
  // State to track which brands are checked
  const [selectedBrands, setSelectedBrands] = useState<Record<string, boolean>>(
    {}
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle changes to any checkbox
  const handleCheckboxChange = (brandName: string) => {
    setSelectedBrands((prev) => ({
      ...prev,
      [brandName]: !prev[brandName], // Toggle the boolean value
    }));
  };

  return (
    <div className="w-full mt-4">
      {/* Clickable header */}
      <button onClick={toggleDropdown} className="flex flex-row gap-5 ">
        <h2 className="text-black font-semibold">Brands</h2>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 " />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {/* The checklist, which only appears if the dropdown is open */}
      {isOpen && (
        <div className="mt-4 space-y-3 animate-in fade-in-0 slide-in-from-top-2 duration-300">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center space-x-3 text-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedBrands[brand] || false}
                onChange={() => handleCheckboxChange(brand)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandFilter;
