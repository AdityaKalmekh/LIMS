# Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the LIMS Admin & Patient Registration application to production. While the guide focuses on Vercel (recommended), it also covers other deployment options.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Deploy to Vercel (Recommended)](#deploy-to-vercel-recommended)
3. [Deploy to Other Platforms](#deploy-to-other-platforms)
4. [Post-Deployment Verification](#post-deployment-verification)
5. [Production Configuration](#production-configuration)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying, ensure you have completed all setup steps:

### Code & Dependencies
- [ ] All code is committed to Git
- [ ] `package.json` dependencies are up to date
- [ ] No uncommitted changes or work-in-progress code
- [ ] `.env.local` is in `.gitignore` (never commit secrets!)

### Build Verification
- [ ] Application builds successfully locally
  ```bash
  npm run build
  ```
- [ ] No TypeScript errors
  ```bash
  npx tsc --noEmit
  ```
- [ ] Linting passes
  ```bash
  npm run lint
  ```
- [ ] Application runs in production mode locally
  ```bash
  npm run build && npm run start
  ```

### Supabase Configuration
- [ ] Production Supabase project created (separate from development)
- [ ] Database migrations run on production database
- [ ] RLS policies enabled and tested
- [ ] Authentication configured correctly
- [ ] Email confirmation settings configured
- [ ] Site URL updated to production domain

### Environment Variables
- [ ] Production Supabase credentials ready
- [ ] All required environment variables documented
- [ ] Service role key kept secure

### Testing
- [ ] Authentication flow tested locally
- [ ] Patient registration tested locally
- [ ] All features working as expected
- [ ] Mobile responsiveness verified

---

## Deploy to Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications. It's created by the Next.js team and provides excellent performance and developer experience.

### Why Vercel?

- ✅ Optimized for Next.js
- ✅ Automatic deployments from Git
- ✅ Built-in CI/CD
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Preview deployments for PRs
- ✅ Generous free tier

### Step 1: Prepare Your Repository

1. **Push Code to GitHub**

   If you haven't already:
   ```bash
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - ready for deployment"
   
   # Add remote (replace with your repo URL)
   git remote add origin https://github.com/your-username/lims-app.git
   
   # Push to GitHub
   git push -u origin main
   ```

2. **Verify Repository**
   - Go to your GitHub repository
   - Ensure all files are present
   - Verify `.env.local` is NOT in the repository

### Step 2: Create Vercel Account

1. **Sign Up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click **"Sign Up"**
   - Choose **"Continue with GitHub"** (recommended)
   - Authorize Vercel to access your GitHub account

2. **Complete Profile**
   - Fill in any required information
   - Accept terms of service

### Step 3: Import Project

1. **Create New Project**
   - In Vercel dashboard, click **"Add New..."**
   - Select **"Project"**

2. **Import Git Repository**
   - Click **"Import Git Repository"**
   - Find your `lims-app` repository
   - Click **"Import"**

3. **Configure Project**

   **Project Name:**
   ```
   lims-app
   ```
   (or your preferred name)

   **Framework Preset:**
   - Should auto-detect: **Next.js**
   - If not, select it manually

   **Root Directory:**
   - Set to: `lims-app`
   - This is important if your Next.js app is in a subdirectory

   **Build Settings:**
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

### Step 4: Configure Environment Variables

This is the most critical step!

1. **Open Environment Variables Section**
   - In the import screen, expand **"Environment Variables"**

2. **Add Required Variables**

   Add each of these variables:

   **Variable 1: NEXT_PUBLIC_SUPABASE_URL**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your production Supabase URL
   - Example: `https://prod-project.supabase.co`
   - Environment: Select all (Production, Preview, Development)

   **Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Your production Supabase anon key
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Environment: Select all (Production, Preview, Development)

   **Variable 3: SUPABASE_SERVICE_ROLE_KEY**
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Your production Supabase service role key
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Environment: Select all (Production, Preview, Development)
   - ⚠️ **Keep this secret!**

3. **Verify Variables**
   - Double-check all variable names (case-sensitive)
   - Ensure values are complete (keys are 200+ characters)
   - Verify no extra spaces or line breaks

### Step 5: Deploy

1. **Click "Deploy"**
   - Vercel will start building your application
   - You'll see a build log in real-time

2. **Wait for Build**
   - Build typically takes 1-3 minutes
   - Watch for any errors in the build log

3. **Deployment Complete!**
   - You'll see a success screen with confetti 🎉
   - You'll get a production URL: `https://lims-app.vercel.app`
   - You'll also get preview URLs for testing

### Step 6: Configure Custom Domain (Optional)

1. **Add Custom Domain**
   - In Vercel project settings
   - Go to **"Domains"**
   - Click **"Add"**
   - Enter your domain: `lims.yourdomain.com`

2. **Configure DNS**
   - Follow Vercel's instructions to configure DNS
   - Add CNAME or A record to your DNS provider
   - Wait for DNS propagation (can take up to 48 hours)

3. **Verify Domain**
   - Vercel will automatically provision SSL certificate
   - Your app will be available at your custom domain

### Step 7: Update Supabase Site URL

Important: Update your Supabase project to allow your production domain.

1. **Go to Supabase Dashboard**
   - Select your production project
   - Click **Authentication** → **Settings**

2. **Update Site URL**
   - Change from `http://localhost:3000`
   - To your production URL: `https://lims-app.vercel.app`
   - Or your custom domain: `https://lims.yourdomain.com`

3. **Update Redirect URLs**
   - Add your production domain to allowed redirect URLs:
   - `https://lims-app.vercel.app/**`
   - `https://lims.yourdomain.com/**` (if using custom domain)

4. **Save Changes**

---

## Deploy to Other Platforms

### Netlify

1. **Sign Up**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Import Project**
   - Click **"Add new site"** → **"Import an existing project"**
   - Select your GitHub repository

3. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Base directory: `lims-app`

4. **Add Environment Variables**
   - Go to **Site settings** → **Environment variables**
   - Add the same three variables as Vercel

5. **Deploy**
   - Click **"Deploy site"**
   - Wait for build to complete

### Railway

1. **Sign Up**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your repository

3. **Configure**
   - Railway auto-detects Next.js
   - Add environment variables in **Variables** tab

4. **Deploy**
   - Railway automatically deploys
   - You get a railway.app subdomain

### Self-Hosted (VPS/Cloud Server)

1. **Server Requirements**
   - Node.js 18+
   - npm or yarn
   - Process manager (PM2 recommended)

2. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/lims-app.git
   cd lims-app
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Configure Environment**
   ```bash
   # Create .env.local with production values
   nano .env.local
   ```

5. **Build Application**
   ```bash
   npm run build
   ```

6. **Start with PM2**
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start application
   pm2 start npm --name "lims-app" -- start
   
   # Save PM2 configuration
   pm2 save
   
   # Setup PM2 to start on boot
   pm2 startup
   ```

7. **Configure Reverse Proxy**
   - Use Nginx or Apache
   - Proxy requests to `localhost:3000`
   - Configure SSL with Let's Encrypt

---

## Post-Deployment Verification

After deployment, thoroughly test your application:

### Step 1: Access Application

1. **Visit Production URL**
   - Go to your Vercel URL or custom domain
   - Verify the landing page loads

2. **Check for Errors**
   - Open browser DevTools (F12)
   - Check Console for errors
   - Check Network tab for failed requests

### Step 2: Test Authentication

1. **Test Signup**
   - Navigate to `/signup`
   - Create a new admin account
   - Use a real email address
   - Check for confirmation email (if enabled)
   - Verify you can confirm email and log in

2. **Test Login**
   - Navigate to `/login`
   - Log in with your credentials
   - Verify redirect to dashboard
   - Check that session persists on page refresh

3. **Test Logout**
   - Click logout button
   - Verify redirect to login page
   - Verify you can't access dashboard when logged out

### Step 3: Test Patient Registration

1. **Access Dashboard**
   - Log in and navigate to dashboard
   - Verify patient list loads (empty initially)

2. **Create Test Patient**
   - Click **"New"** button
   - Fill in all required fields
   - Submit form
   - Verify success message
   - Verify patient appears in list

3. **Verify in Database**
   - Go to Supabase Dashboard
   - Check **Table Editor** → **patients**
   - Verify patient record exists

### Step 4: Test Mobile Responsiveness

1. **Test on Mobile Device**
   - Open on your phone
   - Test all features
   - Verify layout adapts correctly

2. **Test with DevTools**
   - Open DevTools (F12)
   - Toggle device toolbar
   - Test various screen sizes
   - Verify no horizontal scrolling

### Step 5: Performance Check

1. **Run Lighthouse Audit**
   - Open DevTools → Lighthouse tab
   - Run audit for Performance, Accessibility, Best Practices, SEO
   - Aim for scores above 90

2. **Check Load Times**
   - Verify pages load quickly
   - Check Time to First Byte (TTFB)
   - Monitor Core Web Vitals

---

## Production Configuration

### Security Checklist

- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables secured
- [ ] Service role key never exposed to client
- [ ] RLS policies enabled on all tables
- [ ] CORS configured correctly
- [ ] Rate limiting considered (future enhancement)

### Performance Optimization

1. **Enable Caching**
   - Vercel automatically caches static assets
   - Configure cache headers if needed

2. **Image Optimization**
   - Use Next.js Image component
   - Optimize images before upload

3. **Database Optimization**
   - Ensure indexes are created
   - Monitor query performance in Supabase

### Monitoring Setup

1. **Vercel Analytics**
   - Enable in Vercel dashboard
   - Monitor page views, performance

2. **Supabase Monitoring**
   - Check database usage
   - Monitor API requests
   - Review authentication logs

3. **Error Tracking** (Optional)
   - Consider Sentry or similar
   - Track and fix production errors

---

## Monitoring & Maintenance

### Daily Checks

- [ ] Application is accessible
- [ ] No errors in Vercel logs
- [ ] Supabase project is active

### Weekly Checks

- [ ] Review Vercel analytics
- [ ] Check Supabase usage metrics
- [ ] Review authentication logs
- [ ] Check for security updates

### Monthly Checks

- [ ] Update dependencies
  ```bash
  npm outdated
  npm update
  ```
- [ ] Review and optimize database
- [ ] Check backup status (Supabase Pro)
- [ ] Review and rotate API keys if needed

### Backup Strategy

1. **Database Backups**
   - Supabase Pro: Automatic daily backups
   - Free tier: Manual exports recommended
   - Export data regularly:
     ```sql
     -- In Supabase SQL Editor
     COPY patients TO '/tmp/patients_backup.csv' CSV HEADER;
     ```

2. **Code Backups**
   - Git repository is your backup
   - Ensure all changes are committed
   - Consider multiple remotes

---

## Troubleshooting

### Issue: Build Fails on Vercel

**Symptoms:**
- Deployment fails during build
- TypeScript errors
- Missing dependencies

**Solutions:**

1. **Check Build Logs**
   - Read error messages carefully
   - Look for specific file/line numbers

2. **Test Build Locally**
   ```bash
   npm run build
   ```
   - Fix any errors locally first
   - Commit and push fixes

3. **Verify Dependencies**
   ```bash
   npm install
   ```
   - Ensure `package-lock.json` is committed

4. **Check Node Version**
   - Vercel uses Node 18 by default
   - Specify version in `package.json`:
   ```json
   "engines": {
     "node": "18.x"
   }
   ```

---

### Issue: Environment Variables Not Working

**Symptoms:**
- "Missing environment variables" errors
- Can't connect to Supabase
- Features not working in production

**Solutions:**

1. **Verify Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Check all three variables are present
   - Verify values are correct (no typos)

2. **Check Variable Names**
   - Must match exactly (case-sensitive)
   - `NEXT_PUBLIC_SUPABASE_URL` (not `SUPABASE_URL`)

3. **Redeploy**
   - After adding/changing variables
   - Go to Deployments tab
   - Click "..." → "Redeploy"

4. **Check Environments**
   - Ensure variables are set for Production
   - Also set for Preview if testing PRs

---

### Issue: Authentication Not Working in Production

**Symptoms:**
- Can't sign up or log in
- "Invalid credentials" errors
- Redirect loops

**Solutions:**

1. **Check Supabase Site URL**
   - Must match production domain
   - Update in Supabase Dashboard
   - Authentication → Settings → Site URL

2. **Check Redirect URLs**
   - Add production domain to allowed URLs
   - Format: `https://your-domain.com/**`

3. **Verify Environment Variables**
   - Ensure using production Supabase project
   - Not development project credentials

4. **Check CORS**
   - Supabase should allow your domain
   - Usually automatic, but verify if issues

---

### Issue: Database Connection Fails

**Symptoms:**
- Can't fetch or create patients
- "Failed to fetch" errors
- RLS policy violations

**Solutions:**

1. **Verify Supabase Project**
   - Ensure production project is active
   - Check project isn't paused

2. **Check RLS Policies**
   - Verify policies are enabled
   - Test with authenticated user

3. **Check API Routes**
   - Verify `/api/patients` is accessible
   - Check Vercel function logs

4. **Test Database Connection**
   - Use Supabase SQL Editor
   - Run test query:
   ```sql
   SELECT COUNT(*) FROM patients;
   ```

---

### Issue: Slow Performance

**Symptoms:**
- Pages load slowly
- Database queries timeout
- Poor Lighthouse scores

**Solutions:**

1. **Check Vercel Region**
   - Ensure deployed to region close to users
   - Configure in Project Settings

2. **Optimize Database**
   - Ensure indexes exist
   - Review slow queries in Supabase

3. **Enable Caching**
   - Use Next.js caching strategies
   - Configure cache headers

4. **Optimize Images**
   - Use Next.js Image component
   - Compress images

---

### Issue: Custom Domain Not Working

**Symptoms:**
- Domain doesn't resolve
- SSL certificate errors
- "This site can't be reached"

**Solutions:**

1. **Check DNS Configuration**
   - Verify CNAME or A record is correct
   - Wait for DNS propagation (up to 48 hours)
   - Use DNS checker: [dnschecker.org](https://dnschecker.org)

2. **Verify Domain in Vercel**
   - Should show "Valid Configuration"
   - SSL should be "Active"

3. **Check Domain Registrar**
   - Ensure domain is active
   - Verify DNS settings are saved

---

## Rollback Procedure

If you need to rollback to a previous version:

### In Vercel

1. **Go to Deployments Tab**
   - View all previous deployments

2. **Find Working Deployment**
   - Identify last known good deployment

3. **Promote to Production**
   - Click "..." on deployment
   - Select "Promote to Production"

4. **Verify**
   - Check production URL
   - Test critical features

### In Git

1. **Revert Commit**
   ```bash
   git revert <commit-hash>
   git push
   ```

2. **Vercel Auto-Deploys**
   - Automatically deploys reverted code

---

## Production Checklist

Before going live with real users:

### Technical
- [ ] All features tested in production
- [ ] Authentication working correctly
- [ ] Patient registration working
- [ ] Mobile responsiveness verified
- [ ] Performance optimized (Lighthouse > 90)
- [ ] Error tracking configured
- [ ] Monitoring set up

### Security
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] RLS policies enabled and tested
- [ ] Service role key never exposed
- [ ] Regular backups configured

### Documentation
- [ ] README updated with production URL
- [ ] Team trained on deployment process
- [ ] Incident response plan documented
- [ ] Backup/restore procedures documented

### Business
- [ ] Stakeholders notified of launch
- [ ] Support channels established
- [ ] User documentation prepared
- [ ] Training materials ready

---

## Additional Resources

### Vercel Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

### Supabase Documentation
- [Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [Performance Tuning](https://supabase.com/docs/guides/platform/performance)

### Next.js Documentation
- [Deployment](https://nextjs.org/docs/deployment)
- [Production Checklist](https://nextjs.org/docs/going-to-production)

---

**Document Version:** 1.0  
**Last Updated:** Task 11.4 - Create deployment guide  
**Estimated Deployment Time:** 30-45 minutes (first time)

