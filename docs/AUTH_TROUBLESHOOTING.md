# Authentication Troubleshooting Guide

## Common Issues and Solutions

### 1. "Email rate limit exceeded" Error

**Problem**: You get this error when trying to sign up.

**Cause**: Supabase has rate limits on email sending. You've tried signing up too many times in a short period.

**Solution**:

#### Option A: Disable Email Confirmation (Recommended for Development)
1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to **Authentication** → **Providers** → **Email**
3. Scroll to **"Confirm email"** and **UNCHECK** it
4. Click **Save**
5. Wait 2-3 minutes
6. Try signing up again

#### Option B: Wait for Rate Limit Reset
1. Wait **5-10 minutes**
2. The rate limit will automatically reset
3. Try signing up again

**Prevention**:
- Disable email confirmation during development
- Use fewer test signups
- Delete test users from Supabase dashboard between tests

---

### 2. "Email not confirmed" Error

**Problem**: You can sign up but can't log in.

**Cause**: Email confirmation is enabled in Supabase, but you haven't confirmed your email.

**Solution**:

#### Option A: Disable Email Confirmation
Follow the steps in "Option A" above.

#### Option B: Confirm User Manually
1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find your user
3. Click on the user
4. Set **"Email Confirmed"** to `true`
5. Save and try logging in again

#### Option C: Check Your Email
1. Check your inbox for confirmation email
2. Check spam/junk folder
3. Click the confirmation link
4. Try logging in again

---

### 3. "Invalid login credentials" Error

**Problem**: Login fails with invalid credentials message.

**Possible Causes**:
- Wrong email or password
- Email not confirmed (if confirmation is enabled)
- User doesn't exist

**Solution**:
1. Double-check your email and password
2. Make sure you're using the same email you signed up with
3. Check if email confirmation is required (see issue #2)
4. Try signing up again if user doesn't exist

---

### 4. Signup Succeeds but User Can't Be Found

**Problem**: Signup appears successful but you can't log in.

**Cause**: Email confirmation is enabled and user is in "unconfirmed" state.

**Solution**:
1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Check if user exists
3. If user exists but email is not confirmed:
   - Either confirm the email manually (set `email_confirmed_at`)
   - Or disable email confirmation for future signups

---

### 5. Environment Variables Not Working

**Problem**: Getting connection errors or "Invalid API key" errors.

**Solution**:
1. Check `.env.local` file exists in `lims-app/` directory
2. Verify the values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Restart the development server:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```
4. Clear browser cache and try again

---

## Quick Checklist for Development Setup

- [ ] Email confirmation is **DISABLED** in Supabase
- [ ] `.env.local` file has correct Supabase credentials
- [ ] Development server is running (`npm run dev`)
- [ ] Browser is not caching old credentials (try incognito mode)
- [ ] No rate limits are active (wait 5-10 minutes if needed)

---

## Supabase Dashboard Quick Links

Replace `YOUR_PROJECT_ID` with your actual project ID (spfomsintwbxvqkkwowk):

- **Project Dashboard**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
- **Authentication Settings**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/providers
- **Users List**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/users
- **Email Templates**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/templates

---

## Testing Authentication Flow

### Test Signup
1. Open http://localhost:3000/signup
2. Enter a new email (e.g., `test@example.com`)
3. Enter a password (min 6 characters)
4. Confirm password
5. Click "Sign Up"
6. Should see success message

### Test Login
1. Open http://localhost:3000/login
2. Enter the same email and password
3. Click "Sign In"
4. Should redirect to `/dashboard`

### Test Protected Routes
1. While logged out, try to access http://localhost:3000/dashboard
2. Should redirect to `/login`
3. After logging in, should be able to access `/dashboard`

### Test Logout
1. While logged in, go to dashboard
2. Click "Logout" button
3. Should redirect to `/login`
4. Try accessing `/dashboard` again
5. Should redirect to `/login`

---

## Getting More Help

### Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Share the error message for more specific help

### Check Supabase Logs
1. Go to Supabase Dashboard
2. Click **Logs** in the left sidebar
3. Look for authentication-related errors
4. Check timestamps to match your test attempts

### Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try signing up/logging in
4. Look for failed requests (red)
5. Click on failed request to see details

---

## Related Documentation

- [EMAIL_CONFIRMATION_GUIDE.md](./EMAIL_CONFIRMATION_GUIDE.md) - Detailed email confirmation setup
- [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) - Initial Supabase setup
- [TASK_2.4_INSTRUCTIONS.md](./TASK_2.4_INSTRUCTIONS.md) - Auth configuration steps

---

## Summary

**Most Common Issue**: Email rate limit or email confirmation enabled

**Quick Fix**: Disable email confirmation in Supabase dashboard

**For Production**: Re-enable email confirmation and configure email templates
