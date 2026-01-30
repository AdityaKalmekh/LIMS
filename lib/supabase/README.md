# Supabase Client Utilities

This directory contains Supabase client utilities for the LIMS application, optimized for Next.js App Router.

## Overview

We provide two different Supabase clients for different use cases:

1. **Client-side client** (`client.ts`) - For React Client Components
2. **Server-side client** (`server.ts`) - For Server Components and API Routes

## Files

### `client.ts`
Client-side Supabase client for use in React Client Components.

**When to use:**
- In Client Components (marked with `'use client'`)
- For client-side authentication flows
- For real-time subscriptions
- When you need to access Supabase from the browser

**Example:**
```tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function MyComponent() {
  const supabase = createClient()
  const [data, setData] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('patients').select()
      setData(data)
    }
    fetchData()
  }, [])

  return <div>{/* Render data */}</div>
}
```

### `server.ts`
Server-side Supabase clients for use in Server Components and API Routes.

**Exports:**
- `createClient()` - Standard server client with cookie-based auth
- `createAdminClient()` - Admin client with service role privileges (bypasses RLS)

**When to use `createClient()`:**
- In Server Components
- In API Routes
- When you need to respect Row Level Security (RLS) policies
- For authenticated server-side operations

**Example (Server Component):**
```tsx
import { createClient } from '@/lib/supabase/server'

export default async function MyServerComponent() {
  const supabase = await createClient()
  const { data: patients } = await supabase.from('patients').select()

  return (
    <div>
      {patients?.map(patient => (
        <div key={patient.id}>{patient.first_name}</div>
      ))}
    </div>
  )
}
```

**Example (API Route):**
```tsx
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('patients').select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
```

**When to use `createAdminClient()`:**
- ⚠️ **Use with extreme caution!**
- Only for administrative operations that require bypassing RLS
- Never expose this client in client-side code
- Only in secure server-side contexts (API routes, server actions)

**Example (Admin Operations):**
```tsx
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  // Only use admin client when absolutely necessary
  const supabase = createAdminClient()
  
  // This bypasses RLS policies - use carefully!
  const { data, error } = await supabase
    .from('patients')
    .insert({ /* data */ })

  // ...
}
```

## Authentication

### Client-Side Authentication

For login/signup flows in Client Components:

```tsx
'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const supabase = createClient()

  async function handleLogin(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error.message)
      return
    }

    // Redirect to dashboard
    window.location.href = '/dashboard'
  }

  // ...
}
```

### Server-Side Authentication

For checking auth status in Server Components:

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <div>Protected content for {user.email}</div>
}
```

## Environment Variables

These clients require the following environment variables in `.env.local`:

```env
# Public variables (safe for client-side)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Private variable (server-side only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Security Notes:**
- `NEXT_PUBLIC_*` variables are exposed to the browser
- `SUPABASE_SERVICE_ROLE_KEY` is only available server-side
- Never commit `.env.local` to version control
- The service role key has admin privileges - handle with care

## Error Handling

Both clients will throw errors if environment variables are missing:

```tsx
try {
  const supabase = createClient()
  // Use client...
} catch (error) {
  console.error('Supabase client error:', error.message)
  // Handle missing environment variables
}
```

## TypeScript Support

Both clients are fully typed and will provide autocomplete for:
- Database tables and columns
- Authentication methods
- Query builders
- Response types

For custom types, you can generate them from your database schema:

```bash
npx supabase gen types typescript --project-id your-project-id > types/supabase.ts
```

Then use them with your client:

```tsx
import { Database } from '@/types/supabase'

const supabase = createClient<Database>()
```

## Best Practices

### 1. Choose the Right Client

- **Client Components** → Use `client.ts`
- **Server Components** → Use `server.ts` with `createClient()`
- **API Routes** → Use `server.ts` with `createClient()`
- **Admin Operations** → Use `server.ts` with `createAdminClient()` (rarely)

### 2. Respect Row Level Security (RLS)

- Always use RLS policies on your tables
- Use the standard `createClient()` for most operations
- Only use `createAdminClient()` when you explicitly need to bypass RLS

### 3. Handle Errors Gracefully

```tsx
const { data, error } = await supabase.from('patients').select()

if (error) {
  console.error('Database error:', error.message)
  // Show user-friendly error message
  return
}

// Use data safely
```

### 4. Session Management

- Sessions are automatically managed via cookies
- The server client handles session refresh automatically
- No need to manually manage tokens

### 5. Real-time Subscriptions

For real-time updates, use the client-side client:

```tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

export default function RealtimeComponent() {
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('patients-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'patients' },
        (payload) => {
          console.log('Change received!', payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return <div>Listening for changes...</div>
}
```

## Troubleshooting

### "Missing environment variable" error

**Solution:** Ensure all required environment variables are set in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin client)

### "Invalid API key" error

**Solution:** 
1. Verify your keys in the Supabase dashboard (Settings → API)
2. Ensure you copied the complete key (they're very long)
3. Restart your development server after updating `.env.local`

### Authentication not persisting

**Solution:**
1. Ensure you're using the server client in Server Components
2. Check that cookies are enabled in your browser
3. Verify your Supabase Auth settings

### RLS policy errors

**Solution:**
1. Check your RLS policies in the Supabase dashboard
2. Ensure the authenticated user has the necessary permissions
3. Test queries in the Supabase SQL editor
4. Consider using `createAdminClient()` for debugging (temporarily)

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## Related Files

- `.env.local` - Environment variables configuration
- `docs/SUPABASE_SETUP_GUIDE.md` - Supabase project setup instructions
- `docs/RLS_SETUP_GUIDE.md` - Row Level Security setup guide
- `supabase/migrations/` - Database migration files
