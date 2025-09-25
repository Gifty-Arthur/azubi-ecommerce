import { createClient } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';

// --- Interface Definitions ---

export interface CartItem {
    id: string; // product_id
    quantity: number;
    price: number;
}

interface OrderDetails {
  userId: string;
  total_amount: number;
  shippingAddress: string;
  items: CartItem[];
}

interface Product {
    image_url: string;
}

interface OrderItem {
    products: Product | null;
}

// The UI component expects 'total' and 'status', so we use aliases in the queries
// to match this interface without changing the front-end code.
export interface Order {
  id: string;
  created_at: string;
  total: number;
  is_paid: boolean;
  status: 'Pending' | 'Delivered' | 'Shipped';
  user_id: string;
  order_items: OrderItem[];
}


// --- READ Function (For Regular Users) ---
export async function getAllOrdersWithDetails(supabase: SupabaseClient): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      // Aliasing total_amount to total and order_status to status
      .select(`
        id, 
        created_at, 
        total:total_amount, 
        is_paid, 
        status:order_status, 
        user_id, 
        order_items ( products ( image_url ) )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as any as Order[]) || [];
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}


// --- READ Function (For Admins on Server) ---
export async function getAllOrdersAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error("Missing Supabase credentials for admin access.");
    }
    
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await supabaseAdmin
        .from('orders')
        // Aliasing total_amount to total and order_status to status
        .select(`
            id, 
            created_at, 
            total:total_amount, 
            is_paid, 
            status:order_status, 
            user_id, 
            order_items ( products ( image_url ) )
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as any as Order[]) || [];
}



// --- CREATE Function ---
export async function createOrder(supabase: SupabaseClient, orderDetails: OrderDetails) {
  try {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderDetails.userId,
        total_amount: orderDetails.total_amount,
        shipping_address: orderDetails.shippingAddress,
        order_status: 'Pending' // Corrected column name
      })
      .select('id')
      .single();

    if (orderError) throw orderError;

    const orderItems = orderDetails.items.map(item => ({
      order_id: orderData.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return { success: true, orderId: orderData.id };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error('Error creating order:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

