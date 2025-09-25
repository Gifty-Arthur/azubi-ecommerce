import { SupabaseClient } from '@supabase/supabase-js';

// Define the shape of a single category for TypeScript.
// This should match the columns in your Supabase 'categories' table.
export interface Category {
  id: string;
  created_at: string;
  name: string;
  description?: string | null; // Optional field
  user_id: string;
  updated_at?: string | null; // Optional field for when updates occur
}

// Define the type for the data needed to create a new category.
// It omits fields that the database auto-generates or that aren't needed on creation.
type NewCategoryData = Omit<Category, 'id' | 'created_at' | 'updated_at' | 'description'> & { description?: string };

// Define the type for the data needed to update an existing category.
// All fields are optional, as you might only want to update one or two.
type UpdateCategoryData = Partial<Omit<Category, 'id' | 'created_at' | 'user_id'>>;


// --- READ Functions ---

/**
 * Fetches all categories from the Supabase 'categories' table.
 * @param supabase - An active Supabase client instance.
 */
export async function getAllCategories(supabase: SupabaseClient): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || []; 
  } catch (error) {
    console.error("Error fetching all categories:", error);
    return [];
  }
}

/**
 * Fetches a single category by its ID.
 * @param supabase - An active Supabase client instance.
 * @param id - The unique identifier of the category to fetch.
 */
export async function getCategoryById(supabase: SupabaseClient, id: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    return null;
  }
}


// --- CREATE Function ---

/**
 * Creates a new category in the 'categories' table.
 * @param supabase - An active Supabase client instance.
 * @param categoryData - An object containing the new category's details.
 */
export async function createCategory(supabase: SupabaseClient, categoryData: NewCategoryData): Promise<Category | null> {
    try {
        const { data, error } = await supabase
            .from('categories')
            .insert(categoryData)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error creating category:", error);
        return null;
    }
}


// --- UPDATE Function ---

/**
 * Updates an existing category in the 'categories' table.
 * @param supabase - An active Supabase client instance.
 * @param id - The ID of the category to update.
 * @param updates - An object containing the fields to update.
 */
export async function updateCategory(supabase: SupabaseClient, id: string, updates: UpdateCategoryData): Promise<Category | null> {
    try {
        const { data, error } = await supabase
            .from('categories')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Error updating category with id ${id}:`, error);
        return null;
    }
}


// --- DELETE Function ---

/**
 * Deletes a category from the 'categories' table.
 * @param supabase - An active Supabase client instance.
 * @param id - The ID of the category to delete.
 * @returns True if deletion was successful, false otherwise.
 */
export async function deleteCategory(supabase: SupabaseClient, id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error(`Error deleting category with id ${id}:`, error);
        return false;
    }
}

