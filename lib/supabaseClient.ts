// lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js' // 1. Import the SupabaseClient type

// 2. Add the return type to the function signature
export function createClient(cookieStore: unknown): SupabaseClient {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

