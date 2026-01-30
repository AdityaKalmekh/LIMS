# Complete Supabase Setup Guide

## Overview

This comprehensive guide walks you through the complete setup of Supabase for the LIMS application, from creating an account to deploying a fully functional database with authentication.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Create Supabase Account & Project](#create-supabase-account--project)
3. [Configure Environment Variables](#configure-environment-variables)
4. [Setup Database Schema](#setup-database-schema)
5. [Configure Row Level Security](#configure-row-level-security)
6. [Configure Authentication](#configure-authentication)
7. [Verify Setup](#verify-setup)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- ✅ A valid email address
- ✅ Internet connection
- ✅ The LIMS application codebase
- ✅ Node.js 18+ installed
- ✅ A text editor

**Estimated Time:** 20-30 minutes

---

## Create Supabase Account & Project

### Step 1: Create Supabase Account

1. **Visit Supabase**
   - Go to [https://supabase.com](https://supabase.com)
   - Click **"Start your project"** or **"Sign In"**

2. **Sign Up**
   
   **Option A: GitHub (Recommended)**
   - Click **"Continue with GitHub"**
   - Authorize Supabase
   - You'll be redirected to the dashboard

   **Option B: Email**
   - Click **"Sign up with email"**
   - Enter your email and create a password
   - Verify your email address

### Step 2: Create Organization

1. **Create or Select Organization**
   - If first time: Click **"Create a new organization"**
   - Enter organization name (e.g., "LIMS Development")
   - Choose billing plan:
     - **Free**: Perfect for development (500MB database, 1GB storage)
     - **Pro**: For production ($25/month, more resources)

### Step 3: Create New Project

1. **Click "New Project"**
   - In your organization dashboard
   - Click the **"+ New Project"** button

2. **Configure Project Settings**

   **Project Name:**
   ```
   lims-admin-app
   ```
   (or any descriptive name)

   **Database Password:**
   - Click **"Generate a password"** (recommended)
   - **⚠️ CRITICAL:** Copy and save this password immediately!
   - Store in a secure password manager
   - You cannot retrieve this later

   **Region:**
   - Select closest to your users:
     - `us-east-1` - US East (North Virginia)
     - `us-west-1` - US West (Oregon)
     - `eu-central-1` - Europe (Frankfurt)
     - `ap-southeast-1` - Asia Pacific (Singapore)
   - **Note:** Cannot change region after creation

   **Pricing Plan:**
   - Development: **Free**
   - Production: **Pro** (recommended)

3. **Create Project**
   - Click **"Create new project"**
   - Wait 1-2 minutes for provisioning
   - You'll see a progress indicator

4. **Project Created!**
   - You'll be redirected to the project dashboard
   - You'll see sections: Table Editor, Authentication, Storage, SQL Editor

---

## Configure Environment Variables

### Step 1: Get Supabase Credentials

1. **Navigate to API Settings**
   - In your project dashboard
   - Click **Settings** (⚙️ gear icon) in left sidebar
   - Click **API**

2. **Copy Project URL**
   - Find **"Project URL"** section
   - Format: `https://[project-ref].supabase.co`
   - Click the copy icon (📋)
   - Save this value

3. **Copy Anonymous Key**
   - Find **"Project API keys"** section
   - Locate **"anon"** **"public"** key
   - Click copy icon or "Reveal" then copy
   - Save this value

4. **Copy Service Role Key**
   - In **"Project API keys"** section
   - Locate **"service_role"** **"secret"** key
   - Click **"Reveal"**
   - Click copy icon
   - Save this value
   - ⚠️ **Keep this secret!**

### Step 2: Update Local Environment File

1. **Navigate to Project Directory**
   ```bash
   cd lims-app
   ```

2. **Copy Example File**
   ```bash
   cp .env.example .env.local
   ```

3. **Edit .env.local**
   
   Open `.env.local` in your text editor and fill in the values:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Save the File**
   - Ensure file is named exactly `.env.local`
   - Verify it's in the `lims-app/` directory
   - **Never commit this file to git!**

5. **Restart Development Server** (if running)
   ```bash
   # Stop: Ctrl+C
   # Start:
   npm run dev
   ```

---

## Setup Database Schema

### Step 1: Create Patients Table

1. **Open SQL Editor**
   - In Supabase dashboard
   - Click **SQL Editor** in left sidebar
   - Click **"New query"**

2. **Copy Migration SQL**
   
   Open `lims-app/supabase/migrations/001_create_patients_table.sql` and copy its contents.

3. **Paste and Execute**
   - Paste the SQL into the editor
   - Click **"Run"** or press `Ctrl+Enter` / `Cmd+Enter`
   - Wait for "Success. No rows returned" message

4. **Verify Table Creation**
   - Click **Table Editor** in left sidebar
   - You should see **"patients"** table listed
   - Click on it to view the schema

### Step 2: Verify Table Structure

The patients table should have these columns:

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| mobile_number | varchar(15) | NOT NULL |
| title | varchar(10) | NOT NULL |
| first_name | varchar(100) | NOT NULL |
| last_name | varchar(100) | |
| sex | varchar(10) | NOT NULL, CHECK (Male/Female/Other) |
| age_years | integer | NOT NULL, CHECK (>= 0) |
| age_months | integer | CHECK (0-11) |
| age_days | integer | CHECK (0-30) |
| referred_by | varchar(200) | |
| created_at | timestamptz | DEFAULT NOW() |
| created_by | uuid | FOREIGN KEY → auth.users(id) |
| updated_at | timestamptz | DEFAULT NOW() |

**Indexes:**
- `idx_patients_mobile` on mobile_number
- `idx_patients_created_at` on created_at DESC

---

## Configure Row Level Security

Row Level Security (RLS) ensures that only authenticated users can access patient data.

### Step 1: Enable RLS and Create Policies

1. **Open SQL Editor**
   - Click **SQL Editor** in left sidebar
   - Click **"New query"**

2. **Copy RLS Migration SQL**
   
   Open `lims-app/supabase/migrations/002_setup_rls_policies.sql` and copy its contents.

3. **Paste and Execute**
   - Paste the SQL into the editor
   - Click **"Run"**
   - Wait for success message

### Step 2: Verify RLS Configuration

1. **Check RLS is Enabled**
   
   Run this query in SQL Editor:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' AND tablename = 'patients';
   ```
   
   Expected result:
   ```
   tablename | rowsecurity
   ----------|------------
   patients  | true
   ```

2. **Check Policies Exist**
   
   Run this query:
   ```sql
   SELECT policyname, cmd 
   FROM pg_policies 
   WHERE tablename = 'patients';
   ```
   
   Expected result:
   ```
   policyname                    | cmd
   ------------------------------|--------
   Admins can view patients      | SELECT
   Admins can insert patients    | INSERT
   ```

### What RLS Does

- ✅ Only authenticated users can view patient records
- ✅ Only authenticated users can create patient records
- ✅ Unauthenticated users get empty results
- ✅ Database enforces security even if app has bugs

---

## Configure Authentication

### Step 1: Configure Email Settings

1. **Navigate to Authentication Settings**
   - Click **Authentication** in left sidebar
   - Click **Settings** tab

2. **Configure Email Confirmation** (Optional but Recommended)

   **Option A: Disable Email Confirmation (Development)**
   - Scroll to **"Email Confirmation"**
   - Toggle **OFF** "Enable email confirmations"
   - Click **"Save"**
   - Users can sign up without email verification

   **Option B: Enable Email Confirmation (Production)**
   - Keep **ON** "Enable email confirmations"
   - Configure email templates (optional)
   - Users must verify email before logging in

3. **Configure Email Templates** (Optional)
   - Click **"Email Templates"** in Authentication section
   - Customize:
     - Confirmation email
     - Password reset email
     - Magic link email
   - Use your branding and messaging

### Step 2: Configure Auth Providers

1. **Email/Password Provider**
   - Should be enabled by default
   - This is what the LIMS app uses

2. **Other Providers** (Optional)
   - Google, GitHub, etc.
   - Can be enabled later if needed

### Step 3: Configure Site URL

1. **In Authentication Settings**
   - Find **"Site URL"** setting
   - Set to your application URL:
     - Development: `http://localhost:3000`
     - Production: `https://your-domain.com`

2. **Configure Redirect URLs**
   - Add allowed redirect URLs:
     - `http://localhost:3000/**` (development)
     - `https://your-domain.com/**` (production)

---

## Verify Setup

### Step 1: Test Database Connection

1. **Start Development Server**
   ```bash
   cd lims-app
   npm run dev
   ```

2. **Open Application**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - You should see the landing page

### Step 2: Test Authentication

1. **Create Admin Account**
   - Navigate to [http://localhost:3000/signup](http://localhost:3000/signup)
   - Enter email and password
   - Click **"Sign Up"**
   - If email confirmation is disabled: You'll be logged in immediately
   - If email confirmation is enabled: Check your email for confirmation link

2. **Test Login**
   - Navigate to [http://localhost:3000/login](http://localhost:3000/login)
   - Enter your credentials
   - Click **"Log In"**
   - You should be redirected to the dashboard

### Step 3: Test Patient Registration

1. **Access Dashboard**
   - You should be at [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - You should see the patient list (empty initially)

2. **Create Test Patient**
   - Click **"New"** button
   - Fill in patient details:
     - Mobile: +919876543210
     - Title: Mr.
     - First Name: John
     - Last Name: Doe
     - Sex: Male
     - Age: 30 years
   - Click **"Register Patient"**
   - You should see a success message
   - Patient should appear in the list

3. **Verify in Supabase**
   - Go to Supabase Dashboard
   - Click **Table Editor**
   - Click **patients** table
   - You should see your test patient record

### Step 4: Test RLS Policies

1. **Test Authenticated Access**
   - While logged in, you should see patient records
   - You should be able to create new patients

2. **Test Unauthenticated Access**
   - Log out of the application
   - Try to access [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - You should be redirected to login page
   - This confirms middleware is working

---

## Troubleshooting

### Issue: Can't Create Supabase Account

**Solutions:**
- Try a different browser
- Clear browser cache and cookies
- Use GitHub authentication instead of email
- Check your email for verification link
- Contact Supabase support

---

### Issue: Project Creation Fails

**Solutions:**
- Check internet connection
- Try refreshing the page
- Try a different browser
- Wait a few minutes and try again
- Check Supabase status page: [status.supabase.com](https://status.supabase.com)

---

### Issue: Can't Find API Keys

**Solutions:**
1. Ensure you're in the correct project
2. Click Settings (⚙️) → API
3. Scroll down to "Project API keys"
4. Click "Reveal" to show service_role key
5. Use copy icons to copy keys

---

### Issue: Environment Variables Not Loading

**Symptoms:**
- "Missing environment variables" error
- Can't connect to Supabase

**Solutions:**
1. Verify file is named `.env.local` (with leading dot)
2. Verify file is in `lims-app/` directory
3. Restart development server
4. Check for typos in variable names
5. Ensure no spaces around `=` signs
6. Verify you copied complete keys (200+ characters)

---

### Issue: Migration Fails

**Symptoms:**
- SQL errors when running migrations
- "Table already exists" errors

**Solutions:**

1. **"extension uuid-ossp does not exist"**
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

2. **"table patients already exists"**
   - Table was already created
   - Skip this migration or drop and recreate:
   ```sql
   DROP TABLE IF EXISTS patients CASCADE;
   -- Then re-run migration
   ```

3. **"relation auth.users does not exist"**
   - Supabase Auth not properly initialized
   - Ensure project is fully provisioned
   - Wait a few minutes and try again

---

### Issue: RLS Policies Not Working

**Symptoms:**
- Can't access data when logged in
- Can access data when logged out

**Solutions:**

1. **Verify RLS is enabled:**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'patients';
   ```

2. **Check policies exist:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'patients';
   ```

3. **Re-run RLS migration:**
   - Open SQL Editor
   - Run `002_setup_rls_policies.sql` again

4. **Test authentication:**
   ```javascript
   const { data: { user } } = await supabase.auth.getUser();
   console.log('User:', user); // Should show user object when logged in
   ```

---

### Issue: Authentication Not Working

**Symptoms:**
- Can't sign up or log in
- "Invalid credentials" errors
- Email confirmation not received

**Solutions:**

1. **Check email confirmation settings:**
   - Authentication → Settings
   - Verify "Enable email confirmations" setting
   - For development, consider disabling

2. **Check Site URL:**
   - Authentication → Settings
   - Verify Site URL matches your app URL

3. **Check email spam folder:**
   - Confirmation emails might be in spam

4. **Verify credentials:**
   - Ensure password meets requirements (6+ characters)
   - Check for typos in email

5. **Check Supabase Auth logs:**
   - Authentication → Logs
   - Look for error messages

---

### Issue: Can't Create Patients

**Symptoms:**
- Form submission fails
- "RLS policy violation" errors
- Network errors

**Solutions:**

1. **Verify you're logged in:**
   ```javascript
   const { data: { user } } = await supabase.auth.getUser();
   console.log(user); // Should not be null
   ```

2. **Check RLS policies:**
   - Ensure INSERT policy exists
   - Verify policy allows authenticated users

3. **Check form validation:**
   - Ensure all required fields are filled
   - Check browser console for errors

4. **Check API route:**
   - Open browser DevTools → Network tab
   - Look for `/api/patients` request
   - Check response for error details

---

## Setup Checklist

Use this checklist to ensure everything is configured correctly:

### Account & Project Setup
- [ ] Supabase account created
- [ ] Organization created
- [ ] Project created and provisioned
- [ ] Database password saved securely
- [ ] Project URL copied
- [ ] Anon key copied
- [ ] Service role key copied

### Environment Configuration
- [ ] `.env.local` file created
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configured
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configured
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configured
- [ ] Development server restarted

### Database Setup
- [ ] `001_create_patients_table.sql` executed successfully
- [ ] Patients table visible in Table Editor
- [ ] All columns present with correct types
- [ ] Indexes created

### Security Setup
- [ ] `002_setup_rls_policies.sql` executed successfully
- [ ] RLS enabled on patients table
- [ ] SELECT policy exists
- [ ] INSERT policy exists

### Authentication Setup
- [ ] Email confirmation configured
- [ ] Site URL configured
- [ ] Redirect URLs configured
- [ ] Email provider enabled

### Verification
- [ ] Application starts without errors
- [ ] Can access landing page
- [ ] Can sign up new admin
- [ ] Can log in
- [ ] Can access dashboard
- [ ] Can create patient record
- [ ] Patient appears in Supabase Table Editor
- [ ] Logout works correctly

---

## Next Steps

After completing this setup:

1. **Explore Supabase Dashboard**
   - Familiarize yourself with Table Editor
   - Check Authentication logs
   - Review API documentation

2. **Read Additional Documentation**
   - [Database Migration Guide](./DATABASE_MIGRATION_GUIDE.md)
   - [RLS Setup Guide](./RLS_SETUP_GUIDE.md)
   - [Environment Variables](./ENVIRONMENT_VARIABLES.md)
   - [Auth Troubleshooting](./AUTH_TROUBLESHOOTING.md)

3. **Start Development**
   - Begin building features
   - Test thoroughly
   - Monitor Supabase logs

4. **Plan for Production**
   - Create separate production Supabase project
   - Configure production environment variables
   - Set up monitoring and backups

---

## Additional Resources

### Supabase Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database](https://supabase.com/docs/guides/database)

### LIMS Documentation
- [README](../README.md)
- [Supabase Setup Guide](./SUPABASE_SETUP_GUIDE.md)
- [Database Migration Guide](./DATABASE_MIGRATION_GUIDE.md)
- [RLS Setup Guide](./RLS_SETUP_GUIDE.md)

### Community & Support
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)
- [Supabase Twitter](https://twitter.com/supabase)

---

**Document Version:** 1.0  
**Last Updated:** Task 11.3 - Document Supabase setup steps  
**Estimated Setup Time:** 20-30 minutes  
**Difficulty:** Beginner-friendly

