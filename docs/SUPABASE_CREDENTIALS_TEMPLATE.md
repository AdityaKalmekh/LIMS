# Supabase Credentials Template

Use this template to organize your Supabase credentials as you obtain them.

---

## 📋 Project Information

**Project Name**: `lims-admin-app`

**Organization Name**: _________________________________

**Region Selected**: _________________________________

**Date Created**: _________________________________

---

## 🔑 Database Credentials

### Database Password
**⚠️ IMPORTANT**: Save this immediately - you cannot retrieve it later!

```
Database Password: _________________________________
```

**Stored in Password Manager**: ☐ Yes  ☐ No

---

## 🌐 API Credentials

### 1. Project URL
**Location**: Settings → API → Project URL

```
NEXT_PUBLIC_SUPABASE_URL=_________________________________
```

**Format Check**: ☐ Starts with `https://`  
**Format Check**: ☐ Ends with `.supabase.co`

---

### 2. Anonymous (anon) Public Key
**Location**: Settings → API → Project API keys → anon public

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=_________________________________
_________________________________________________________________
_________________________________________________________________
```

**Format Check**: ☐ Starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`  
**Security**: ✅ Safe for client-side code

---

### 3. Service Role Key
**Location**: Settings → API → Project API keys → service_role (click "Reveal")

```
SUPABASE_SERVICE_ROLE_KEY=_________________________________
_________________________________________________________________
_________________________________________________________________
```

**Format Check**: ☐ Starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`  
**Format Check**: ☐ Different from anon key  
**Security**: ⚠️ **KEEP SECRET** - Server-side only!

---

## ✅ Verification Checklist

### Credentials Obtained
- [ ] Project URL copied
- [ ] Anon public key copied
- [ ] Service role key copied (revealed and copied)
- [ ] Database password saved securely

### Environment File Updated
- [ ] Opened `lims-app/.env.local` file
- [ ] Pasted Project URL
- [ ] Pasted Anon key
- [ ] Pasted Service role key
- [ ] Saved the file
- [ ] Verified file name is exactly `.env.local`

### Security Checks
- [ ] `.env.local` is in `.gitignore`
- [ ] Database password stored in password manager
- [ ] Service role key not exposed in client code
- [ ] No credentials committed to version control

### Testing
- [ ] Restarted development server
- [ ] Can access Supabase dashboard
- [ ] No environment variable errors in console

---

## 📝 Notes

Use this space for any additional notes or observations:

```
_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________
```

---

## 🔗 Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Your Project**: https://supabase.com/dashboard/project/[your-project-ref]
- **API Settings**: https://supabase.com/dashboard/project/[your-project-ref]/settings/api

---

## 🆘 Need Help?

If you encounter issues:
1. Check [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) for detailed troubleshooting
2. Verify all credentials are copied completely (no truncation)
3. Ensure no extra spaces or line breaks in `.env.local`
4. Restart your development server after updating environment variables

---

**Template Version**: 1.0  
**Task**: 2.1 Create Supabase Project  
**Spec**: LIMS Admin & Patient Registration
