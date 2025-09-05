import { supabase } from './supabaseClient'; // Import our new Supabase client

// Define the shape of a single product for TypeScript
// This should match the columns in your Supabase table
export interface Product {
  id: string; // uuid is a string
  created_at: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
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

