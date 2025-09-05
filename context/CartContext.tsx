"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
// Assuming you have a Product type defined in your productApi file
import { Product } from "@/lib/productApi";

// Define the shape of a cart item, which can include quantity
export interface CartItem extends Product {
  quantity: number;
}

// Define the shape of the context value
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  cartCount: number;
}

// Create the context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a custom hook to easily use the cart context in other components
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Create the provider component that will wrap your app
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // If it exists, increase the quantity
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If it's a new item, add it to the cart with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Calculate the total number of items in the cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
