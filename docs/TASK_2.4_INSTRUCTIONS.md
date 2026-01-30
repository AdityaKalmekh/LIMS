# Task 2.4: Configure Supabase Auth Settings - User Instructions

## 🎯 Task Overview

**Task ID**: 2.4  
**Task Name**: Configure Supabase Auth settings  
**Type**: Manual Task (requires user action in Supabase Dashboard)  
**Estimated Time**: 15-25 minutes  
**Status**: Ready for user to execute

---

## 📋 What You Need to Do

This is a **manual configuration task** that requires you to configure authentication settings in the Supabase dashboard. This will enable admin users to sign up and log in to the LIMS application.

---

## 🚀 Getting Started

### Prerequisites

Before starting this task, ensure:
- ✅ Task 2.1 completed (Supabase project created)
- ✅ Task 2.2 completed (patients table created)
- ✅ Task 2.3 completed (RLS policies applied)
- ✅ You have access to your Supabase Dashboard
- ✅ You know your application's URL (for development: `http://localhost:3000`)

---

## ✅ Quick Start (4 Main Steps)

If you want to start immediately, here's the ultra-condensed version:

### 1. Enable Email Authentication
→ Authentication → Providers → Email → Enable

### 2. Configure Site URL
→ Authentication → URL Configuration → Set Site URL to `http://localhost:3000`

### 3. Add Redirect URLs
→ Authentication → URL Configuration → Add redirect URLs

### 4. Configure Email Settings (Optional)
→ Authentication → Email Templates → Customize if needed

**For detailed instructions on each step, continue reading below.**

---

## 📖 Detailed Step-by-Step Instructions

### Step 1: Access Authentication Settings

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your **LIMS project** (e.g., `lims-admin-app`)
3. In the left sidebar, click on **Authentication** (🔐 icon)
4. You'll see the Authentication dashboard with several tabs

---

### Step 2: Enable Email Authentication Provider

Email authentication is the primary method for admin users to sign up and log in.

#### 2.1 Navigate to Providers
1. In the Authentication section, click on **Providers** in the top tabs
2. You'll see a list of authentication providers (Email, Phone, Google, GitHub, etc.)

#### 2.2 Configure Email Provider
1. Find **Email** in the list of providers
2. Click on **Email** to expand the settings
3. You'll see several options:

**Enable Email Provider:**
- Toggle **"Enable Email provider"** to **ON** (if not already enabled)
- This is usually enabled by default

**Email Confirmation Settings:**
- **"Enable email confirmations"**: 
  - For **development**: Toggle **OFF** (recommended for easier testing)
  - For **production**: Toggle **ON** (recommended for security)
  - When OFF: Users can log in immediately after signup
  - When ON: Users must click a confirmation link in their email

**Secure Email Change:**
- **"Enable secure email change"**: 
  - For **development**: Toggle **OFF** (optional)
  - For **production**: Toggle **ON** (recommended)
  - When ON: Users must confirm both old and new email addresses

**Recommended Settings for Development:**
```
✅ Enable Email provider: ON
❌ Enable email confirmations: OFF
❌ Enable secure email change: OFF
```

**Recommended Settings for Production:**
```
✅ Enable Email provider: ON
✅ Enable email confirmations: ON
✅ Enable secure email change: ON
```

4. Click **Save** at the bottom of the Email provider section

---

### Step 3: Configure URL Settings

URL configuration is critical for authentication redirects to work properly.

#### 3.1 Navigate to URL Configuration
1. In the Authentication section, click on **URL Configuration** in the top tabs
2. You'll see several URL-related settings

#### 3.2 Set Site URL
The Site URL is the main URL of your application.

**For Development:**
1. Find the **"Site URL"** field
2. Enter: `http://localhost:3000`
3. This is where users will be redirected after authentication

**For Production (when deploying):**
1. Update the Site URL to your production domain
2. Example: `https://lims.yourdomain.com`

#### 3.3 Add Redirect URLs
Redirect URLs are the allowed URLs where Supabase can redirect users after authentication.

**For Development:**
1. Find the **"Redirect URLs"** section
2. Click **"Add URL"** or look for the text area
3. Add the following URLs (one per line):

```
http://localhost:3000
http://localhost:3000/auth/callback
http://localhost:3000/dashboard
http://localhost:3000/login
http://localhost:3000/signup
```

**Why these URLs?**
- `http://localhost:3000` - Base application URL
- `http://localhost:3000/auth/callback` - OAuth callback endpoint
- `http://localhost:3000/dashboard` - Post-login redirect
- `http://localhost:3000/login` - Login page
- `http://localhost:3000/signup` - Signup page

**For Production (when deploying):**
Add your production URLs:
```
https://lims.yourdomain.com
https://lims.yourdomain.com/auth/callback
https://lims.yourdomain.com/dashboard
https://lims.yourdomain.com/login
https://lims.yourdomain.com/signup
```

4. Click **Save** to apply the changes

---

### Step 4: Configure Email Templates (Optional)

Email templates control the content of authentication emails sent to users.

#### 4.1 Navigate to Email Templates
1. In the Authentication section, click on **Email Templates** in the top tabs
2. You'll see several email template types:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

#### 4.2 Customize Templates (Optional)

For development, the default templates work fine. However, you can customize them:

**Confirm Signup Template:**
1. Click on **"Confirm signup"**
2. You'll see the email template with variables like `{{ .ConfirmationURL }}`
3. You can customize:
   - Subject line
   - Email body text
   - Styling (HTML)
   - Button text

**Default Template Example:**
```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

**Customized Template Example (Optional):**
```html
<h2>Welcome to LIMS Admin Portal</h2>
<p>Thank you for signing up! Please confirm your email address to access the patient management system.</p>
<p><a href="{{ .ConfirmationURL }}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Confirm Email Address</a></p>
<p>If you didn't create an account, you can safely ignore this email.</p>
```

**Reset Password Template:**
1. Click on **"Reset Password"**
2. Customize if desired (optional for now)

**Important Variables:**
- `{{ .ConfirmationURL }}` - Email confirmation link
- `{{ .Token }}` - Verification token
- `{{ .TokenHash }}` - Hashed token
- `{{ .SiteURL }}` - Your site URL

3. Click **Save** after making any changes

**Recommendation for Development:**
- Keep the default templates for now
- Customize later when preparing for production

---

### Step 5: Configure Additional Auth Settings

#### 5.1 Session Settings (Optional)
1. In the Authentication section, click on **Settings** (or **Configuration**)
2. Look for session-related settings:

**JWT Expiry:**
- Default: 3600 seconds (1 hour)
- For development: Keep default or increase to 86400 (24 hours) for convenience
- For production: Keep default (3600 seconds) for security

**Refresh Token Rotation:**
- Keep **enabled** (recommended for security)
- This automatically rotates refresh tokens to prevent token theft

#### 5.2 Password Requirements (Optional)
1. Look for **Password** settings
2. Configure minimum password requirements:

**Recommended Settings:**
```
Minimum password length: 8 characters
Require uppercase: Optional (OFF for easier development)
Require lowercase: Optional (OFF for easier development)
Require numbers: Optional (OFF for easier development)
Require special characters: Optional (OFF for easier development)
```

**For Production:**
Consider enabling stricter requirements:
```
Minimum password length: 12 characters
Require uppercase: ON
Require lowercase: ON
Require numbers: ON
Require special characters: ON
```

3. Click **Save** if you made any changes

---

## 🔍 Verification Steps

After completing the configuration, verify everything is set up correctly:

### Verification Checklist

Run through this checklist to ensure proper configuration:

- [ ] **Email Provider Enabled**
  - Go to Authentication → Providers → Email
  - Verify toggle is ON
  - Verify email confirmations setting matches your choice

- [ ] **Site URL Configured**
  - Go to Authentication → URL Configuration
  - Verify Site URL is set to `http://localhost:3000`

- [ ] **Redirect URLs Added**
  - Go to Authentication → URL Configuration
  - Verify all 5 redirect URLs are listed
  - Verify no typos in URLs

- [ ] **Email Templates Reviewed**
  - Go to Authentication → Email Templates
  - Verify templates look appropriate (default is fine)

### Quick Visual Check

**Authentication Dashboard:**
1. Go to Authentication → Users
2. You should see an empty user list (no users yet - that's expected!)
3. This confirms the auth system is ready

---

## 🧪 Testing Your Configuration (Optional)

You can test the auth configuration before implementing the UI:

### Test 1: Create a Test User via Dashboard

1. Go to Authentication → Users
2. Click **"Add user"** or **"Invite user"**
3. Enter a test email: `admin@test.com`
4. Enter a test password: `TestPassword123`
5. Click **"Create user"** or **"Send invitation"**
6. You should see the user appear in the users list

**Expected Result:**
- User appears in the list
- Status shows as "Confirmed" (if email confirmations are OFF)
- Status shows as "Waiting for verification" (if email confirmations are ON)

### Test 2: Verify Auth API Endpoint

You can test the auth endpoint using curl or a tool like Postman:

```bash
curl -X POST 'https://[YOUR-PROJECT-REF].supabase.co/auth/v1/signup' \
-H "apikey: [YOUR-ANON-KEY]" \
-H "Content-Type: application/json" \
-d '{
  "email": "test@example.com",
  "password": "testpassword123"
}'
```

Replace:
- `[YOUR-PROJECT-REF]` with your project reference from the URL
- `[YOUR-ANON-KEY]` with your anon key from `.env.local`

**Expected Response:**
```json
{
  "id": "uuid-here",
  "email": "test@example.com",
  "created_at": "timestamp",
  ...
}
```

---

## 📊 What You've Configured

After completing this task, you have:

✅ **Email Authentication Enabled**
- Admin users can sign up with email and password
- Admin users can log in with email and password

✅ **URL Configuration Set**
- Site URL configured for local development
- Redirect URLs added for all auth flows
- Ready for OAuth callbacks

✅ **Email Templates Ready**
- Default templates configured
- Confirmation emails will work (if enabled)
- Password reset emails will work

✅ **Security Settings Configured**
- Session management configured
- Password requirements set
- Token rotation enabled

✅ **Auth System Ready**
- Ready for frontend implementation
- Ready to create admin users
- Ready for login/signup forms

---

## 🚨 Common Issues and Troubleshooting

### Issue 1: "Invalid redirect URL" Error

**Symptoms:**
- Users get an error after trying to log in
- Error message mentions redirect URL

**Solution:**
1. Go to Authentication → URL Configuration
2. Verify the redirect URL is in the allowed list
3. Check for typos (http vs https, trailing slashes, etc.)
4. Add the exact URL that's failing
5. Click Save

### Issue 2: Email Confirmations Not Working

**Symptoms:**
- Users don't receive confirmation emails
- Signup seems to work but users can't log in

**Solution:**
1. Check if email confirmations are enabled
2. For development, consider disabling email confirmations
3. Check your email spam folder
4. Verify email templates are configured
5. Check Supabase logs for email delivery errors

### Issue 3: Users Can't Log In After Signup

**Symptoms:**
- Signup succeeds but login fails
- "Invalid credentials" error

**Possible Causes:**
1. **Email confirmations enabled**: User must confirm email first
   - Solution: Check email for confirmation link, or disable confirmations for dev
2. **Wrong password**: User entered incorrect password
   - Solution: Use password reset flow
3. **User not created**: Signup didn't actually create the user
   - Solution: Check Authentication → Users to verify user exists

### Issue 4: "Site URL not configured" Warning

**Symptoms:**
- Warning in Supabase dashboard
- Auth redirects not working properly

**Solution:**
1. Go to Authentication → URL Configuration
2. Set the Site URL to `http://localhost:3000`
3. Click Save
4. Restart your development server

### Issue 5: CORS Errors in Browser Console

**Symptoms:**
- Browser console shows CORS errors
- Auth requests fail

**Solution:**
1. Verify your Site URL matches your actual development URL
2. Check that redirect URLs include your development URL
3. Ensure you're using the correct Supabase URL in `.env.local`
4. Clear browser cache and try again

---

## 🔐 Security Best Practices

### For Development

1. **Disable Email Confirmations**: Makes testing easier
2. **Use Simple Passwords**: For test accounts only
3. **Keep Service Role Key Secret**: Never commit to git
4. **Use localhost URLs**: Don't expose development server

### For Production

1. **Enable Email Confirmations**: Verify user email addresses
2. **Enforce Strong Passwords**: Minimum 12 characters with complexity
3. **Enable Secure Email Change**: Require confirmation for email changes
4. **Use HTTPS Only**: Never use HTTP in production
5. **Rotate Keys Regularly**: Change API keys periodically
6. **Monitor Auth Logs**: Check for suspicious activity
7. **Enable 2FA**: For admin accounts (future enhancement)
8. **Rate Limiting**: Configure rate limits to prevent abuse

---

## 📝 Configuration Summary

Here's a quick reference of your configuration:

### Development Configuration

```yaml
Email Provider:
  Enabled: ✅ Yes
  Email Confirmations: ❌ No (for easier testing)
  Secure Email Change: ❌ No

URL Configuration:
  Site URL: http://localhost:3000
  Redirect URLs:
    - http://localhost:3000
    - http://localhost:3000/auth/callback
    - http://localhost:3000/dashboard
    - http://localhost:3000/login
    - http://localhost:3000/signup

Email Templates:
  Using: Default templates
  Customization: Optional

Session Settings:
  JWT Expiry: 3600 seconds (1 hour)
  Refresh Token Rotation: Enabled

Password Requirements:
  Minimum Length: 8 characters
  Complexity: Optional (for development)
```

### Production Configuration (Future)

```yaml
Email Provider:
  Enabled: ✅ Yes
  Email Confirmations: ✅ Yes
  Secure Email Change: ✅ Yes

URL Configuration:
  Site URL: https://lims.yourdomain.com
  Redirect URLs:
    - https://lims.yourdomain.com
    - https://lims.yourdomain.com/auth/callback
    - https://lims.yourdomain.com/dashboard
    - https://lims.yourdomain.com/login
    - https://lims.yourdomain.com/signup

Email Templates:
  Using: Customized templates
  Branding: Company branding applied

Session Settings:
  JWT Expiry: 3600 seconds (1 hour)
  Refresh Token Rotation: Enabled

Password Requirements:
  Minimum Length: 12 characters
  Complexity: Required (uppercase, lowercase, numbers, special chars)
```

---

## 🎯 Next Steps

After completing Task 2.4, you're ready for:

### Task 2.5: Create Supabase Client Utilities
You'll create the client-side and server-side Supabase client utilities that your application will use to interact with Supabase.

### Task 3.1: Create Auth Layout and Pages
You'll implement the actual login and signup pages using the auth configuration you just set up.

### What's Ready Now
- ✅ Supabase project created
- ✅ Database tables created
- ✅ RLS policies applied
- ✅ **Authentication configured** ← You are here
- ⏭️ Client utilities (next)
- ⏭️ Login/Signup UI (coming soon)

---

## 📚 Additional Resources

### Supabase Auth Documentation
- [Auth Overview](https://supabase.com/docs/guides/auth)
- [Email Auth](https://supabase.com/docs/guides/auth/auth-email)
- [Auth UI](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)
- [Server-Side Auth](https://supabase.com/docs/guides/auth/server-side-rendering)

### Next.js Integration
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Next.js App Router Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)

### Security Resources
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Auth Security Best Practices](https://supabase.com/docs/guides/auth/auth-deep-dive/auth-deep-dive-jwts)

---

## ✅ Task Completion Checklist

Mark this task as complete when you can check all these boxes:

- [ ] Email authentication provider is enabled
- [ ] Email confirmation settings configured (OFF for dev, ON for prod)
- [ ] Site URL is set to `http://localhost:3000`
- [ ] All 5 redirect URLs are added and saved
- [ ] Email templates reviewed (default is fine)
- [ ] Session settings reviewed (default is fine)
- [ ] Password requirements configured (8 chars minimum for dev)
- [ ] Verification checklist completed
- [ ] Optional: Test user created successfully
- [ ] Ready to proceed to Task 2.5

---

## 💡 Pro Tips

1. **Screenshot Your Settings**: Take screenshots of your configuration for reference
2. **Document Custom Changes**: If you customize email templates, save a copy
3. **Test Early**: Create a test user to verify everything works
4. **Keep It Simple**: Use default settings for development, customize for production
5. **Plan for Production**: Think about production settings now, but implement later

---

## 🎉 You're Done!

Congratulations! Your Supabase authentication is now configured and ready for use.

**What you've accomplished:**
- ✅ Configured email authentication
- ✅ Set up URL redirects
- ✅ Prepared email templates
- ✅ Configured security settings
- ✅ Ready for frontend implementation

**Next up:** Task 2.5 - Create Supabase client utilities

---

**Task**: 2.4 Configure Supabase Auth settings  
**Documentation Version**: 1.0  
**Last Updated**: 2024  
**Spec**: LIMS Admin & Patient Registration
