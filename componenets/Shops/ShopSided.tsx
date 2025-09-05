"use client";

import React, { useState } from "react";
import ProductCategories from "./ProductCategories";
import BrandFilter from "./BranfFilter";

const ShopSidebar = () => {
  const [price, setPrice] = useState("");

  const handleReset = () => {
    setPrice("");
  };
  return (
    <div className=" py-10 contain ">
      <h1 className="text-2xl font-semibold text-black">Shop By</h1>

      {/* Product Categories Dropdown */}
      <ProductCategories />

      {/* Divider */}
      <div className="w-[215px] h-px bg-gray-200 mt-8"></div>

      {/* Brands Filter */}
      <BrandFilter />
      {/* price */}
      <div className="mt-8">
        <h2 className="text-black font-semibold">Price</h2>
        <form className="mt-4 space-y-4">
          {/* Single input field for the price */}
          <div>
            <input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className=" px-3 py-2 border w-full bg-[#E6EFF5] border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Reset Button */}
          <button
            type="button" // Use type="button" to prevent form submission
            onClick={handleReset}
            className="w-full  h-[50px] bg-[#01589A]  text-sm text-white "
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopSidebar;
