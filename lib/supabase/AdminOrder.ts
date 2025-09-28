import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
  product_name?: string; // Optional: Added for order details
}

interface OrderItem {
  products: Product | null;
  quantity?: number; // Optional: Added for order details
  price?: number; // Optional: Added for order details
}

// For lists of orders (your original interface)
export interface Order {
  id: string;
  created_at: string;
  total: number;
  is_paid: boolean;
  status: 'Pending' | 'Delivered' | 'Shipped';
  user_id: string;
  order_items: OrderItem[];
}

// ✨ NEW: Interface for a single, detailed order page
export interface OrderDetailsData {
  id: string;
  order_code: string; // The user-friendly ID like 'AK-1129-2289.GH'
  total_amount: number;
  shipping_cost: number;
  tax: number;
  payment_method: string;
  profiles: { // Assumes you have a 'profiles' table linked by user_id
    full_name: string;
    email: string;
  } | null;
  order_items: {
    quantity: number;
    price: number;
    products: { // Assumes a 'products' table
      product_name: string;
      image_url: string;
    } | null;
  }[];
}


// --- READ Function (For Regular Users) ---
export async function getAllOrdersWithDetails(supabase: SupabaseClient): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
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

// ✨ NEW: READ Function for a single order's details page
export async function getOrderById(orderId: string): Promise<OrderDetailsData | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase credentials for admin access.");
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        order_code,
        total_amount,
        shipping_cost,
        tax,
        payment_method,
        profiles ( full_name, email ),
        order_items (
          quantity,
          price,
          products ( product_name, image_url )
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.error("Order not found:", orderId);
        return null;
      }
      throw error;
    }

    return data as OrderDetailsData;

  } catch (error) {
    console.error("Error fetching order details:", error);
    return null;
  }
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
        order_status: 'Pending'
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