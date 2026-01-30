# Logout Functionality - Quick Reference

## Quick Start

### Using the LogoutButton Component

```tsx
import { LogoutButton } from '@/components/auth/LogoutButton'

// Basic usage
<LogoutButton />
```

### Using the Logout Server Action Directly

```tsx
'use client'
import { logout } from '@/lib/actions/auth'

async function handleLogout() {
  await logout()
}

<button onClick={handleLogout}>Logout</button>
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | Custom CSS classes |
| `variant` | `ButtonVariant` | `'ghost'` | Button style variant |
| `showIcon` | `boolean` | `true` | Show/hide logout icon |
| `children` | `ReactNode` | `'Logout'` | Custom button text |

## Common Use Cases

### In Sidebar
```tsx
<LogoutButton 
  variant="ghost" 
  className="w-full justify-start"
  showIcon={true}
/>
```

### In Dropdown Menu
```tsx
<DropdownMenuItem asChild>
  <LogoutButton variant="ghost" className="w-full cursor-pointer" />
</DropdownMenuItem>
```

### In Header
```tsx
<LogoutButton 
  variant="outline" 
  showIcon={false}
>
  Sign Out
</LogoutButton>
```

### Custom Styled
```tsx
<LogoutButton 
  variant="destructive"
  className="rounded-full px-6"
>
  Exit Application
</LogoutButton>
```

## What Happens When User Logs Out?

1. ✅ Supabase session is cleared
2. ✅ Authentication cookies are removed
3. ✅ Next.js cache is revalidated
4. ✅ User is redirected to `/login`
5. ✅ Protected routes become inaccessible

## Error Handling

The component automatically handles errors and displays toast notifications:

```tsx
// Error toast is shown automatically
toast.error('Logout failed', {
  description: 'Error message here'
})
```

## Testing Checklist

- [ ] User can click logout button
- [ ] Loading state is shown during logout
- [ ] User is redirected to login page
- [ ] Session is cleared (can't access dashboard)
- [ ] Error toast shows if logout fails
- [ ] Button is disabled during logout

## Files Reference

- **Component**: `components/auth/LogoutButton.tsx`
- **Server Action**: `lib/actions/auth.ts`
- **Documentation**: `components/auth/README.md`
- **Implementation Guide**: `docs/TASK_3.5_LOGOUT_IMPLEMENTATION.md`

## Next.js App Router Best Practices

✅ Uses Server Actions for secure logout  
✅ Proper cookie management with Supabase SSR  
✅ Cache revalidation after logout  
✅ Client component for interactivity  
✅ Server-side redirect for security

## Troubleshooting

### Logout button doesn't work
- Check if Supabase environment variables are set
- Verify user is authenticated before logout
- Check browser console for errors

### User not redirected after logout
- Ensure middleware is configured correctly
- Check if `/login` route exists
- Verify redirect() is not being caught by error handler

### Session persists after logout
- Clear browser cookies manually
- Check if `supabase.auth.signOut()` is being called
- Verify cache revalidation is working

## Support

For more details, see:
- [Full Implementation Guide](./TASK_3.5_LOGOUT_IMPLEMENTATION.md)
- [Auth Components README](../components/auth/README.md)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
