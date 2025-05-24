import { createClient } from "@supabase/supabase-js"

// Use the correct environment variable names that match your .env.local
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY

// Debug: Check what environment variables are available
console.log("Supabase URL:", supabaseUrl)
console.log("Supabase Key:", supabaseAnonKey ? "Found" : "Missing")

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Please check your .env.local file.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
