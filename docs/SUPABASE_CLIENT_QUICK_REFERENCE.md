# Supabase Client Quick Reference

Quick reference guide for using Supabase clients in the LIMS application.

## 🚀 Quick Start

### Client Component (Browser)
```tsx
'use client'
import { createClient } from '@/lib/supabase/client'

export default function MyComponent() {
  const supabase = createClient()
  // Use supabase...
}
```

### Server Component
```tsx
import { createClient } from '@/lib/supabase/server'

export default async function MyServerComponent() {
  const supabase = await createClient()
  // Use supabase...
}
```

### API Route
```tsx
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  // Use supabase...
}
```

## 📋 Common Operations

### Authentication

#### Sign Up
```tsx
'use client'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
})
```

#### Sign In
```tsx
'use client'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
})
```

#### Sign Out
```tsx
'use client'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
await supabase.auth.signOut()
```

#### Get Current User (Client)
```tsx
'use client'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()
```

#### Get Current User (Server)
```tsx
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
```

### Database Operations

#### Select All
```tsx
const { data, error } = await supabase
  .from('patients')
  .select('*')
```

#### Select Specific Columns
```tsx
const { data, error } = await supabase
  .from('patients')
  .select('id, first_name, last_name')
```

#### Select with Filter
```tsx
const { data, error } = await supabase
  .from('patients')
  .select('*')
  .eq('sex', 'Male')
```

#### Select Single Row
```tsx
const { data, error } = await supabase
  .from('patients')
  .select('*')
  .eq('id', patientId)
  .single()
```

#### Insert
```tsx
const { data, error } = await supabase
  .from('patients')
  .insert({
    mobile_number: '+919876543210',
    title: 'Mr.',
    first_name: 'John',
    last_name: 'Doe',
    sex: 'Male',
    age_years: 30,
  })
  .select()
```

#### Update
```tsx
const { data, error } = await supabase
  .from('patients')
  .update({ first_name: 'Jane' })
  .eq('id', patientId)
  .select()
```

#### Delete
```tsx
const { data, error } = await supabase
  .from('patients')
  .delete()
  .eq('id', patientId)
```

#### Count
```tsx
const { count, error } = await supabase
  .from('patients')
  .select('*', { count: 'exact', head: true })
```

### Real-time Subscriptions (Client Only)

#### Subscribe to Changes
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

#### Subscribe to Inserts Only
```tsx
const channel = supabase
  .channel('patients-inserts')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'patients' },
    (payload) => {
      console.log('New patient:', payload.new)
    }
  )
  .subscribe()
```

## 🔒 Protected Routes

### Server Component Protection
```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <div>Protected content</div>
}
```

### API Route Protection
```tsx
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Protected logic...
}
```

## ⚠️ Common Pitfalls

### ❌ Don't: Use client in Server Component
```tsx
// WRONG!
import { createClient } from '@/lib/supabase/client'

export default async function ServerComponent() {
  const supabase = createClient() // This won't work!
}
```

### ✅ Do: Use server client in Server Component
```tsx
// CORRECT!
import { createClient } from '@/lib/supabase/server'

export default async function ServerComponent() {
  const supabase = await createClient() // Note the await!
}
```

### ❌ Don't: Forget to await server client
```tsx
// WRONG!
import { createClient } from '@/lib/supabase/server'

export default async function ServerComponent() {
  const supabase = createClient() // Missing await!
}
```

### ✅ Do: Always await server client
```tsx
// CORRECT!
import { createClient } from '@/lib/supabase/server'

export default async function ServerComponent() {
  const supabase = await createClient()
}
```

### ❌ Don't: Use admin client unnecessarily
```tsx
// WRONG! (unless you really need to bypass RLS)
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createAdminClient()
  // This bypasses RLS - probably not what you want!
}
```

### ✅ Do: Use standard client for most operations
```tsx
// CORRECT!
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  // This respects RLS policies
}
```

## 🎯 Decision Tree

**Need to use Supabase?**

1. **Is this a Client Component?**
   - Yes → Use `@/lib/supabase/client`
   - No → Go to step 2

2. **Is this a Server Component or API Route?**
   - Yes → Use `@/lib/supabase/server` with `createClient()`
   - No → Go to step 3

3. **Do you need to bypass RLS?**
   - Yes → Use `@/lib/supabase/server` with `createAdminClient()` (⚠️ Use with caution!)
   - No → Use `@/lib/supabase/server` with `createClient()`

## 📚 More Information

- **Full Documentation**: See `lib/supabase/README.md`
- **Test Connection**: Run `npx tsx lib/supabase/test-connection.ts`
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Guide**: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

## 🆘 Troubleshooting

### Error: "Missing environment variable"
**Solution**: Check `.env.local` file has all required variables

### Error: "Invalid API key"
**Solution**: Verify keys in Supabase dashboard and restart dev server

### Error: "Row Level Security policy violation"
**Solution**: Check RLS policies in Supabase dashboard or use admin client (carefully)

### Error: "Cannot read properties of undefined"
**Solution**: Make sure to await the server client: `await createClient()`

---

**Last Updated**: 2024  
**Related Files**: 
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/README.md`
