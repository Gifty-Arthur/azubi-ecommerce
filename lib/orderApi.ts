import { supabase } from './supabaseClient';
import { CartItem } from '@/context/CartContext';

interface OrderDetails {
  userId: string;
  totalAmount: number;
  shippingAddress: string;
  items: CartItem[];
}

/**
 * Creates a new order and its associated items in the database.
 */
export async function createOrder(orderDetails: OrderDetails) {
  try {
    // Step 1: Create the main order entry
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderDetails.userId,
        total_amount: orderDetails.totalAmount,
        shipping_address: orderDetails.shippingAddress,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Step 2: Prepare the items for this order
    const orderItems = orderDetails.items.map(item => ({
      order_id: orderData.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    // Step 3: Insert all the items into the order_items table
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return { success: true, orderId: orderData.id };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error };
  }
}

