"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, CheckCircle } from "lucide-react";

/**
 * @param {{ product: any }} props
 */
const AddToCart = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // This effect will hide the confirmation message after 2 seconds
  useEffect(() => {
    if (showConfirmation) {
      const timer = setTimeout(() => {
        setShowConfirmation(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showConfirmation]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowConfirmation(true); // Show the confirmation message
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="mt-6">
      <p className="font-semibold mb-2">Quantity:</p>
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={decreaseQuantity}
          className="border rounded-md p-2 hover:bg-gray-100 transition-colors"
        >
          <Minus size={16} />
        </button>
        <span className="text-xl font-bold">{quantity}</span>
        <button
          onClick={increaseQuantity}
          className="border rounded-md p-2 hover:bg-gray-100 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full bg-[#01589A] text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add to Cart
      </button>

      {/* Non-blocking Confirmation Message */}
      {showConfirmation && (
        <div className="mt-4 flex items-center gap-2 text-green-600 animate-in fade-in-0">
          <CheckCircle size={20} />
          <span>Added to cart!</span>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
