"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

const CartPage = () => {
  const { cartItems } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-white">
      {/* Header Section */}
      <div className="w-full h-[316px] bg-gradient-to-r from-[#01589A] to-[#009CDE]">
        <div className="container mx-auto py-10 text-center flex flex-col justify-center h-full">
          <h1 className="text-5xl md:text-8xl font-bold text-white">Cart</h1>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="container mx-auto">
        <div className="flex flex-row gap-2 items-center justify-center my-4">
          <Link href="/" className="text-sm font-semibold hover:underline">
            Home
          </Link>
          <div className="h-4 w-px bg-black" />
          <span className="text-sm font-semibold text-gray-500">Cart</span>
        </div>
      </div>

      {/* Dynamic Cart Content */}
      <div className="container mx-auto py-12 px-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Your cart is empty.</p>
            <Link href="/shop">
              <button className="mt-6 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-white p-4 border rounded-lg shadow-sm"
                >
                  <div className="relative h-24 w-24 rounded-md overflow-hidden">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg h-fit">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
