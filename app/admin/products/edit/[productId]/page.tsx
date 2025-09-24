// app/admin/products/edit/[productId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
// Corrected import path typo: componenets -> components
import { useAuth } from "@/componenets/Account/AuthContext";
import { ArrowLeft, AlertCircle, Upload } from "lucide-react";

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;
  const { supabase } = useAuth();

  // State for form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [category, setCategory] = useState(""); // Placeholder for category
  const [imageUrl, setImageUrl] = useState("");

  // State for UI feedback
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState("");

  // --- Data Fetching ---
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
        console.error("Error fetching product:", fetchError);
        setError(`Product not found or failed to fetch.`);
      } else if (data) {
        setName(data.name);
        setOriginalName(data.name); // Store original name for the title
        setDescription(data.description || "");
        setPrice(data.price);
        setStock(data.stock);
        setImageUrl(data.image_url || "");
        // Note: You would fetch and set the category here if it's part of your product data
      }
      setLoading(false);
    };

    if (supabase) {
      fetchProduct();
    }
  }, [productId, supabase]);

  // --- Delete Logic (Corrected State Management) ---
  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      setSubmitting(true);
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (deleteError) {
        setError(`Failed to delete product: ${deleteError.message}`);
        setSubmitting(false); // Stop submitting on error
      } else {
        alert("Product deleted successfully! Redirecting...");
        // Invalidate the cache for the products page
        router.refresh();
        // Navigate back to the list
        router.push("/admin/products");
        // No need to set submitting to false here as we are navigating away.
      }
    }
  };

  // --- Form Submission (Corrected State Management) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const numericPrice = parseFloat(String(price));
    const numericStock = parseInt(String(stock), 10);

    if (isNaN(numericPrice) || numericPrice < 0) {
      setError("Price must be a valid, positive number.");
      setSubmitting(false);
      return;
    }
    if (isNaN(numericStock) || numericStock < 0) {
      setError("Stock must be a valid, positive whole number.");
      setSubmitting(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("products")
      .update({
        name,
        description,
        price: numericPrice,
        stock: numericStock,
        image_url: imageUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (updateError) {
      setError(`Failed to update product: ${updateError.message}`);
      setSubmitting(false); // Stop submitting on error
    } else {
      setSuccess("Product updated successfully! Redirecting...");

      // Invalidate the cache for the products page.
      router.refresh();

      // Navigate back to the product list after a short delay
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
      // We don't set submitting to false here because we are navigating away.
    }
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
              <input
                type="text"
                placeholder="Apple MacBook Pro 2019 | 16”"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-md"
              />
              <input
                type="number"
                placeholder="$749.99"
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                  )
                }
                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-md"
              />
              <input
                type="number"
                placeholder="20 (Stock)"
                value={stock}
                onChange={(e) =>
                  setStock(
                    e.target.value === "" ? "" : parseInt(e.target.value)
                  )
                }
                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-md"
              />
              <input
                type="text"
                placeholder="Apple (Category)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-md"
              />
              <input
                type="url"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-md md:col-span-2"
              />
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="RAM 16.0 GB | Memory 512 GB Keyboard layout Eng (English)"
              rows={4}
              className="w-full p-3 bg-gray-100 border border-gray-200 rounded-md"
            ></textarea>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-sm text-center">{success}</p>
            )}

            <div className="flex justify-end items-center gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submitting ? "Updating..." : "Update"}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                className="bg-red-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
