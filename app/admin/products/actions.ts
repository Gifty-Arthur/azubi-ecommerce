// app/admin/products/actions.ts
"use server";

import { createClient } from "@/lib/supabaseClient";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- CREATE PRODUCT ACTION ---
export async function createProductAction(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // 1. Extract and prepare data from the form.
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const stock = formData.get("stock") as string;
  const imageUrl = formData.get("imageUrl") as string;

  // 2. Validate the incoming data.
  const numericPrice = parseFloat(price);
  const numericStock = parseInt(stock, 10);

  if (!name.trim() || !price.trim() || !stock.trim()) {
    return { error: "Name, Price, and Stock are required." };
  }
  if (isNaN(numericPrice) || numericPrice < 0) {
    return { error: "Price must be a valid, positive number." };
  }
  if (isNaN(numericStock) || numericStock < 0) {
    return { error: "Stock must be a valid, positive whole number." };
  }

  // 3. Insert the new product into the database.
  const { error } = await supabase
    .from("products")
    .insert({
      name,
      description,
      price: numericPrice,
      stock: numericStock,
      image_url: imageUrl || null,
    });

  // 4. Handle any potential errors.
  if (error) {
    console.error("Error creating product:", error);
    return { error: `Failed to create product: ${error.message}` };
  }

  // 5. Invalidate the cache for the product list page.
  revalidatePath("/admin/products");

  // 6. Redirect the user back to the product list.
  redirect("/admin/products");
}


// --- UPDATE PRODUCT ACTION ---
export async function updateProductAction(productId: string, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const stock = formData.get("stock") as string;
  const imageUrl = formData.get("imageUrl") as string;

  const numericPrice = parseFloat(price);
  const numericStock = parseInt(stock, 10);

  if (!name.trim() || !price.trim() || !stock.trim()) {
      return { error: "Name, Price, and Stock are required." };
  }
  if (isNaN(numericPrice) || numericPrice < 0) {
    return { error: "Price must be a valid, positive number." };
  }
  if (isNaN(numericStock) || numericStock < 0) {
    return { error: "Stock must be a valid, positive whole number." };
  }

  const { error } = await supabase
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

  if (error) {
    console.error("Error updating product:", error);
    return { error: `Failed to update product: ${error.message}` };
  }

  revalidatePath("/admin/products");
  return { success: "Product updated successfully!" };
}

// --- DELETE PRODUCT ACTION ---
export async function deleteProductAction(productId: string) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
    
    if (error) {
        console.error("Error deleting product:", error);
        return { error: `Failed to delete product: ${error.message}` };
    }

    revalidatePath("/admin/products");
    return { success: "Product deleted successfully!" };
}

