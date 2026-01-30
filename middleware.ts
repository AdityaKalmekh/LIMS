/**
 * Next.js Middleware for Authentication
 * 
 * This middleware protects dashboard routes by checking authentication status.
 * It runs on every request to protected routes and redirects unauthenticated
 * users to the login page.
 * 
 * Protected Routes:
 * - /dashboard/* - All dashboard pages require authentication
 * 
 * Public Routes:
 * - /login - Login page
 * - /signup - Signup page
 * - / - Home page
 * 
 * Features:
 * - Automatic session refresh
 * - Cookie-based authentication
 * - Seamless redirect handling
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create a response object that we can modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Validate environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    return response
  }

  // Create a Supabase client with cookie handling for middleware
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  // Refresh session if expired - this is important for long-running sessions
  // The getUser() call will automatically refresh the session if needed
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get the pathname from the request
  const { pathname } = request.nextUrl

  // Define protected routes that require authentication
  const isProtectedRoute = pathname.startsWith('/dashboard')

  // Define public auth routes that should redirect to dashboard if already logged in
  const isAuthRoute = pathname === '/login' || pathname === '/signup'

  // If user is not authenticated and trying to access protected route
  if (!user && isProtectedRoute) {
    // Redirect to login page
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    // Add the original URL as a query parameter so we can redirect back after login
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth pages (login/signup)
  if (user && isAuthRoute) {
    // Check if there's a redirectTo parameter
    const redirectTo = request.nextUrl.searchParams.get('redirectTo')
    const redirectUrl = request.nextUrl.clone()
    
    // Redirect to the original destination or dashboard
    redirectUrl.pathname = redirectTo || '/dashboard'
    redirectUrl.searchParams.delete('redirectTo')
    return NextResponse.redirect(redirectUrl)
  }

  // Return the response with updated cookies
  return response
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - api routes (they handle their own auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
