# Authentication Components

This directory contains authentication-related components for the LIMS application.

## Components

### LoginForm.tsx
Login form component with email and password fields.

**Features:**
- Email and password validation using Zod
- Supabase authentication integration
- Error handling and loading states
- Toast notifications for success/error
- Redirect to dashboard after successful login
- Responsive design with shadcn/ui components

**Usage:**
```tsx
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return <LoginForm />
}
```

### SignupForm.tsx
Signup form component for new user registration.

**Features:**
- Email, password, and password confirmation fields
- Form validation with Zod
- Supabase user registration
- Error handling and loading states
- Toast notifications
- Responsive design

**Usage:**
```tsx
import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
  return <SignupForm />
}
```

### LogoutButton.tsx
Reusable logout button component that can be used anywhere in the application.

**Features:**
- Calls logout server action
- Shows loading state during logout
- Error handling with toast notifications
- Customizable styling and variants
- Optional icon display
- Fully accessible

**Usage:**
```tsx
import { LogoutButton } from '@/components/auth/LogoutButton'

// Basic usage
<LogoutButton />

// Custom styling
<LogoutButton variant="destructive" className="w-full" />

// Without icon
<LogoutButton showIcon={false}>Sign Out</LogoutButton>
```

**Props:**
- `className?: string` - Optional custom CSS classes
- `variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'` - Button variant (default: 'ghost')
- `showIcon?: boolean` - Whether to show the logout icon (default: true)
- `children?: React.ReactNode` - Custom button text (default: 'Logout')

## Server Actions

### lib/actions/auth.ts

**logout()**
Server action that handles user logout.

**Features:**
- Clears Supabase session
- Removes authentication cookies
- Revalidates cache
- Redirects to login page
- Error handling

**Usage:**
```tsx
'use client'
import { logout } from '@/lib/actions/auth'

function MyComponent() {
  const handleLogout = async () => {
    await logout()
  }
  
  return <button onClick={handleLogout}>Logout</button>
}
```

## Authentication Flow

### Login Flow
1. User enters credentials in LoginForm
2. Form validates input using Zod schema
3. Credentials sent to Supabase Auth
4. On success: User redirected to dashboard
5. On error: Error message displayed

### Signup Flow
1. User enters email and password in SignupForm
2. Form validates input (including password confirmation)
3. User created in Supabase Auth
4. On success: User redirected to dashboard
5. On error: Error message displayed

### Logout Flow
1. User clicks LogoutButton
2. logout() server action called
3. Supabase session cleared
4. Authentication cookies removed
5. Cache revalidated
6. User redirected to login page

## Dependencies
- `@supabase/ssr` - Supabase client for authentication
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `@hookform/resolvers/zod` - Zod resolver for react-hook-form
- `sonner` - Toast notifications
- `lucide-react` - Icons
- `shadcn/ui` - UI components (Button, Form, Input)

## Related Files
- `/lib/supabase/client.ts` - Supabase client for client components
- `/lib/supabase/server.ts` - Supabase client for server components
- `/lib/actions/auth.ts` - Authentication server actions
- `/middleware.ts` - Route protection middleware
