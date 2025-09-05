import { createClient } from '@supabase/supabase-js';

// Get the Supabase URL and anon key from the .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create the Supabase client, which we can use to interact with our database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
