"use client";

import { useState, useEffect, FormEvent } from "react";
// Removed unused router import
import { createClient } from "@supabase/supabase-js"; // Adjust this path to your Supabase client
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
} from "@/lib/supabase/Categories";

// --- Icon Component ---
const XCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
      clipRule="evenodd"
    />
  </svg>
);

export default function CategoryAdminPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const supabase = createClient(supabaseUrl, supabaseKey);
  // Removed unused router definition

  // --- State Management ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const initializePage = async () => {
      // The page will no longer redirect, but RLS policies will still protect data.
      try {
        const fetchedCategories = await getAllCategories(supabase);
        setCategories(fetchedCategories);
      } catch (err) {
        setError("Failed to fetch categories.");
      } finally {
        setIsLoading(false);
      }
    };
    initializePage();
  }, [supabase]);

  // --- Event Handlers ---
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      await handleUpdate();
    } else {
      await handleCreate();
    }
  };

  const handleCreate = async () => {
    if (!categoryName.trim()) return setError("Category name cannot be empty.");
    setIsSubmitting(true);
    setError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return setError("Authentication error. Please log in again.");

    try {
      const newCategory = await createCategory(supabase, {
        name: categoryName.trim(),
        user_id: user.id,
      });
      if (newCategory) {
        setCategories((prev) =>
          [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name))
        );
        setCategoryName("");
      } else {
        throw new Error("Creation failed.");
      }
    } catch (err) {
      setError("Failed to create category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory || !categoryName.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const updated = await updateCategory(supabase, editingCategory.id, {
        name: categoryName.trim(),
      });
      if (updated) {
        setCategories((prev) =>
          prev
            .map((c) => (c.id === updated.id ? updated : c))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
        cancelEditing();
      } else {
        throw new Error("Update failed.");
      }
    } catch (err) {
      setError("Failed to update category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const originalCategories = [...categories];
    setCategories((prev) => prev.filter((c) => c.id !== id));
    try {
      if (!(await deleteCategory(supabase, id)))
        throw new Error("Deletion failed on server.");
    } catch (err) {
      setError("Failed to delete category.");
      setCategories(originalCategories);
    }
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setError(null);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setCategoryName("");
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-2xl">
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {editingCategory ? "Update Category" : "Category"}
          </h1>
          <form onSubmit={handleFormSubmit}>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Write category name"
                className="flex-grow w-full px-4 py-2 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              {editingCategory ? (
                <>
                  <button
                    type="submit"
                    className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </form>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          <hr className="my-6" />
          <div className="flex flex-wrap gap-3">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => startEditing(category)}
                  className="bg-gray-200 pl-4 pr-2 py-2 rounded-full flex items-center gap-2 cursor-pointer hover:bg-blue-200"
                >
                  <span>{category.name}</span>
                  <button
                    onClick={(e) => handleDelete(e, category.id)}
                    className="text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-300 p-1"
                  >
                    <XCircleIcon />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No categories found.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
