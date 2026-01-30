# Authentication Middleware Guide

## Overview

The authentication middleware (`middleware.ts`) protects dashboard routes by checking authentication status using Supabase Auth. It runs on every request and handles redirects for authenticated and unauthenticated users.

## Features

### 1. Protected Routes
- **Dashboard Routes** (`/dashboard/*`): Require authentication
  - Unauthenticated users are redirected to `/login`
  - Original URL is preserved in `redirectTo` query parameter

### 2. Public Routes
- **Auth Pages** (`/login`, `/signup`): Accessible without authentication
  - Authenticated users are automatically redirected to `/dashboard`
  - Respects `redirectTo` parameter for post-login navigation

### 3. Session Management
- Automatic session refresh using Supabase SSR
- Cookie-based authentication
- Seamless handling of expired sessions

## How It Works

### Authentication Check Flow

```
Request → Middleware → Check Auth Status
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
              Authenticated      Unauthenticated
                    ↓                   ↓
            ┌───────┴───────┐    ┌─────┴─────┐
            ↓               ↓    ↓           ↓
      Protected Route  Auth Route  Protected  Auth Route
            ↓               ↓         ↓           ↓
         Allow      Redirect to   Redirect    Allow
                    Dashboard     to Login
```

### Example Scenarios

#### Scenario 1: Unauthenticated User Accessing Dashboard
```
Request: GET /dashboard
Result: Redirect to /login?redirectTo=/dashboard
```

#### Scenario 2: Authenticated User Accessing Login
```
Request: GET /login
Result: Redirect to /dashboard
```

#### Scenario 3: Authenticated User Accessing Dashboard
```
Request: GET /dashboard
Result: Allow access
```

#### Scenario 4: Post-Login Redirect
```
Request: GET /login?redirectTo=/dashboard/patients
After Login: Redirect to /dashboard/patients
```

## Configuration

### Matcher Configuration

The middleware runs on all routes except:
- Static files (`_next/static/*`)
- Image optimization files (`_next/image/*`)
- Favicon (`favicon.ico`)
- Public assets (`.svg`, `.png`, `.jpg`, etc.)
- API routes (they handle their own authentication)

```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Testing the Middleware

### Manual Testing

1. **Test Unauthenticated Access to Protected Route**
   ```bash
   # Start the dev server
   npm run dev
   
   # Open browser in incognito mode
   # Navigate to: http://localhost:3000/dashboard
   # Expected: Redirect to /login?redirectTo=/dashboard
   ```

2. **Test Authenticated Access to Auth Pages**
   ```bash
   # Login first at http://localhost:3000/login
   # Then navigate to: http://localhost:3000/login
   # Expected: Redirect to /dashboard
   ```

3. **Test Post-Login Redirect**
   ```bash
   # In incognito mode, navigate to: http://localhost:3000/dashboard
   # You'll be redirected to: /login?redirectTo=/dashboard
   # Login with valid credentials
   # Expected: Redirect back to /dashboard
   ```

4. **Test Session Persistence**
   ```bash
   # Login at http://localhost:3000/login
   # Navigate to http://localhost:3000/dashboard
   # Refresh the page
   # Expected: Stay on dashboard (session persists)
   ```

### Automated Testing (Future)

When setting up automated tests, consider testing:

1. **Middleware Logic**
   - Mock Supabase client responses
   - Test redirect logic for different scenarios
   - Verify cookie handling

2. **Integration Tests**
   - Test complete authentication flow
   - Verify protected routes are actually protected
   - Test session refresh behavior

3. **E2E Tests**
   - Test user journey from login to dashboard
   - Test logout and re-login flow
   - Test session expiration handling

## Troubleshooting

### Issue: Infinite Redirect Loop

**Symptoms**: Browser shows "too many redirects" error

**Possible Causes**:
1. Missing environment variables
2. Supabase client configuration error
3. Cookie handling issues

**Solution**:
1. Verify `.env.local` has correct Supabase credentials
2. Check browser console for errors
3. Clear browser cookies and try again

### Issue: Not Redirecting to Login

**Symptoms**: Can access dashboard without authentication

**Possible Causes**:
1. Middleware not running (check matcher config)
2. Session still valid from previous login
3. Environment variables not loaded

**Solution**:
1. Verify middleware.ts is in the root of lims-app/
2. Clear cookies and test in incognito mode
3. Restart dev server to reload environment variables

### Issue: Redirect After Login Not Working

**Symptoms**: Always redirects to /dashboard, ignoring redirectTo parameter

**Possible Causes**:
1. redirectTo parameter not being preserved
2. Login form not handling redirectTo

**Solution**:
1. Check URL after redirect to login - should have ?redirectTo=...
2. Verify LoginForm component uses redirectTo parameter
3. Check browser network tab for redirect chain

## Security Considerations

### 1. Cookie Security
- Cookies are HTTP-only (not accessible via JavaScript)
- Secure flag set in production (HTTPS only)
- SameSite attribute prevents CSRF attacks

### 2. Session Refresh
- Middleware automatically refreshes expired sessions
- Uses Supabase SSR for secure token handling
- No sensitive data exposed to client

### 3. Protected Routes
- All dashboard routes require authentication
- API routes should implement their own auth checks
- Never trust client-side authentication alone

## Best Practices

### 1. Adding New Protected Routes
```typescript
// In middleware.ts, update the isProtectedRoute check:
const isProtectedRoute = 
  pathname.startsWith('/dashboard') ||
  pathname.startsWith('/admin') ||
  pathname.startsWith('/settings')
```

### 2. Adding New Public Routes
```typescript
// In middleware.ts, update the isAuthRoute check:
const isAuthRoute = 
  pathname === '/login' || 
  pathname === '/signup' ||
  pathname === '/forgot-password'
```

### 3. Custom Redirect Logic
```typescript
// Example: Redirect to different pages based on user role
if (user && isAuthRoute) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = profile?.role === 'admin' 
    ? '/admin/dashboard' 
    : '/dashboard'
  return NextResponse.redirect(redirectUrl)
}
```

## Related Files

- `lib/supabase/server.ts`: Supabase server client
- `lib/supabase/client.ts`: Supabase client-side client
- `app/(auth)/login/page.tsx`: Login page
- `app/(auth)/signup/page.tsx`: Signup page
- `app/(dashboard)/dashboard/page.tsx`: Protected dashboard page

## Next Steps

After implementing the middleware:

1. ✅ Test authentication flow manually
2. ⏳ Implement logout functionality (Task 3.5)
3. ⏳ Build dashboard layout (Task 4.1)
4. ⏳ Add more protected routes as needed

## References

- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Supabase SSR Documentation](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js Authentication Patterns](https://nextjs.org/docs/app/building-your-application/authentication)
