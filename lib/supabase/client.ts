/**
 * Supabase Client for Client-Side Components
 * 
 * This client is designed for use in React Client Components.
 * It uses the public anonymous key which is safe to expose in the browser.
 * 
 * Usage:
 * ```tsx
 * 'use client'
 * import { createClient } from '@/lib/supabase/client'
 * 
 * export default function MyComponent() {
 *   const supabase = createClient()
 *   // Use supabase client...
 * }
 * ```
 * 
 * Features:
 * - Automatic session management
 * - Browser-based authentication
 * - Real-time subscriptions support
 * - Safe for client-side code
 */

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
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

  // Create and return the Supabase client
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
