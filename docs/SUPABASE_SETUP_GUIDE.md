# Supabase Project Setup Guide

This guide will walk you through creating a Supabase project for the LIMS Admin & Patient Registration application.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Create a Supabase Account](#create-a-supabase-account)
3. [Create a New Supabase Project](#create-a-new-supabase-project)
4. [Obtain Project Credentials](#obtain-project-credentials)
5. [Update Environment Variables](#update-environment-variables)
6. [Verify Setup](#verify-setup)
7. [Next Steps](#next-steps)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:
- ✅ A valid email address
- ✅ Internet connection
- ✅ Access to the LIMS application codebase
- ✅ A text editor to update the `.env.local` file

---

## Create a Supabase Account

If you don't already have a Supabase account, follow these steps:

### Step 1: Visit Supabase Website
1. Open your web browser
2. Navigate to [https://supabase.com](https://supabase.com)
3. Click the **"Start your project"** button in the top right corner

### Step 2: Sign Up
You have multiple options to sign up:

**Option A: Sign up with GitHub (Recommended)**
1. Click **"Continue with GitHub"**
2. Authorize Supabase to access your GitHub account
3. You'll be redirected to the Supabase dashboard

**Option B: Sign up with Email**
1. Click **"Sign up with email"**
2. Enter your email address
3. Create a strong password
4. Click **"Sign Up"**
5. Check your email for a verification link
6. Click the verification link to activate your account

### Step 3: Complete Profile (if prompted)
- Fill in any additional profile information requested
- Accept the Terms of Service and Privacy Policy

---

## Create a New Supabase Project

Once you're logged into the Supabase dashboard:

### Step 1: Access the Dashboard
- After logging in, you'll see the Supabase dashboard
- If you have existing projects, you'll see them listed here

### Step 2: Create New Project
1. Click the **"New Project"** button
   - If this is your first project, you'll see a prominent "New Project" card
   - If you have existing projects, look for the "+ New Project" button

### Step 3: Select or Create an Organization
- If you don't have an organization yet:
  1. Click **"Create a new organization"**
  2. Enter an organization name (e.g., "LIMS Development" or your company name)
  3. Choose a billing plan:
     - **Free Plan**: Perfect for development and testing
       - 500 MB database space
       - 1 GB file storage
       - 2 GB bandwidth
       - 50,000 monthly active users
     - **Pro Plan**: For production applications (optional)
  4. Click **"Create organization"**

### Step 4: Configure Project Settings

Fill in the following project details:

#### Project Name
- Enter a descriptive name: **`lims-admin-app`** or **`lims-patient-registration`**
- This name is for your reference only

#### Database Password
- **IMPORTANT**: Generate a strong password
- Click the **"Generate a password"** button (recommended)
- **⚠️ CRITICAL**: Copy and save this password immediately!
  - Store it in a secure password manager
  - You'll need this password to access the database directly
  - You cannot retrieve this password later from the dashboard

#### Region
- Select the region closest to your users or your location
- Common options:
  - **US East (North Virginia)** - `us-east-1`
  - **US West (Oregon)** - `us-west-1`
  - **Europe (Frankfurt)** - `eu-central-1`
  - **Asia Pacific (Singapore)** - `ap-southeast-1`
  - **Asia Pacific (Sydney)** - `ap-southeast-2`
- **Note**: You cannot change the region after project creation

#### Pricing Plan
- For development: Select **"Free"**
- For production: Consider **"Pro"** for better performance and support

### Step 5: Create the Project
1. Review all settings
2. Click the **"Create new project"** button
3. Wait for the project to be provisioned (this takes 1-2 minutes)
4. You'll see a progress indicator while the project is being set up

### Step 6: Project Created Successfully
- Once complete, you'll be redirected to your project dashboard
- You'll see the project overview with various sections:
  - Table Editor
  - Authentication
  - Storage
  - SQL Editor
  - API Documentation

---

## Obtain Project Credentials

Now you need to get the three essential credentials for your application:

### Step 1: Navigate to API Settings
1. In your project dashboard, look for the **Settings** icon (⚙️) in the left sidebar
2. Click on **Settings**
3. In the Settings menu, click on **API**

### Step 2: Locate Your Credentials

You'll see the API settings page with several important values:

#### 1. Project URL
- **Label**: "Project URL" or "URL"
- **Location**: Near the top of the API settings page
- **Format**: `https://[your-project-ref].supabase.co`
- **Example**: `https://abcdefghijklmnop.supabase.co`
- **Usage**: This is your `NEXT_PUBLIC_SUPABASE_URL`

**How to copy:**
1. Find the "Project URL" section
2. Click the **copy icon** (📋) next to the URL
3. Paste it into a temporary text file or note

#### 2. Anonymous (anon) Public Key
- **Label**: "anon public" under "Project API keys"
- **Location**: In the "Project API keys" section
- **Format**: Long JWT token starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Usage**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Security**: Safe to use in client-side code (has limited permissions)

**How to copy:**
1. Scroll down to "Project API keys"
2. Find the key labeled **"anon"** or **"anon public"**
3. Click the **copy icon** (📋) or click "Reveal" then copy
4. Paste it into your temporary note

#### 3. Service Role Key
- **Label**: "service_role secret" under "Project API keys"
- **Location**: In the "Project API keys" section, below the anon key
- **Format**: Long JWT token starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Usage**: This is your `SUPABASE_SERVICE_ROLE_KEY`
- **⚠️ SECURITY WARNING**: 
  - This key has **FULL ADMIN ACCESS** to your database
  - **NEVER** expose this in client-side code
  - **NEVER** commit this to version control
  - Only use in server-side API routes and server components

**How to copy:**
1. In the "Project API keys" section
2. Find the key labeled **"service_role"** or **"service_role secret"**
3. Click **"Reveal"** to show the key
4. Click the **copy icon** (📋) to copy
5. Paste it into your temporary note

### Step 3: Verify You Have All Three Values

Before proceeding, confirm you have:
- ✅ Project URL (starts with `https://`)
- ✅ Anon public key (long JWT token)
- ✅ Service role key (long JWT token, different from anon key)

---

## Update Environment Variables

Now you'll update your local environment file with the credentials:

### Step 1: Locate the .env.local File
1. Open your LIMS application project in your code editor
2. Navigate to the `lims-app` directory
3. Find the `.env.local` file in the root of the `lims-app` folder

### Step 2: Update the Environment Variables

Replace the placeholder values with your actual Supabase credentials:

**Before (placeholder values):**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**After (with your actual values):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzg4MzIwMCwiZXhwIjoxOTM5NDU5MjAwfQ.example_anon_key_signature
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjIzODgzMjAwLCJleHAiOjE5Mzk0NTkyMDB9.example_service_role_key_signature
```

### Step 3: Save the File
1. Save the `.env.local` file
2. **Important**: Ensure the file is named exactly `.env.local` (with the leading dot)
3. Verify the file is in the `lims-app` directory (not in a subdirectory)

### Step 4: Security Check
- ✅ Confirm `.env.local` is listed in your `.gitignore` file
- ✅ Never commit `.env.local` to version control
- ✅ Never share your service role key publicly

---

## Verify Setup

Let's verify that your Supabase project is properly configured:

### Step 1: Restart Development Server (if running)
If your Next.js development server is running:
1. Stop the server (press `Ctrl+C` in the terminal)
2. Restart it with `npm run dev`
3. This ensures the new environment variables are loaded

### Step 2: Check Supabase Dashboard
1. Go back to your Supabase project dashboard
2. Click on **"Table Editor"** in the left sidebar
3. You should see an empty database (no tables yet - that's expected!)
4. This confirms your project is active and ready

### Step 3: Test Connection (Optional)
You can test the connection by creating a simple test file:

Create `lims-app/test-supabase-connection.js`:
```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase client created successfully!');
console.log('📍 Project URL:', supabaseUrl);
console.log('🔑 Anon key configured:', supabaseKey.substring(0, 20) + '...');
```

Run the test:
```bash
cd lims-app
node test-supabase-connection.js
```

Expected output:
```
✅ Supabase client created successfully!
📍 Project URL: https://abcdefghijklmnop.supabase.co
🔑 Anon key configured: eyJhbGciOiJIUzI1NiI...
```

**Note**: Delete this test file after verification for security.

---

## Next Steps

Congratulations! Your Supabase project is now set up. Here's what comes next:

### Immediate Next Steps (Task 2.2)
1. **Create the patients table** with the required schema
2. **Set up Row Level Security (RLS)** policies
3. **Configure Supabase Auth** settings
4. **Create Supabase client utilities** for the application

### What You've Accomplished
- ✅ Created a Supabase account
- ✅ Created a new Supabase project
- ✅ Obtained all required API credentials
- ✅ Updated the `.env.local` file with actual values
- ✅ Verified the setup

### Important Reminders
- 🔐 Keep your database password secure
- 🔐 Never commit `.env.local` to version control
- 🔐 Never share your service role key
- 📝 Document your project details for team members
- 💾 Consider backing up your credentials in a secure password manager

---

## Troubleshooting

### Issue: Can't Find the API Settings Page
**Solution:**
1. Make sure you're in the correct project
2. Look for the Settings icon (⚙️) in the left sidebar
3. Click Settings → API

### Issue: Project Creation Failed
**Solution:**
1. Check your internet connection
2. Try refreshing the page
3. Try a different browser
4. Contact Supabase support if the issue persists

### Issue: Can't See Service Role Key
**Solution:**
1. Click the "Reveal" button next to the service_role key
2. You may need to re-authenticate for security
3. Make sure you have the necessary permissions in your organization

### Issue: Environment Variables Not Loading
**Solution:**
1. Verify the file is named exactly `.env.local` (with the dot)
2. Verify the file is in the `lims-app` directory
3. Restart your development server
4. Check for typos in variable names
5. Ensure there are no extra spaces around the `=` sign

### Issue: "Invalid API Key" Error
**Solution:**
1. Double-check you copied the entire key (they're very long)
2. Ensure there are no extra spaces or line breaks
3. Verify you're using the correct key for each variable:
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role secret key
4. Try copying the keys again from the Supabase dashboard

### Issue: Project URL Not Working
**Solution:**
1. Verify the URL format: `https://[project-ref].supabase.co`
2. Ensure you included `https://` at the beginning
3. Check for typos in the project reference
4. Wait a few minutes if the project was just created

### Need More Help?
- 📚 [Supabase Documentation](https://supabase.com/docs)
- 💬 [Supabase Discord Community](https://discord.supabase.com)
- 🐛 [Supabase GitHub Issues](https://github.com/supabase/supabase/issues)
- 📧 [Supabase Support](https://supabase.com/support)

---

## Additional Resources

### Supabase Dashboard Overview
- **Table Editor**: Create and manage database tables
- **Authentication**: Configure auth providers and settings
- **Storage**: Manage file uploads and storage buckets
- **SQL Editor**: Run custom SQL queries
- **API Docs**: Auto-generated API documentation
- **Logs**: View real-time logs and errors

### Security Best Practices
1. **Use Row Level Security (RLS)** on all tables
2. **Never expose service role key** in client-side code
3. **Rotate keys** if they're ever compromised
4. **Use environment variables** for all sensitive data
5. **Enable 2FA** on your Supabase account
6. **Regularly review** API usage and logs

### Useful Supabase Features for LIMS
- **Real-time subscriptions**: Get live updates when data changes
- **Authentication**: Built-in user management
- **Storage**: Store patient documents and images
- **Edge Functions**: Serverless functions for custom logic
- **Database backups**: Automatic daily backups (Pro plan)

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Task Reference**: Task 2.1 - Create Supabase Project  
**Spec**: LIMS Admin & Patient Registration
