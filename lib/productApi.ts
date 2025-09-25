import { SupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// --- INTERFACE DEFINITION ---

// This shape should match the columns in your Supabase 'products' table.
export interface Product {
  id: string;
  created_at: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock?: number;
  user_id?: string; 
  updated_at?: string; // For the update function
}

// Types for creating and updating products
type NewProductData = Omit<Product, 'id' | 'created_at' | 'updated_at'> & { user_id: string };
type UpdateProductData = Partial<Omit<Product, 'id' | 'created_at' | 'user_id'>>;


// ================================================================= //
//    SERVER-SIDE FUNCTIONS (for Server Components, e.g., user product page)
// ================================================================= //

/**
 * Fetches a single product by its ID from the SERVER side.
 * This is safe to use in Server Components as it creates its own client.
 * @param id - The unique identifier of the product to fetch.
 */
export async function getProductById(id: string): Promise<Product | null> {
  const cookieStore = cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          // The cookieStore is awaited to resolve the promise before accessing its methods.
          return (await cookieStore).get(name)?.value;
        },
      },
    }
  );

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Server Error fetching product with id ${id}:`, error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error(`Unexpected server error in getProductById for id ${id}:`, errorMessage);
    return null;
  }
}


// ================================================================= //
//    CLIENT-SIDE FUNCTIONS (for Client Components, e.g., admin pages)
// ================================================================= //

/**
 * Fetches all products from the 'products' table.
 * @param supabase - An active Supabase client instance from a hook or client helper.
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
 * Creates a new product in the 'products' table.
 * @param supabase - An active Supabase client instance.
 * @param productData - Object with new product details, including user_id.
 */
export async function createProduct(supabase: SupabaseClient, productData: NewProductData): Promise<Product | null> {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert(productData)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error creating product:", error);
        return null;
    }
}

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
            .update({ ...updates, updated_at: new Date().toISOString() })
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

/**
 * Deletes a product from the 'products' table.
 * @param supabase - An active Supabase client instance.
 * @param id - The ID of the product to delete.
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

