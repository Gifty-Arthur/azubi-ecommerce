// app/admin/products/new/page.tsx
"use client";

import React, { useTransition, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createProductAction } from "@/app/admin/products/actions";

const CreateProductPage = () => {
  const [isPending, startTransition] = useTransition();
  // State to hold and display error messages from the server action
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    setErrorMessage(null); // Clear previous errors
    startTransition(async () => {
      const result = await createProductAction(formData);
      if (result?.error) {
        // Set the error message to display it in the UI
        setErrorMessage(result.error);
      }
    });
  };

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
          <div className="flex items-center border-b pb-4 mb-8">
            <div className="flex items-center gap-8">
              <Link
                href="/admin/products"
                className="text-xl font-bold text-gray-500 hover:text-blue-600 transition-colors"
              >
                Products
              </Link>
              <h1 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1">
                Create Product
              </h1>
            </div>
          </div>

          <form action={handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div className="p-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <label className="cursor-pointer bg-blue-600 text-white text-sm font-semibold py-2 px-5 rounded-md hover:bg-blue-700 transition-colors">
                <span>Choose file</span>
                <input type="file" className="hidden" />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Note: File upload is for display only. Please paste the image
                URL below.
              </p>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="name"
                type="text"
                placeholder="Name"
                className="w-full p-3 bg-gray-100 border-gray-200 rounded-md"
                required
              />
              <input
                name="price"
                type="number"
                placeholder="Price"
                className="w-full p-3 bg-gray-100 border-gray-200 rounded-md"
                step="0.01"
                required
              />
              <input
                name="stock"
                type="number"
                placeholder="Count in stock"
                className="w-full p-3 bg-gray-100 border-gray-200 rounded-md"
                required
              />
              {/* REMOVED the input for 'brand' */}
              <input
                name="imageUrl"
                type="url"
                placeholder="Image URL (Optional)"
                className="w-full p-3 bg-gray-100 border-gray-200 rounded-md md:col-span-2"
              />
              <select
                name="category"
                defaultValue=""
                className="w-full p-3 bg-gray-100 border-gray-200 rounded-md text-gray-500 md:col-span-2"
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="laptop">Laptop</option>
                <option value="phone">Phone</option>
                <option value="camera">Camera</option>
                <option value="accessory">Accessory</option>
              </select>
            </div>

            <textarea
              name="description"
              placeholder="Description"
              rows={5}
              className="w-full p-3 bg-gray-100 border-gray-200 rounded-md"
            ></textarea>

            {/* Display Server-Side Error Messages */}
            {errorMessage && (
              <p className="text-sm text-red-600 text-center">{errorMessage}</p>
            )}

            <div className="flex justify-start items-center gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 text-white font-semibold py-2 px-10 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isPending ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
