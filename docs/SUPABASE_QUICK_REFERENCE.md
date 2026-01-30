# Supabase Setup - Quick Reference Card

## 🚀 Quick Start Checklist

### 1. Create Account
- [ ] Go to [https://supabase.com](https://supabase.com)
- [ ] Sign up with GitHub or Email
- [ ] Verify your email (if using email signup)

### 2. Create Project
- [ ] Click "New Project"
- [ ] Create/Select Organization
- [ ] Enter project name: `lims-admin-app`
- [ ] Generate and **save database password** 🔐
- [ ] Select region (closest to your users)
- [ ] Choose "Free" plan for development
- [ ] Click "Create new project"
- [ ] Wait 1-2 minutes for provisioning

### 3. Get Credentials
- [ ] Go to Settings ⚙️ → API
- [ ] Copy **Project URL**
- [ ] Copy **anon public** key
- [ ] Reveal and copy **service_role secret** key

### 4. Update .env.local
```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Verify
- [ ] Restart dev server: `npm run dev`
- [ ] Check Supabase dashboard is accessible
- [ ] Confirm `.env.local` is in `.gitignore`

---

## 📍 Where to Find Credentials

| Credential | Location in Dashboard |
|------------|----------------------|
| **Project URL** | Settings → API → Project URL |
| **Anon Key** | Settings → API → Project API keys → anon public |
| **Service Role Key** | Settings → API → Project API keys → service_role (click "Reveal") |

---

## ⚠️ Security Reminders

- 🔐 **NEVER** commit `.env.local` to git
- 🔐 **NEVER** expose service role key in client code
- 🔐 **SAVE** your database password securely
- 🔐 **USE** service role key only in server-side code

---

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| Can't find API settings | Settings ⚙️ → API |
| Service role key hidden | Click "Reveal" button |
| Env vars not loading | Restart dev server |
| Invalid API key error | Re-copy entire key (no spaces) |

---

## 📚 Full Documentation

For detailed step-by-step instructions with screenshots and troubleshooting, see:
**[SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md)**

---

## ✅ Task Completion

Once you've completed all steps above, you're ready for:
- **Task 2.2**: Create patients table with schema
- **Task 2.3**: Setup Row Level Security (RLS) policies
- **Task 2.4**: Configure Supabase Auth settings

---

**Quick Reference Version**: 1.0  
**Task**: 2.1 Create Supabase Project
