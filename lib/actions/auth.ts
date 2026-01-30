/**
 * Authentication Server Actions
 * 
 * This module provides server actions for authentication operations.
 * Server actions are secure, server-side functions that can be called
 * from client components.
 * 
 * Features:
 * - Logout functionality with session cleanup
 * - Cookie-based session management
 * - Automatic redirect after logout
 * - Error handling
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Logout Action
 * 
 * Signs out the current user by:
 * 1. Clearing the Supabase session
 * 2. Removing authentication cookies
 * 3. Revalidating the cache
 * 4. Redirecting to the login page
 * 
 * Usage in Client Components:
 * ```tsx
 * 'use client'
 * import { logout } from '@/lib/actions/auth'
 * 
 * export function LogoutButton() {
 *   return (
 *     <button onClick={() => logout()}>
 *       Logout
 *     </button>
 *   )
 * }
 * ```
 * 
 * @throws {Error} If logout fails
 */
export async function logout() {
  try {
    // Create Supabase client with cookie handling
    const supabase = await createClient()

    // Sign out the user - this clears the session and removes cookies
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      throw new Error('Failed to logout. Please try again.')
    }

    // Revalidate the cache for all paths to ensure fresh data
    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Unexpected logout error:', error)
    throw error
  }

  // Redirect to login page
  // Note: This must be outside the try-catch because redirect() throws
  redirect('/login')
}
