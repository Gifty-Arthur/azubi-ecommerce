// app/admin/products/edit/[productId]/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, AlertCircle } from "lucide-react";

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams(); // Hook to get dynamic route parameters from the URL
  const productId = params.productId as string; // e.g., '123'

  // State for form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [imageUrl, setImageUrl] = useState("");

  // State for UI feedback
  const [loading, setLoading] = useState(true); // True initially to fetch data
  const [submitting, setSubmitting] = useState(false); // For form submission
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // --- Data Fetching ---
  // Fetch the existing product data when the component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Product ID is missing from the URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId) // Filter by the product ID from the URL
        .single(); // Expect only one record

      if (fetchError) {
        console.error("Error fetching product:", fetchError);
        setError(
          `Product not found or failed to fetch. Please check the ID and RLS policies.`
        );
      } else if (data) {
        // Populate the form fields with the fetched data
        setName(data.name);
        setDescription(data.description || "");
        setPrice(data.price);
        setStock(data.stock);
        setImageUrl(data.image_url || "");
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  // --- Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!name || price === "" || stock === "") {
      setError("Name, Price, and Stock are required fields.");
      setSubmitting(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("products")
      .update({
        name,
        description,
        price,
        stock,
        image_url: imageUrl || null,
        updated_at: new Date().toISOString(), // Recommended to have an 'updated_at' column
      })
      .eq("id", productId); // CRITICAL: Only update the product with this specific ID

    if (updateError) {
      console.error("Error updating product:", updateError);
      setError(`Failed to update product: ${updateError.message}`);
    } else {
      setSuccess("Product updated successfully!");
      // Wait a moment to show the success message before redirecting
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh(); // Invalidate the cache for the product list page to show new data
      }, 1500);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <p className="text-center p-8 text-gray-500">Loading product data...</p>
    );
  }

  // If there was an error and we couldn't load the product name
  if (error && !name) {
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
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Edit Product
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Update the details for:{" "}
            <span className="font-medium text-gray-700">{name}</span>
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md ring-1 ring-black ring-opacity-5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                  )
                }
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700"
              >
                Stock Quantity
              </label>
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) =>
                  setStock(
                    e.target.value === "" ? "" : parseInt(e.target.value, 10)
                  )
                }
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/product-image.jpg"
            />
          </div>

          {/* Feedback Messages */}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Link
              href="/admin/products"
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
