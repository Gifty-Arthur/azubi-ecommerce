"use client";

import { useState, useEffect, FormEvent } from "react";
// Corrected import paths to use relative paths
import { createClient } from "@supabase/supabase-js";
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
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const fetchedCategories = await getAllCategories(supabase);
        setCategories(fetchedCategories);
      } catch (err) {
        console.error(err); // Use the 'err' variable
        setError("Failed to fetch categories. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [supabase]);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      await handleUpdate();
    } else {
      await handleCreate();
    }
  };

  const handleCreate = async () => {
    if (!categoryName.trim()) {
      setError("Category name cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be logged in to create a category.");
      setIsSubmitting(false);
      return;
    }

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
        throw new Error("Category creation returned null.");
      }
    } catch (err) {
      console.error(err); // Use the 'err' variable
      setError("Failed to create category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory || !categoryName.trim()) {
      setError("Category name cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const updated = await updateCategory(supabase, editingCategory.id, {
        name: categoryName.trim(),
      });
      if (updated) {
        setCategories((prev) =>
          prev
            .map((cat) => (cat.id === updated.id ? updated : cat))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
        cancelEditing();
      } else {
        throw new Error("Category update returned null.");
      }
    } catch (err) {
      console.error(err); // Use the 'err' variable
      setError("Failed to update category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const originalCategories = [...categories];
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    try {
      const success = await deleteCategory(supabase, id);
      if (!success) {
        throw new Error("Failed to delete from the server.");
      }
    } catch (err) {
      console.error(err); // Use the 'err' variable
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

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-2xl">
        <div className="mb-4">
          <a
            href="/admin"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </a>
        </div>
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
                placeholder={
                  editingCategory
                    ? "Update category name"
                    : "Write new category name"
                }
                className="flex-grow w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              {editingCategory ? (
                <>
                  <button
                    type="submit"
                    className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </form>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          <hr className="my-6 border-gray-200" />
          <div className="flex flex-wrap gap-3">
            {isLoading ? (
              <p className="text-gray-500">Loading categories...</p>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => startEditing(category)}
                  className="bg-gray-200 text-gray-800 text-sm font-medium pl-4 pr-2 py-2 rounded-full flex items-center gap-2 transition-all duration-200 ease-in-out cursor-pointer hover:bg-blue-200"
                >
                  <span>{category.name}</span>
                  <button
                    onClick={(e) => handleDelete(e, category.id)}
                    className="text-gray-500 hover:text-red-600 focus:outline-none rounded-full hover:bg-gray-300 p-1"
                  >
                    <XCircleIcon />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No categories found. Add one above!
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
