"use server"; // This entire file runs only on the server

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Helper function to create a secure, server-side client with admin privileges.
const createAdminClient = async () => {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!, // This key grants admin rights
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options?: CookieOptions) {
                    // Next.js cookies().set accepts a single object parameter
                    cookieStore.set({ name, value, ...(options as any) });
                },
                remove(name: string, options?: CookieOptions) {
                    // cookies().delete accepts either a name or an options object; pass an object with the name
                    cookieStore.delete({ name, ...(options as any) } as any);
                },
            },
        }
    );
};

/**
 * Updates an order's status.
 * This is a Server Action that can be called from a Client Component.
 * @param orderId The ID of the order to update.
 */
export async function updateOrderStatusAction(orderId: string, newStatus: string) {
    const supabase = await createAdminClient();
    const { error } = await supabase
        .from("orders")
        .update({ order_status: newStatus })
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

