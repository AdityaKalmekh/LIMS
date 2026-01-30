# Email Confirmation Guide

## Issue: "Email not confirmed" Error

When you sign up for a new account, you may encounter an "Email not confirmed" error when trying to log in. This happens because Supabase has email confirmation enabled by default.

## Quick Fix for Development (Recommended)

### Disable Email Confirmation in Supabase

1. **Go to Supabase Dashboard**
   - Open your Supabase project at https://supabase.com/dashboard

2. **Navigate to Authentication Settings**
   - Click on **Authentication** in the left sidebar
   - Click on **Providers**
   - Click on **Email** provider

3. **Disable Email Confirmation**
   - Scroll down to find **"Confirm email"** setting
   - **Uncheck** the box for "Enable email confirmations"
   - Click **Save** at the bottom

4. **Test Again**
   - Try signing up with a new email
   - You should now be able to log in immediately without email confirmation

## Alternative: Confirm Existing Users

If you want to keep email confirmation enabled but need to confirm existing test users:

### Method 1: Via Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Find the user you created
3. Click on the user to open details
4. Set **"Email Confirmed"** to `true`
5. Save changes
6. Try logging in again

### Method 2: Via SQL

Run this SQL in the Supabase SQL Editor:

```sql
-- Confirm a specific user by email
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'your-email@example.com';

-- Or confirm all users (for development only!)
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;
```

## Production Setup

For production, you should keep email confirmation enabled and configure email templates:

### 1. Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Customize the "Confirm signup" template
3. Set your site URL in **Authentication** → **URL Configuration**

### 2. Set Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your production domain (e.g., `https://yourdomain.com`)
3. Add **Redirect URLs** if needed

### 3. Configure Email Provider (Optional)

For production, consider using a custom SMTP provider:

1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Configure your email provider (SendGrid, Mailgun, etc.)

## Updated Form Behavior

The SignupForm and LoginForm have been updated to:

### SignupForm
- Detects if email confirmation is required
- Shows appropriate success message
- Guides users to check their email if confirmation is needed

### LoginForm
- Shows clear error message when email is not confirmed
- Provides helpful instructions for common errors
- Distinguishes between "email not confirmed" and "invalid credentials"

## Testing

After disabling email confirmation:

1. **Sign up** with a new email address
2. **Log in** immediately with the same credentials
3. You should be redirected to the dashboard

## Troubleshooting

### "Email rate limit exceeded" error?

This happens when you try to sign up multiple times in a short period.

**Solution:**
1. **Disable email confirmation** (see "Quick Fix for Development" above)
2. **Wait 5-10 minutes** for the rate limit to reset
3. **Try signing up again**

**Why this happens:**
- Supabase free tier has limits on emails sent per hour
- Each signup attempt tries to send a confirmation email
- Multiple attempts quickly hit the rate limit

**Best practice:**
- Disable email confirmation during development
- Enable it only for production

### Still getting "Email not confirmed" error?

1. **Clear browser cache and cookies**
2. **Try in incognito/private mode**
3. **Verify the setting was saved** in Supabase dashboard
4. **Create a new user** (old users may still need confirmation)

### Email confirmation emails not arriving?

1. **Check spam folder**
2. **Verify email provider settings** in Supabase
3. **Check Supabase logs** for email delivery errors
4. **Use a different email address** for testing

## Related Documentation

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Email Confirmation Settings](https://supabase.com/docs/guides/auth/auth-email)
- [TASK_2.4_INSTRUCTIONS.md](./TASK_2.4_INSTRUCTIONS.md) - Supabase Auth configuration guide

## Summary

**For Development**: Disable email confirmation in Supabase dashboard
**For Production**: Keep email confirmation enabled and configure email templates

The forms have been updated to handle both scenarios gracefully.
