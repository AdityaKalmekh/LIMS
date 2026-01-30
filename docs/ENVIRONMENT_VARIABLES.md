# Environment Variables Documentation

## Overview

This document provides comprehensive information about all environment variables used in the LIMS application. Environment variables are used to configure the application without hardcoding sensitive information in the source code.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Required Variables](#required-variables)
3. [Optional Variables](#optional-variables)
4. [Security Best Practices](#security-best-practices)
5. [Environment-Specific Configuration](#environment-specific-configuration)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Setup Steps

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your Supabase credentials:**
   - Get values from [Supabase Dashboard](https://supabase.com/dashboard)
   - Navigate to: Your Project → Settings → API

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

### File Locations

- **Development**: `.env.local` (in `lims-app/` directory)
- **Production**: Configure in your hosting platform (e.g., Vercel)
- **Template**: `.env.example` (committed to git)

---

## Required Variables

These variables MUST be configured for the application to work.

### NEXT_PUBLIC_SUPABASE_URL

**Description:** The URL of your Supabase project.

**Format:** `https://[project-ref].supabase.co`

**Example:** `https://abcdefghijklmnop.supabase.co`

**Where to Find:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** (gear icon) → **API**
4. Copy the **Project URL**

**Usage:**
- Used by both client and server to connect to Supabase
- Safe to expose in browser (hence `NEXT_PUBLIC_` prefix)
- Required for all Supabase operations

**Security:** ✅ Safe to expose publicly

---

### NEXT_PUBLIC_SUPABASE_ANON_KEY

**Description:** The anonymous (public) API key for Supabase.

**Format:** Long JWT token (200+ characters) starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Example:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzg4MzIwMCwiZXhwIjoxOTM5NDU5MjAwfQ.example_signature_here
```

**Where to Find:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** → **API**
4. Find **Project API keys** section
5. Copy the **anon** **public** key

**Usage:**
- Used for client-side Supabase operations
- Respects Row Level Security (RLS) policies
- Cannot bypass authentication requirements
- Used in browser and mobile apps

**Security Features:**
- ✅ Safe to expose in client-side code
- ✅ Respects RLS policies
- ✅ Cannot access data without proper permissions
- ✅ Automatically included in Supabase client requests

**Security:** ✅ Safe to expose publicly (with RLS enabled)

---

### SUPABASE_SERVICE_ROLE_KEY

**Description:** The service role key with full admin access to Supabase.

**Format:** Long JWT token (200+ characters) starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Example:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjIzODgzMjAwLCJleHAiOjE5Mzk0NTkyMDB9.example_signature_here
```

**Where to Find:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** → **API**
4. Find **Project API keys** section
5. Click **Reveal** next to **service_role** **secret**
6. Copy the revealed key

**Usage:**
- ✅ Server-side API routes (`app/api/*`)
- ✅ Server components and server actions
- ✅ Database migrations and admin scripts
- ❌ NEVER in client components
- ❌ NEVER in browser JavaScript
- ❌ NEVER in mobile apps

**Capabilities:**
- Full database access (bypasses RLS)
- Can create/modify/delete any data
- Can manage users and authentication
- Can modify database schema

**Security:** ⚠️ **HIGHLY SENSITIVE** - Never expose publicly!

**Critical Security Rules:**
1. **NEVER** commit this key to version control
2. **NEVER** expose in client-side code
3. **NEVER** share publicly or in screenshots
4. **ONLY** use in server-side code
5. **ROTATE** immediately if compromised

---

## Optional Variables

These variables have sensible defaults but can be customized.

### NEXT_PUBLIC_APP_URL

**Description:** The base URL of your application.

**Format:** `https://your-domain.com` or `http://localhost:3000`

**Default:** `http://localhost:3000` (development)

**Usage:**
- Generating absolute URLs
- Email templates with links
- OAuth redirect URLs
- API callbacks

**Example:**
```env
# Development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production
NEXT_PUBLIC_APP_URL=https://lims-app.vercel.app
```

---

### NODE_ENV

**Description:** The Node.js environment mode.

**Values:** `development`, `production`, `test`

**Default:** Set automatically by Next.js

**Usage:**
- Determines build optimizations
- Enables/disables debug features
- Controls logging verbosity

**Note:** Usually set automatically - no need to configure manually.

---

### PORT

**Description:** The port for the development server.

**Format:** Number (e.g., `3000`, `8080`)

**Default:** `3000`

**Usage:**
```bash
PORT=8080 npm run dev
```

**Example:**
```env
PORT=3001
```

---

## Security Best Practices

### DO ✅

1. **Use `.env.local` for local development**
   - This file is in `.gitignore`
   - Never committed to version control

2. **Use environment variables in hosting platforms**
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Build & Deploy → Environment
   - Railway: Project → Variables

3. **Rotate keys if compromised**
   - Generate new keys in Supabase dashboard
   - Update all environments immediately

4. **Use different projects for different environments**
   - Development: Separate Supabase project
   - Staging: Separate Supabase project
   - Production: Separate Supabase project

5. **Limit access to production credentials**
   - Only share with team members who need them
   - Use secure channels (password managers, encrypted messages)

### DON'T ❌

1. **Never commit `.env.local` to git**
   - Already in `.gitignore`
   - Contains sensitive credentials

2. **Never expose service role key in client code**
   - Only use in server-side code
   - Check with `NEXT_PUBLIC_` prefix (service role should NOT have this)

3. **Never share credentials in:**
   - Public repositories
   - Screenshots
   - Chat messages
   - Email
   - Documentation

4. **Never hardcode credentials**
   - Always use environment variables
   - Never put credentials directly in code

5. **Never use production credentials in development**
   - Use separate Supabase projects
   - Prevents accidental data corruption

---

## Environment-Specific Configuration

### Development (.env.local)

```env
# Development Supabase project
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...dev-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...dev-service-key

# Development URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production (Vercel/Hosting Platform)

```env
# Production Supabase project
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...prod-service-key

# Production URL
NEXT_PUBLIC_APP_URL=https://lims-app.vercel.app
```

### Testing (.env.test)

```env
# Test Supabase project
NEXT_PUBLIC_SUPABASE_URL=https://test-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...test-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...test-service-key
```

---

## Troubleshooting

### Issue: Environment Variables Not Loading

**Symptoms:**
- "Missing environment variables" errors
- Application can't connect to Supabase
- Undefined values when accessing `process.env`

**Solutions:**

1. **Check file name and location**
   ```bash
   # File should be named exactly .env.local
   ls -la lims-app/.env.local
   ```

2. **Restart development server**
   ```bash
   # Stop server (Ctrl+C)
   # Start again
   npm run dev
   ```

3. **Verify variable names**
   - Must match exactly (case-sensitive)
   - Check for typos
   - Ensure `NEXT_PUBLIC_` prefix for client-side variables

4. **Check for syntax errors**
   ```env
   # ✅ Correct
   NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
   
   # ❌ Wrong (spaces around =)
   NEXT_PUBLIC_SUPABASE_URL = https://example.supabase.co
   
   # ❌ Wrong (quotes not needed)
   NEXT_PUBLIC_SUPABASE_URL="https://example.supabase.co"
   ```

---

### Issue: "Invalid API Key" Error

**Symptoms:**
- Authentication fails
- Database queries return errors
- "Invalid API key" or "Invalid JWT" messages

**Solutions:**

1. **Verify you copied the complete key**
   - Keys are 200+ characters long
   - Easy to accidentally truncate

2. **Check for extra spaces or line breaks**
   ```env
   # ❌ Wrong (line break in middle)
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
   eyJpc3MiOiJzdXBhYmFzZSI...
   
   # ✅ Correct (single line)
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...
   ```

3. **Ensure you're using the correct key**
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role secret key
   - Don't mix them up!

4. **Re-copy from Supabase dashboard**
   - Keys might have been regenerated
   - Get fresh copies from dashboard

---

### Issue: Service Role Key Exposed in Client

**Symptoms:**
- Security warnings in console
- Service role key visible in browser DevTools
- Network requests include service role key

**Solutions:**

1. **Check variable name**
   ```env
   # ❌ Wrong (NEXT_PUBLIC_ exposes to client)
   NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=...
   
   # ✅ Correct (no NEXT_PUBLIC_ prefix)
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

2. **Verify usage in code**
   ```typescript
   // ❌ Wrong (client component)
   'use client';
   const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
   
   // ✅ Correct (server component or API route)
   // In app/api/route.ts or server component
   const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
   ```

3. **Rotate the key immediately**
   - If exposed, generate new key in Supabase dashboard
   - Update all environments

---

### Issue: Different Values in Development vs Production

**Symptoms:**
- Works locally but fails in production
- Different data in different environments

**Solutions:**

1. **Use separate Supabase projects**
   - Development project for local work
   - Production project for live app

2. **Verify production environment variables**
   - Check hosting platform settings
   - Ensure all variables are set
   - Verify values match production Supabase project

3. **Test with production values locally**
   ```bash
   # Temporarily use production values
   # (Be careful not to modify production data!)
   ```

---

## Verification Checklist

Use this checklist to verify your environment variables are configured correctly:

### Local Development

- [ ] `.env.local` file exists in `lims-app/` directory
- [ ] File is named exactly `.env.local` (with leading dot)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set and starts with `https://`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set (200+ characters)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set (200+ characters)
- [ ] No spaces around `=` signs
- [ ] No quotes around values
- [ ] No line breaks in the middle of keys
- [ ] Development server restarted after changes
- [ ] Application connects to Supabase successfully
- [ ] Can sign up and log in
- [ ] Can create patient records

### Production Deployment

- [ ] Environment variables configured in hosting platform
- [ ] Using production Supabase project (not development)
- [ ] All three required variables are set
- [ ] Values match production Supabase dashboard
- [ ] Application builds successfully
- [ ] Application connects to Supabase in production
- [ ] Authentication works in production
- [ ] Database operations work in production

---

## Additional Resources

- [Supabase Setup Guide](./SUPABASE_SETUP_GUIDE.md)
- [Next.js Environment Variables Documentation](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase API Documentation](https://supabase.com/docs/guides/api)
- [Auth Troubleshooting](./AUTH_TROUBLESHOOTING.md)

---

**Last Updated:** Task 11.2 - Document environment variables  
**Related Tasks:** Task 2.1 (Supabase Setup), Task 1.6 (Configure environment variables)
