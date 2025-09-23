// lib/supabase/products.ts

import { SupabaseClient } from '@supabase/supabase-js';

// Define the shape of a single product for TypeScript.
// This should match the columns in your Supabase 'products' table.
export interface Product {
  id: string;
  created_at: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock?: number;
}

// Define the type for the data needed to create a new product.
// It's the same as Product but without the fields that the database auto-generates (id, created_at).
type NewProductData = Omit<Product, 'id' | 'created_at'>;

// Define the type for the data needed to update an existing product.
// All fields are optional, as you might only want to update one or two.
type UpdateProductData = Partial<NewProductData>;


// --- READ Functions ---

/**
 * Fetches all products from the Supabase 'products' table.
 * @param supabase - An active Supabase client instance.
 */
export async function getAllProducts(supabase: SupabaseClient): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || []; 
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

/**
 * Fetches a single product by its ID.
 * @param supabase - An active Supabase client instance.
 * @param id - The unique identifier of the product to fetch.
 */
export async function getProductById(supabase: SupabaseClient, id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
}


// --- CREATE Function ---

/**
 * Creates a new product in the 'products' table.
 * @param supabase - An active Supabase client instance.
 * @param productData - An object containing the new product's details.
 */
export async function createProduct(supabase: SupabaseClient, productData: NewProductData): Promise<Product | null> {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert(productData)
            .select() // Use .select() to return the newly created record
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error creating product:", error);
        return null;
    }
}


// --- UPDATE Function ---

/**
 * Updates an existing product in the 'products' table.
 * @param supabase - An active Supabase client instance.
 * @param id - The ID of the product to update.
 * @param updates - An object containing the fields to update.
 */
export async function updateProduct(supabase: SupabaseClient, id: string, updates: UpdateProductData): Promise<Product | null> {
    try {
        const { data, error } = await supabase
            .from('products')
            .update({ ...updates, updated_at: new Date().toISOString() }) // Recommended to have an 'updated_at' column
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Error updating product with id ${id}:`, error);
        return null;
    }
}


// --- DELETE Function ---

/**
 * Deletes a product from the 'products' table.
 * @param supabase - An active Supabase client instance.
 * @param id - The ID of the product to delete.
 * @returns True if deletion was successful, false otherwise.
 */
export async function deleteProduct(supabase: SupabaseClient, id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error(`Error deleting product with id ${id}:`, error);
        return false;
    }
}

