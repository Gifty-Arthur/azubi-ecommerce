import { supabase } from './supabaseClient';

// Define the shape of a single product for TypeScript
// This should match the columns in your Supabase table
export interface Product {
  id: string; // uuid is a string
  created_at: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock?: number; // Added stock as an optional field
}

/**
 * Fetches all products from the Supabase 'products' table.
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    // Use the Supabase client to fetch data
    const { data, error } = await supabase
      .from('products') // Select the 'products' table
      .select('*');    // Get all columns

    // If there was an error during the fetch, throw it
    if (error) {
      throw error;
    }

    // If successful, return the data
    return data || []; 
  } catch (error) {
    console.error("Error fetching products from Supabase:", error);
    return []; // Return an empty array on error
  }
}

/**
 * Fetches a single product by its ID.
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id) // Find the row where the 'id' column equals the provided id
      .single();   // Expect only one result

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
}

