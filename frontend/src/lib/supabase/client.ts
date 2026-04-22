import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

/**
 * Standard client-side Supabase client.
 * Uses the anonymous key and relies on RLS policies for security.
 */
export const supabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)
