import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
  )
}

// Create Supabase client singleton
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: { "x-application-name": "OvertimeStaff" },
  },
})

// Custom error class for database operations
export class DatabaseError extends Error {
  code?: string
  details?: string
  hint?: string

  constructor(message: string, details?: { code?: string; details?: string; hint?: string }) {
    super(message)
    this.name = "DatabaseError"
    if (details) {
      this.code = details.code
      this.details = details.details
      this.hint = details.hint
    }
  }
}

/**
 * Safely execute a Supabase query with proper error handling
 * @param queryFn Function that performs a Supabase query
 * @returns Promise with the query results
 * @throws DatabaseError if the query fails
 */
export async function safeQuery<T>(queryFn: () => Promise<{ data: T; error: any }>) {
  try {
    const { data, error } = await queryFn()

    if (error) {
      console.error("Database operation failed:", error)
      throw new DatabaseError(error.message || "Database operation failed", {
        code: error.code,
        details: error.details,
        hint: error.hint,
      })
    }

    return data
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error
    }
    
    console.error("Unexpected database error:", error)
    throw new DatabaseError("An unexpected database error occurred", {
      details: error.message,
    })
  }
}

/**
 * Get the currently authenticated user
 * @returns Promise with the user or null if not authenticated
 */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}

/**
 * Get the user's profile from the profiles table
 * @param userId Optional user ID, defaults to current user
 * @returns Promise with the user profile or null
 */
export async function getUserProfile(userId?: string) {
  let id = userId
  
  if (!id) {
    const user = await getCurrentUser()
    if (!user) return null
    id = user.id
  }
  
  return safeQuery(() => 
    supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single()
  )
}

/**
 * Initialize Supabase listeners for the current session
 * This should be called once at the app root level
 */
export function initSupabaseListeners() {
  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      console.log('User signed in:', session?.user?.id)
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out')
    } else if (event === 'TOKEN_REFRESHED') {
      console.log('Token refreshed')
    } else if (event === 'USER_UPDATED') {
      console.log('User updated')
    }
  })
}
