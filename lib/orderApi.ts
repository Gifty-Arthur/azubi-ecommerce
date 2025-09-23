// lib/supabase/orders.ts



// 1. We import the SupabaseClient type, not the client instance itself.

import { SupabaseClient } from '@supabase/supabase-js';

import { CartItem } from '@/context/CartContext'; // Assuming CartItem is exported from your context



// Define the shape of the data needed to create a new order.

interface OrderDetails {

  userId: string;

  totalAmount: number;

  shippingAddress: string; // This would come from a checkout form

  items: CartItem[];

}



/**

 * Creates a new order and its associated items in the database.

 * This function should be called from a Server Action on your checkout page.

 * @param supabase - An active Supabase client instance.

 * @param orderDetails - An object containing all necessary order information.

 */

// 2. The function now accepts 'supabase' as its first argument.

export async function createOrder(supabase: SupabaseClient, orderDetails: OrderDetails) {

  try {

    // Step 1: Create the main order entry in the 'orders' table.

    const { data: orderData, error: orderError } = await supabase

      .from('orders')

      .insert({

        user_id: orderDetails.userId,

        total_amount: orderDetails.totalAmount,

        shipping_address: orderDetails.shippingAddress,

        // You could add a default 'status' field here, e.g., status: 'Pending'

      })

      .select('id') // We only need the ID of the new order

      .single();



    if (orderError) throw orderError;



    // Step 2: Prepare the items for this new order.

    const orderItems = orderDetails.items.map(item => ({

      order_id: orderData.id,

      product_id: item.id,

      quantity: item.quantity,

      price: item.price, // Store the price at the time of purchase

    }));



    // Step 3: Insert all the items into the 'order_items' table.

    const { error: itemsError } = await supabase

      .from('order_items')

      .insert(orderItems);



    if (itemsError) throw itemsError;



    console.log('Order created successfully:', orderData.id);

    return { success: true, orderId: orderData.id };

} catch (error) {

 console.error('Error creating order:', error);

 // Make sure to return a consistent error shape

 const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';

return { success: false, error: errorMessage };

}

}

