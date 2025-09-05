import React from "react";
import ProductCategories from "./ProductCategories";
import BrandFilter from "./BranfFilter";

const ShopSidebar = () => {
  return (
    <div className="max-auto py-10 contain px-10">
      <h1 className="text-2xl font-semibold text-black">Shop By</h1>

      {/* Product Categories Dropdown */}
      <ProductCategories />

      {/* Divider */}
      <div className="w-[215px] h-px bg-gray-200 mt-8"></div>

      {/* Brands Filter */}
      <BrandFilter />

      <div className="mt-8">
        <h2 className="text-black font-semibold">Product Categories</h2>
      </div>
    </div>
  );
};

export default ShopSidebar;
