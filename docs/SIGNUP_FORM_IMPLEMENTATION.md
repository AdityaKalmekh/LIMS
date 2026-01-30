# SignupForm Component Implementation Guide

## Component Overview

The SignupForm component provides user registration functionality for the LIMS application with Supabase authentication integration.

## File Structure

```
lims-app/
├── components/
│   └── auth/
│       ├── LoginForm.tsx      (existing)
│       └── SignupForm.tsx     (new - task 3.3)
└── app/
    └── (auth)/
        ├── login/
        │   └── page.tsx       (existing)
        └── signup/
            └── page.tsx       (updated - task 3.3)
```

## Component API

### SignupForm Props

```typescript
interface SignupFormProps {
  onSuccess?: () => void  // Optional callback after successful signup
}
```

### Usage Example

```tsx
import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <div>
      <SignupForm 
        onSuccess={() => console.log('User signed up!')} 
      />
    </div>
  )
}
```

## Form Schema

The component uses Zod for validation:

```typescript
const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})
```

## Key Features

### 1. Form Validation
- **Email**: Required, must be valid email format
- **Password**: Required, minimum 6 characters
- **Confirm Password**: Required, must match password

### 2. Error Handling
- Inline validation errors displayed below each field
- Toast notifications for authentication errors
- User-friendly error messages

### 3. Loading States
- Form inputs disabled during submission
- Submit button shows "Creating account..." text
- Prevents duplicate submissions

### 4. Success Flow
```
User submits form
    ↓
Validation passes
    ↓
Supabase creates account
    ↓
Success toast displayed
    ↓
Redirect to login page
```

### 5. Supabase Integration

```typescript
const { data, error } = await supabase.auth.signUp({
  email: values.email,
  password: values.password,
})
```

## Styling

The component uses:
- **shadcn/ui components**: Form, FormField, FormItem, FormLabel, FormControl, FormMessage, Input, Button
- **Tailwind CSS**: For spacing, layout, and responsive design
- **Sonner**: For toast notifications

## Responsive Design

The form is fully responsive:
- Mobile: Stacked layout, full-width inputs
- Tablet: Same as mobile with better spacing
- Desktop: Centered card with max-width constraint

## Comparison with LoginForm

| Feature | LoginForm | SignupForm |
|---------|-----------|------------|
| Email field | ✅ | ✅ |
| Password field | ✅ | ✅ |
| Confirm password | ❌ | ✅ |
| Validation | Zod | Zod |
| Auth method | signInWithPassword | signUp |
| Redirect | /dashboard | /login |
| Loading state | ✅ | ✅ |
| Error handling | ✅ | ✅ |
| Toast notifications | ✅ | ✅ |

## Error Messages

### Validation Errors
- "Email is required"
- "Invalid email address"
- "Password is required"
- "Password must be at least 6 characters"
- "Please confirm your password"
- "Passwords don't match"

### Authentication Errors
- Displayed via toast notifications
- Uses Supabase error messages
- Examples:
  - "User already registered"
  - "Invalid email format"
  - "Password should be at least 6 characters"

## Testing Checklist

- [ ] Valid email and matching passwords → Success
- [ ] Invalid email format → Validation error
- [ ] Password less than 6 characters → Validation error
- [ ] Non-matching passwords → Validation error
- [ ] Already registered email → Supabase error
- [ ] Form disabled during submission → Loading state
- [ ] Success toast displayed → User feedback
- [ ] Redirect to login page → Navigation
- [ ] Mobile responsive → Layout adapts
- [ ] Keyboard navigation → Accessibility

## Next Steps

After task 3.3, the following tasks remain:
- Task 3.4: Create auth middleware for protected routes
- Task 3.5: Implement logout functionality

## Related Files

- `components/auth/LoginForm.tsx` - Similar pattern for login
- `lib/supabase/client.ts` - Supabase client configuration
- `app/(auth)/signup/page.tsx` - Signup page integration
- `app/(auth)/login/page.tsx` - Login page for reference

## Notes

- Email verification is handled by Supabase settings
- Password hashing is automatic via Supabase Auth
- Session management is handled by Supabase client
- The component follows React Hook Form best practices
- Zod schema ensures type safety
