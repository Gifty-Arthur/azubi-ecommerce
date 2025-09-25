// app/admin/products/edit/[productId]/page.tsx
"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/componenets/Account/AuthContext";
import { ArrowLeft, AlertCircle } from "lucide-react";
import {
  updateProductAction,
  deleteProductAction,
} from "@/app/admin/products/actions";

const EditProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;
  const { supabase } = useAuth();

  // State for form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // State for UI feedback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState("");

  const [isPending, startTransition] = useTransition();

  // Data fetching logic remains the same
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (fetchError) {
        setError(`Product not found or failed to fetch.`);
      } else if (data) {
        setName(data.name);
        setOriginalName(data.name);
        setDescription(data.description || "");
        setPrice(data.price);
        setStock(data.stock);
        setImageUrl(data.image_url || "");
      }
      setLoading(false);
    };
    if (supabase) fetchProduct();
  }, [productId, supabase]);

  // --- UPDATED Delete Logic ---
  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      startTransition(async () => {
        const result = await deleteProductAction(productId);
        if (result?.error) {
          setError(result.error);
        } else {
          // On success, the client handles the navigation.
          alert("Product deleted successfully!");
          router.push("/admin/products");
        }
      });
    }
  };

  // --- UPDATED Form Submission (Client-side handler) ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget); // Get form data

    startTransition(async () => {
      const result = await updateProductAction(productId, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(
          result.success || "Product updated successfully! Redirecting..."
        );
        // On success, client navigates after a short delay for user to see the message.
        setTimeout(() => {
          router.push("/admin/products");
        }, 1500);
      }
    });
  };

  if (loading) {
    return (
      <p className="text-center p-8 text-gray-500">Loading product data...</p>
    );
  }

  if (error && !originalName) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 flex flex-col items-center gap-2 mb-4">
          <AlertCircle size={24} />
          <span>{error}</span>
        </div>
        <Link href="/admin/products" className="text-blue-600 hover:underline">
          &larr; Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold"
          >
            <ArrowLeft size={20} />
            Back
          </Link>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center border-b pb-4 mb-8">
            <div className="flex items-center gap-8">
              <Link
                href="/admin/products"
                className="text-xl font-bold text-gray-500 hover:text-blue-600 transition-colors"
              >
                Products
              </Link>
              <h1 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1">
                Update Product
              </h1>
            </div>
          </div>
          {/* The form now calls our client-side handleSubmit function */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-48 h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-contain p-2 rounded-lg"
                    unoptimized
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>
              <label className="cursor-pointer bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                <span>Choose file</span>
                <input type="file" className="hidden" />
              </label>
              <p className="text-xs text-gray-500">
                Note: File upload is for display only. Please paste URL below.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inputs must have a 'name' attribute for FormData */}
              <input
                name="name"
                type="text"
                placeholder="Apple MacBook Pro 2019 | 16”"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-md"
                required
              />
              <input
                name="price"
                type="number"
                placeholder="$749.99"
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                  )
                }
                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-md"
                step="0.01"
                required
              />
              <input
                name="stock"
                type="number"
                placeholder="20 (Stock)"
                value={stock}
                onChange={(e) =>
                  setStock(
                    e.target.value === "" ? "" : parseInt(e.target.value)
                  )
                }
                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-md"
                required
              />
              <input
                name="category"
                type="text"
                placeholder="Apple (Category)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-md"
              />
              <input
                name="imageUrl"
                type="url"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-md md:col-span-2"
              />
            </div>

            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="RAM 16.0 GB | Memory 512 GB Keyboard layout Eng (English)"
              rows={4}
              className="w-full p-3 bg-gray-100 border border-gray-200 rounded-md"
            ></textarea>

            {/* These error/success states will now display feedback from the server action */}
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-sm text-center">{success}</p>
            )}

            <div className="flex justify-end items-center gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isPending ? "Updating..." : "Update"}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="bg-red-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
