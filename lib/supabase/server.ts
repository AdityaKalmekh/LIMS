/**
 * Supabase Client for Server-Side Components and API Routes
 * 
 * This module provides Supabase clients for server-side usage in Next.js App Router.
 * It handles cookie-based session management for authenticated requests.
 * 
 * Usage in Server Components:
 * ```tsx
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export default async function MyServerComponent() {
 *   const supabase = await createClient()
 *   const { data } = await supabase.from('patients').select()
 *   // ...
 * }
 * ```
 * 
 * Usage in API Routes:
 * ```tsx
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export async function GET() {
 *   const supabase = await createClient()
 *   const { data } = await supabase.from('patients').select()
 *   return Response.json(data)
 * }
 * ```
 * 
 * Features:
 * - Cookie-based session management
 * - Automatic session refresh
 * - Type-safe database queries
 * - Row Level Security (RLS) enforcement
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for server-side usage with cookie-based auth
 * 
 * This client automatically manages authentication state using cookies,
 * which allows it to work seamlessly with Supabase Auth in Server Components
 * and API Routes.
 * 
 * @returns Promise<SupabaseClient> - A configured Supabase client
 */
export async function createClient() {
  const cookieStore = await cookies()

  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Validate environment variables
  if (!supabaseUrl) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
      'Please check your .env.local file.'
    )
  }

  if (!supabaseAnonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. ' +
      'Please check your .env.local file.'
    )
  }

  // Create and return the Supabase client with cookie handling
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch (error) {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

/**
 * Creates a Supabase admin client with service role privileges
 * 
 * ⚠️ WARNING: This client bypasses Row Level Security (RLS) policies!
 * Only use this for administrative operations that require elevated privileges.
 * 
 * NEVER expose this client or its key in client-side code.
 * 
 * Usage:
 * ```tsx
 * import { createAdminClient } from '@/lib/supabase/server'
 * 
 * export async function POST() {
 *   const supabase = createAdminClient()
 *   // Perform admin operations...
 * }
 * ```
 * 
 * @returns SupabaseClient - A Supabase client with admin privileges
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Validate environment variables
  if (!supabaseUrl) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
      'Please check your .env.local file.'
    )
  }

  if (!supabaseServiceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
      'Please check your .env.local file.'
    )
  }

  // Create and return the admin Supabase client
  // Note: We use the regular createServerClient but with service role key
  // This bypasses RLS and should be used with extreme caution
  const { createClient } = require('@supabase/supabase-js')
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
