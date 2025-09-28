"use server"; // This entire file runs only on the server

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Helper function to create a secure, server-side client with admin privileges.
// This is the modern and correct way to initialize the client for server actions.
const createAdminClient = () => {
    const cookieStore = cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!, // This key grants admin rights
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set(name, value, options);
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.delete(name, options);
                },
            },
        }
    );
};

/**
 * Updates an order's status to "Delivered".
 * This is a Server Action that can be called from a Client Component.
 * @param orderId The ID of the order to update.
 */
export async function markOrderAsDeliveredAction(orderId: string) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from("orders")
        .update({ order_status: "Delivered" })
        .eq("id", orderId);

    if (error) {
        console.error("Error updating order status:", error);
        return { error: "Failed to update order status." };
    }

    // Refresh the data on the details page and the main orders list
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/admin/orders`);
    return { success: "Order status updated successfully!" };
}

