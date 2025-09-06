import React from "react";
import Image from "next/image";
import { getProductById } from "../../../lib/productApi";
import AddToCart from "../../../componenets/cart/AddToCart";
import Link from "next/link";

const ProductDetailPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const product = await getProductById(id);

  // If no product is found, show a message
  if (!product) {
    return <div className="text-center py-20">Product not found.</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-row gap-2 items-center justify-center my-4">
          <Link href="/" className="text-sm font-semibold hover:underline">
            Home
          </Link>
          <div className="h-4 w-px bg-black" />
          <span className="text-sm font-semibold text-gray-500">
            Shop details
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mt-20">
        {/* Product Image */}
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

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4 text-[16px]">
            {product.description}
          </p>
          <p className="text-[32px] font-bold text-[#01589A] mb-4">
            ${product.price.toFixed(2)}
          </p>
          <div className="flex items-center mb-6">
            <span className="text-green-600 font-semibold">In Stock</span>
          </div>

          {/* Interactive AddToCart component */}
          <AddToCart product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
