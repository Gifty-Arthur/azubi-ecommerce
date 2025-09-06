"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../context/CartContext"; // Corrected import path
import { Trash2 } from "lucide-react";

const CartPage = () => {
  const { cartItems, updateItemQuantity, removeFromCart } = useCart();

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
              <button className="mt-6 bg-[#01589A] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#D4EEF9] transition-colors">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items Table */}
            <div className="lg:col-span-2">
              <table className="w-full text-left">
                <thead className="border-b">
                  <tr>
                    <th className="font-semibold text-lg p-2">Product</th>
                    <th className="font-semibold text-lg p-2 text-center">
                      Price
                    </th>
                    <th className="font-semibold text-lg p-2 text-center">
                      Quantity
                    </th>
                    <th className="font-semibold text-lg p-2 text-center">
                      Total
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">
                        <div className="flex items-center gap-4">
                          <div className="relative h-24 w-24 rounded-md overflow-hidden">
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <span className="font-semibold">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="p-2 text-center">
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            updateItemQuantity(
                              item.id,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-20 p-2 border rounded-md"
                        >
                          {[...Array(10).keys()].map((i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2 font-semibold text-center">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              <button className="mt-6 w-full bg-[#01589A] text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors">
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
