# Supabase Auth Configuration - Troubleshooting Guide

## 🔧 Comprehensive Troubleshooting for Task 2.4

This guide helps you resolve common issues when configuring Supabase authentication settings.

---

## 📋 Table of Contents

1. [Dashboard Navigation Issues](#dashboard-navigation-issues)
2. [Email Provider Configuration Issues](#email-provider-configuration-issues)
3. [URL Configuration Issues](#url-configuration-issues)
4. [Email Template Issues](#email-template-issues)
5. [User Creation Issues](#user-creation-issues)
6. [Authentication Flow Issues](#authentication-flow-issues)
7. [Browser and Network Issues](#browser-and-network-issues)
8. [Environment Variable Issues](#environment-variable-issues)

---

## Dashboard Navigation Issues

### Issue 1: Can't Find Authentication Tab

**Symptoms:**
- Don't see "Authentication" in the sidebar
- Dashboard looks different than expected

**Solutions:**

1. **Check if you're in the correct project**
   ```
   Top of dashboard should show: "lims-admin-app" (or your project name)
   If not, click the project dropdown and select the correct project
   ```

2. **Look for the correct icon**
   ```
   🔐 Authentication (lock icon)
   Located in the left sidebar
   ```

3. **Scroll down in the sidebar**
   ```
   The sidebar may be long - scroll down to find Authentication
   ```

4. **Refresh the page**
   ```
   Press F5 or Ctrl+R (Cmd+R on Mac)
   Sometimes the dashboard needs a refresh
   ```

5. **Check your permissions**
   ```
   Ensure you're the project owner or have admin access
   Go to Settings → Team to verify your role
   ```

---

### Issue 2: Can't Find Providers Tab

**Symptoms:**
- Clicked on Authentication but don't see Providers tab
- Only see Users tab

**Solutions:**

1. **Look at the top of the page**
   ```
   After clicking Authentication, tabs appear at the top:
   [Users] [Providers] [URL Configuration] [Email Templates]
   ```

2. **Click on the Providers tab**
   ```
   It's the second tab from the left
   ```

3. **Refresh the page**
   ```
   Sometimes tabs don't load properly
   Press F5 to refresh
   ```

4. **Try a different browser**
   ```
   If tabs still don't appear, try Chrome or Firefox
   ```

---

### Issue 3: Settings Not Saving

**Symptoms:**
- Click Save but nothing happens
- Changes revert after refresh

**Solutions:**

1. **Check for error messages**
   ```
   Look for red error messages above the form
   Read the error message for specific issues
   ```

2. **Verify all required fields**
   ```
   Required fields are marked with *
   Ensure all required fields are filled
   ```

3. **Check your internet connection**
   ```
   Ensure you have a stable internet connection
   Try refreshing the page
   ```

4. **Wait for the save to complete**
   ```
   Don't navigate away immediately after clicking Save
   Wait for the success message: "Settings saved successfully"
   ```

5. **Clear browser cache**
   ```
   Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
   Clear cache and cookies
   Refresh the page
   ```

---

## Email Provider Configuration Issues

### Issue 4: Email Provider Won't Enable

**Symptoms:**
- Toggle switch doesn't stay ON
- Provider shows as Disabled after saving

**Solutions:**

1. **Check project status**
   ```
   Ensure your Supabase project is active
   Go to Settings → General to verify project status
   ```

2. **Verify billing status**
   ```
   Free tier should work fine for email auth
   Check Settings → Billing to ensure account is in good standing
   ```

3. **Try disabling and re-enabling**
   ```
   1. Toggle OFF
   2. Click Save
   3. Refresh page
   4. Toggle ON
   5. Click Save
   ```

4. **Check browser console for errors**
   ```
   Press F12 to open developer tools
   Look for red error messages in Console tab
   Share error messages with support if needed
   ```

---

### Issue 5: Email Confirmations Setting Confusion

**Symptoms:**
- Not sure whether to enable or disable email confirmations
- Users can't log in after signup

**Solutions:**

**For Development (Recommended):**
```
Enable email confirmations: OFF

Why?
- Users can log in immediately after signup
- No need to check email during testing
- Faster development workflow
- Can always enable later for production
```

**For Production (Recommended):**
```
Enable email confirmations: ON

Why?
- Verifies user email addresses are real
- Prevents fake account creation
- Better security
- Industry standard practice
```

**If Users Can't Log In:**
```
1. Check if email confirmations are ON
2. If ON, user must click confirmation link in email
3. Check spam folder for confirmation email
4. For development, consider turning OFF
5. For production, resend confirmation email
```

---

## URL Configuration Issues

### Issue 6: Invalid Redirect URL Error

**Symptoms:**
- Error message: "Invalid redirect URL"
- Can't save URL configuration

**Solutions:**

1. **Check URL format**
   ```
   ✅ Correct: http://localhost:3000
   ❌ Wrong: localhost:3000 (missing http://)
   ❌ Wrong: http://localhost:3000/ (trailing slash may cause issues)
   ❌ Wrong: http://localhost (missing port)
   ```

2. **Ensure protocol is included**
   ```
   Development: http://
   Production: https://
   ```

3. **Check for typos**
   ```
   Common typos:
   - localhos instead of localhost
   - 300 instead of 3000
   - htpp instead of http
   ```

4. **Remove trailing slashes**
   ```
   ✅ Correct: http://localhost:3000
   ❌ Wrong: http://localhost:3000/
   ```

5. **One URL per line**
   ```
   ✅ Correct:
   http://localhost:3000
   http://localhost:3000/auth/callback
   
   ❌ Wrong:
   http://localhost:3000, http://localhost:3000/auth/callback
   ```

---

### Issue 7: Site URL Not Saving

**Symptoms:**
- Site URL field is empty after saving
- Warning: "Site URL not configured"

**Solutions:**

1. **Enter the complete URL**
   ```
   Development: http://localhost:3000
   Production: https://lims.yourdomain.com
   ```

2. **Don't include paths**
   ```
   ✅ Correct: http://localhost:3000
   ❌ Wrong: http://localhost:3000/dashboard
   ```

3. **Match your actual app URL**
   ```
   If your app runs on port 3001, use:
   http://localhost:3001
   ```

4. **Click Save after entering**
   ```
   Don't just type and navigate away
   Click the Save button
   Wait for success message
   ```

---

### Issue 8: Redirect URLs Not Working in App

**Symptoms:**
- Auth redirects fail in your application
- Error: "Redirect URL not allowed"

**Solutions:**

1. **Verify exact URL match**
   ```
   The redirect URL in your app must EXACTLY match
   one of the URLs in the Supabase configuration
   
   Check:
   - http vs https
   - Port number
   - Path (e.g., /auth/callback)
   - Trailing slashes
   ```

2. **Add all possible redirect URLs**
   ```
   Add these URLs:
   http://localhost:3000
   http://localhost:3000/auth/callback
   http://localhost:3000/dashboard
   http://localhost:3000/login
   http://localhost:3000/signup
   ```

3. **Restart your development server**
   ```
   After updating Supabase configuration:
   1. Stop your Next.js dev server (Ctrl+C)
   2. Start it again (npm run dev)
   ```

4. **Clear browser cache**
   ```
   Ctrl+Shift+Delete
   Clear cache and cookies
   Refresh your app
   ```

---

## Email Template Issues

### Issue 9: Can't Edit Email Templates

**Symptoms:**
- Email template editor is read-only
- Save button is disabled

**Solutions:**

1. **Check if you clicked Edit**
   ```
   1. Go to Authentication → Email Templates
   2. Click on the template name (e.g., "Confirm signup")
   3. Look for Edit button or pencil icon
   4. Click to enable editing
   ```

2. **Verify permissions**
   ```
   Ensure you have admin access to the project
   Go to Settings → Team to check your role
   ```

3. **Try a different browser**
   ```
   Some browsers may have issues with the editor
   Try Chrome or Firefox
   ```

---

### Issue 10: Email Template Variables Not Working

**Symptoms:**
- Variables like `{{ .ConfirmationURL }}` appear as plain text in emails
- Links in emails don't work

**Solutions:**

1. **Use correct variable syntax**
   ```
   ✅ Correct: {{ .ConfirmationURL }}
   ❌ Wrong: {{.ConfirmationURL}} (no spaces)
   ❌ Wrong: {{ ConfirmationURL }} (missing dot)
   ❌ Wrong: {{ confirmationURL }} (wrong case)
   ```

2. **Available variables:**
   ```
   {{ .ConfirmationURL }} - Email confirmation link
   {{ .Token }}           - Verification token
   {{ .TokenHash }}       - Hashed token
   {{ .SiteURL }}         - Your site URL
   ```

3. **Test with default template first**
   ```
   If custom template doesn't work:
   1. Click "Reset to default"
   2. Test with default template
   3. If default works, issue is in your custom template
   ```

---

## User Creation Issues

### Issue 11: Can't Create Test User

**Symptoms:**
- "Add user" button doesn't work
- Error when creating user

**Solutions:**

1. **Check email format**
   ```
   ✅ Correct: admin@test.com
   ❌ Wrong: admin@test (missing domain)
   ❌ Wrong: admin (not an email)
   ```

2. **Check password requirements**
   ```
   Minimum length: 8 characters (or your configured minimum)
   If complexity is enabled, include:
   - Uppercase letters
   - Lowercase letters
   - Numbers
   - Special characters
   ```

3. **Verify email provider is enabled**
   ```
   Go to Authentication → Providers → Email
   Ensure toggle is ON
   ```

4. **Check for duplicate email**
   ```
   Error: "User already exists"
   Solution: Use a different email address
   ```

---

### Issue 12: Test User Created But Can't Log In

**Symptoms:**
- User appears in Users list
- Login fails with "Invalid credentials"

**Solutions:**

1. **Check user status**
   ```
   Go to Authentication → Users
   Look at the user's status:
   
   ✅ "Confirmed" - User can log in
   ⏳ "Waiting for verification" - User must confirm email
   ❌ "Banned" - User is blocked
   ```

2. **If status is "Waiting for verification"**
   ```
   Option 1: Disable email confirmations
   - Go to Authentication → Providers → Email
   - Toggle "Enable email confirmations" to OFF
   - Create a new test user
   
   Option 2: Manually confirm the user
   - Go to Authentication → Users
   - Click on the user
   - Look for "Confirm email" button
   - Click to manually confirm
   ```

3. **Verify password**
   ```
   Make sure you're using the correct password
   Passwords are case-sensitive
   Try resetting the password
   ```

4. **Check for account lockout**
   ```
   Too many failed login attempts may lock the account
   Wait a few minutes and try again
   Or delete and recreate the user
   ```

---

## Authentication Flow Issues

### Issue 13: CORS Errors in Browser Console

**Symptoms:**
- Browser console shows CORS errors
- Auth requests fail
- Error: "Access-Control-Allow-Origin"

**Solutions:**

1. **Verify Site URL matches your app**
   ```
   Supabase Site URL: http://localhost:3000
   Your app URL: http://localhost:3000
   
   These must match exactly!
   ```

2. **Check redirect URLs**
   ```
   Ensure your app's URL is in the redirect URLs list
   ```

3. **Restart development server**
   ```
   1. Stop server (Ctrl+C)
   2. Clear .next cache: rm -rf .next
   3. Start server: npm run dev
   ```

4. **Check environment variables**
   ```
   Verify .env.local has correct values:
   NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

---

### Issue 14: JWT Expiry Too Short/Long

**Symptoms:**
- Users get logged out too quickly
- Sessions last too long

**Solutions:**

1. **Adjust JWT expiry**
   ```
   Go to Authentication → Settings
   Find "JWT expiry (seconds)"
   
   Common values:
   3600 = 1 hour (recommended)
   7200 = 2 hours
   86400 = 24 hours (development only)
   ```

2. **Understand the trade-off**
   ```
   Shorter expiry = More secure, more frequent re-auth
   Longer expiry = More convenient, less secure
   ```

3. **Use refresh tokens**
   ```
   Ensure "Refresh token rotation" is enabled
   This allows seamless re-authentication
   ```

---

## Browser and Network Issues

### Issue 15: Dashboard Not Loading

**Symptoms:**
- Supabase dashboard is blank or stuck loading
- Infinite loading spinner

**Solutions:**

1. **Check internet connection**
   ```
   Ensure you have a stable internet connection
   Try loading other websites
   ```

2. **Clear browser cache**
   ```
   Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
   Clear cache and cookies
   Refresh page
   ```

3. **Try incognito/private mode**
   ```
   Ctrl+Shift+N (Chrome)
   Ctrl+Shift+P (Firefox)
   Cmd+Shift+N (Safari)
   
   If it works in incognito, issue is with browser cache/extensions
   ```

4. **Disable browser extensions**
   ```
   Ad blockers or privacy extensions may interfere
   Temporarily disable extensions
   Refresh page
   ```

5. **Try a different browser**
   ```
   Recommended browsers:
   - Chrome (latest)
   - Firefox (latest)
   - Edge (latest)
   ```

---

### Issue 16: Changes Not Reflecting

**Symptoms:**
- Made changes but they don't appear
- Old settings still showing

**Solutions:**

1. **Hard refresh the page**
   ```
   Ctrl+Shift+R (Cmd+Shift+R on Mac)
   Or Ctrl+F5
   ```

2. **Clear browser cache**
   ```
   Ctrl+Shift+Delete
   Clear cache and cookies
   Refresh page
   ```

3. **Wait a moment**
   ```
   Some changes may take a few seconds to propagate
   Wait 10-30 seconds and refresh
   ```

4. **Check if save was successful**
   ```
   Look for success message: "Settings saved successfully"
   If you didn't see this, changes weren't saved
   ```

---

## Environment Variable Issues

### Issue 17: Environment Variables Not Loading

**Symptoms:**
- App can't connect to Supabase
- Error: "supabaseUrl is required"

**Solutions:**

1. **Verify .env.local exists**
   ```
   File location: lims-app/.env.local
   Not: lims-app/src/.env.local
   Not: .env.local (in root of project)
   ```

2. **Check file name**
   ```
   ✅ Correct: .env.local
   ❌ Wrong: env.local (missing dot)
   ❌ Wrong: .env (should be .env.local)
   ❌ Wrong: .env.local.txt (extra extension)
   ```

3. **Verify variable names**
   ```
   ✅ Correct: NEXT_PUBLIC_SUPABASE_URL
   ❌ Wrong: SUPABASE_URL (missing NEXT_PUBLIC_)
   ❌ Wrong: NEXT_PUBLIC_SUPABASE_URI (URL not URI)
   ```

4. **Check for spaces**
   ```
   ✅ Correct: NEXT_PUBLIC_SUPABASE_URL=https://...
   ❌ Wrong: NEXT_PUBLIC_SUPABASE_URL = https://... (spaces around =)
   ```

5. **Restart development server**
   ```
   Environment variables are loaded at startup
   1. Stop server (Ctrl+C)
   2. Start server (npm run dev)
   ```

---

### Issue 18: Wrong Credentials in .env.local

**Symptoms:**
- Auth requests fail
- Error: "Invalid API key"

**Solutions:**

1. **Verify credentials from Supabase**
   ```
   Go to Supabase Dashboard
   Settings → API
   Copy fresh credentials
   ```

2. **Check for complete keys**
   ```
   Anon key and service role key are very long
   Ensure you copied the entire key
   They start with: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Verify project URL**
   ```
   Format: https://[project-ref].supabase.co
   Example: https://abcdefghijklmnop.supabase.co
   
   Check for typos in project reference
   ```

4. **No quotes needed**
   ```
   ✅ Correct: NEXT_PUBLIC_SUPABASE_URL=https://...
   ❌ Wrong: NEXT_PUBLIC_SUPABASE_URL="https://..."
   ```

---

## General Troubleshooting Steps

### When Nothing Else Works

1. **Start fresh**
   ```
   1. Note your current settings
   2. Reset to defaults
   3. Apply settings one by one
   4. Test after each change
   ```

2. **Check Supabase status**
   ```
   Visit: https://status.supabase.com
   Verify all systems are operational
   ```

3. **Review Supabase logs**
   ```
   Go to Supabase Dashboard
   Logs → Auth Logs
   Look for error messages
   ```

4. **Consult documentation**
   ```
   Supabase Auth Docs: https://supabase.com/docs/guides/auth
   Next.js Integration: https://supabase.com/docs/guides/auth/server-side/nextjs
   ```

5. **Ask for help**
   ```
   Supabase Discord: https://discord.supabase.com
   GitHub Issues: https://github.com/supabase/supabase/issues
   Stack Overflow: Tag with [supabase]
   ```

---

## 🆘 Getting Support

### Before Asking for Help

Gather this information:

1. **What you're trying to do**
   - Specific task (e.g., "Enable email authentication")

2. **What's happening**
   - Exact error message
   - Screenshot of the issue

3. **What you've tried**
   - Steps you've already taken
   - Solutions that didn't work

4. **Your environment**
   - Browser and version
   - Operating system
   - Supabase project region

### Where to Get Help

1. **Documentation**
   - `docs/TASK_2.4_INSTRUCTIONS.md` - Full guide
   - `docs/TASK_2.4_VISUAL_GUIDE.md` - Visual reference
   - `docs/SUPABASE_AUTH_QUICK_REFERENCE.md` - Quick lookup

2. **Supabase Resources**
   - Discord: https://discord.supabase.com
   - Docs: https://supabase.com/docs
   - GitHub: https://github.com/supabase/supabase/issues

3. **Community**
   - Stack Overflow (tag: [supabase])
   - Reddit: r/Supabase
   - Twitter: @supabase

---

## ✅ Verification After Troubleshooting

After resolving issues, verify:

- [ ] Email provider is enabled
- [ ] Site URL is configured
- [ ] Redirect URLs are added
- [ ] No error messages in dashboard
- [ ] Test user can be created
- [ ] Test user can log in (if confirmations are off)
- [ ] No CORS errors in browser console
- [ ] Environment variables are correct

---

**Troubleshooting Guide Version**: 1.0  
**Last Updated**: 2024  
**Related Documentation**: TASK_2.4_INSTRUCTIONS.md
