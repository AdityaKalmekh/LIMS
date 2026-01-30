# Supabase Auth Configuration - Quick Reference

## 🚀 Quick Setup Checklist

Use this as a quick reference while configuring Supabase Auth settings.

---

## ✅ Configuration Checklist

### Step 1: Email Provider
- [ ] Navigate to: **Authentication → Providers → Email**
- [ ] Enable Email provider: **ON**
- [ ] Email confirmations: **OFF** (dev) / **ON** (prod)
- [ ] Secure email change: **OFF** (dev) / **ON** (prod)
- [ ] Click **Save**

### Step 2: URL Configuration
- [ ] Navigate to: **Authentication → URL Configuration**
- [ ] Set Site URL: `http://localhost:3000`
- [ ] Add redirect URLs (see list below)
- [ ] Click **Save**

### Step 3: Email Templates (Optional)
- [ ] Navigate to: **Authentication → Email Templates**
- [ ] Review default templates
- [ ] Customize if needed (optional)
- [ ] Click **Save** if modified

### Step 4: Additional Settings (Optional)
- [ ] Navigate to: **Authentication → Settings**
- [ ] Review JWT expiry (default: 3600)
- [ ] Review password requirements (min: 8 chars)
- [ ] Click **Save** if modified

### Step 5: Verification
- [ ] Check Authentication → Users (should be empty)
- [ ] Optionally create test user
- [ ] Verify no error messages

---

## 📋 Required Redirect URLs

Copy and paste these URLs into the Redirect URLs field:

### Development URLs
```
http://localhost:3000
http://localhost:3000/auth/callback
http://localhost:3000/dashboard
http://localhost:3000/login
http://localhost:3000/signup
```

### Production URLs (when deploying)
```
https://lims.yourdomain.com
https://lims.yourdomain.com/auth/callback
https://lims.yourdomain.com/dashboard
https://lims.yourdomain.com/login
https://lims.yourdomain.com/signup
```

---

## ⚙️ Recommended Settings

### Development Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| Email Provider | ON | Required for auth |
| Email Confirmations | OFF | Easier testing |
| Secure Email Change | OFF | Easier testing |
| Site URL | `http://localhost:3000` | Local dev server |
| JWT Expiry | 3600 (1 hour) | Default is fine |
| Min Password Length | 8 characters | Easy for testing |
| Password Complexity | OFF | Easy for testing |

### Production Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| Email Provider | ON | Required for auth |
| Email Confirmations | ON | Security |
| Secure Email Change | ON | Security |
| Site URL | `https://lims.yourdomain.com` | Production domain |
| JWT Expiry | 3600 (1 hour) | Security |
| Min Password Length | 12 characters | Security |
| Password Complexity | ON | Security |

---

## 🔍 Quick Navigation Paths

### To Configure Email Provider
```
Dashboard → Authentication → Providers → Email
```

### To Configure URLs
```
Dashboard → Authentication → URL Configuration
```

### To Edit Email Templates
```
Dashboard → Authentication → Email Templates → [Select Template]
```

### To Adjust Settings
```
Dashboard → Authentication → Settings
```

### To View Users
```
Dashboard → Authentication → Users
```

---

## 🎯 Common Values Reference

### JWT Expiry Times

| Seconds | Duration | Use Case |
|---------|----------|----------|
| 3600 | 1 hour | Production (recommended) |
| 7200 | 2 hours | Moderate security |
| 86400 | 24 hours | Development convenience |
| 604800 | 7 days | Not recommended |

### Password Length Guidelines

| Length | Security Level | Use Case |
|--------|----------------|----------|
| 6 chars | Weak | Not recommended |
| 8 chars | Moderate | Development only |
| 12 chars | Strong | Production minimum |
| 16+ chars | Very Strong | High security apps |

---

## 🔐 Security Quick Tips

### Development
- ✅ Disable email confirmations for faster testing
- ✅ Use simple passwords for test accounts
- ✅ Keep service role key secret
- ✅ Use `http://localhost:3000` for local dev

### Production
- ✅ Enable email confirmations
- ✅ Enforce strong passwords (12+ chars)
- ✅ Enable secure email change
- ✅ Use HTTPS only
- ✅ Rotate API keys regularly
- ✅ Monitor auth logs

---

## 🐛 Quick Troubleshooting

### Issue: Can't find Authentication tab
**Solution:** Look for 🔐 icon in left sidebar

### Issue: Save button not working
**Solution:** Check for red error messages, verify all required fields

### Issue: Invalid redirect URL error
**Solution:** Ensure URL starts with `http://` or `https://`

### Issue: Users can't log in after signup
**Solution:** Check if email confirmations are enabled; disable for dev

### Issue: CORS errors in browser
**Solution:** Verify Site URL matches your actual app URL

---

## 📊 Configuration Status Check

Use this to verify your configuration is complete:

```
✅ Email provider enabled
✅ Site URL set to http://localhost:3000
✅ 5 redirect URLs added
✅ Email templates reviewed
✅ JWT expiry configured (3600 default)
✅ Password requirements set (8 chars minimum)
✅ No error messages in dashboard
```

---

## 🧪 Quick Test Commands

### Create Test User via Dashboard
1. Go to: **Authentication → Users**
2. Click: **Add user**
3. Email: `admin@test.com`
4. Password: `TestPassword123`
5. Click: **Create user**

### Test Auth API (curl)
```bash
curl -X POST 'https://[PROJECT-REF].supabase.co/auth/v1/signup' \
  -H "apikey: [ANON-KEY]" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

Replace:
- `[PROJECT-REF]` - Your project reference
- `[ANON-KEY]` - Your anon key from `.env.local`

---

## 📝 Environment Variables Reference

After configuration, your `.env.local` should have:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Security Notes:**
- ✅ `.env.local` is in `.gitignore`
- ✅ Never commit service role key
- ✅ Anon key is safe for client-side
- ✅ Service role key is for server-side only

---

## 🔄 Configuration Flow

```
1. Enable Email Provider
   ↓
2. Configure Site URL
   ↓
3. Add Redirect URLs
   ↓
4. Review Email Templates (optional)
   ↓
5. Adjust Settings (optional)
   ↓
6. Verify Configuration
   ↓
7. Test with User Creation (optional)
   ↓
8. Ready for Implementation ✅
```

---

## 📚 Related Documentation

- **Full Instructions:** `TASK_2.4_INSTRUCTIONS.md`
- **Visual Guide:** `TASK_2.4_VISUAL_GUIDE.md`
- **Supabase Setup:** `SUPABASE_SETUP_GUIDE.md`
- **RLS Setup:** `RLS_SETUP_GUIDE.md`

---

## 🎯 Next Task

After completing this configuration:

**Task 2.5:** Create Supabase client utilities
- Create `lib/supabase/client.ts`
- Create `lib/supabase/server.ts`
- Set up auth helpers

---

## 💡 Pro Tips

1. **Screenshot your settings** for reference
2. **Test immediately** after configuration
3. **Keep default templates** for development
4. **Document custom changes** for production
5. **Verify redirect URLs** have no typos
6. **Use consistent URL format** (http vs https)

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Enable email provider | 2 minutes |
| Configure URLs | 3 minutes |
| Review email templates | 5 minutes |
| Adjust settings | 3 minutes |
| Verification | 2 minutes |
| **Total** | **15 minutes** |

---

## 🆘 Need Help?

### Quick Links
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Email Auth Guide](https://supabase.com/docs/guides/auth/auth-email)
- [Next.js Integration](https://supabase.com/docs/guides/auth/server-side/nextjs)

### Support Channels
- 📚 Documentation: `docs/TASK_2.4_INSTRUCTIONS.md`
- 💬 Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- 🐛 GitHub Issues: [github.com/supabase/supabase](https://github.com/supabase/supabase/issues)

---

**Quick Reference Version**: 1.0  
**Last Updated**: 2024  
**Task**: 2.4 Configure Supabase Auth settings
