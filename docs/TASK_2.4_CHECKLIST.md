# Task 2.4: Supabase Auth Configuration Checklist

## 📋 Printable Checklist

Use this checklist while configuring Supabase Auth settings. Check off each item as you complete it.

---

## ✅ Pre-Configuration Checklist

Before you begin:

- [ ] Task 2.1 completed (Supabase project created)
- [ ] Task 2.2 completed (patients table created)
- [ ] Task 2.3 completed (RLS policies applied)
- [ ] Supabase dashboard is accessible
- [ ] You're logged into the correct Supabase project
- [ ] Documentation is open for reference

---

## 🔧 Configuration Steps

### Step 1: Enable Email Authentication Provider

- [ ] Navigate to Supabase Dashboard
- [ ] Click on **Authentication** in left sidebar
- [ ] Click on **Providers** tab
- [ ] Click on **Email** to expand settings
- [ ] Verify **"Enable Email provider"** is **ON**
- [ ] Set **"Enable email confirmations"** to **OFF** (for development)
- [ ] Set **"Enable secure email change"** to **OFF** (for development)
- [ ] Click **Save** button
- [ ] Wait for success message: "Settings saved successfully"

**Notes:**
```
Development: Email confirmations OFF (easier testing)
Production: Email confirmations ON (better security)
```

---

### Step 2: Configure Site URL

- [ ] Stay in **Authentication** section
- [ ] Click on **URL Configuration** tab
- [ ] Find **"Site URL"** field
- [ ] Enter: `http://localhost:3000`
- [ ] Verify no typos (common: missing http://, wrong port)
- [ ] Click **Save** button
- [ ] Wait for success message

**Site URL:**
```
Development: http://localhost:3000
Production: https://lims.yourdomain.com
```

---

### Step 3: Add Redirect URLs

- [ ] Stay in **URL Configuration** tab
- [ ] Find **"Redirect URLs"** section
- [ ] Add the following URLs (one per line):

**URL 1:**
- [ ] Enter: `http://localhost:3000`
- [ ] Press Enter or click outside field

**URL 2:**
- [ ] Click **"+ Add URL"** (if needed)
- [ ] Enter: `http://localhost:3000/auth/callback`
- [ ] Press Enter or click outside field

**URL 3:**
- [ ] Click **"+ Add URL"** (if needed)
- [ ] Enter: `http://localhost:3000/dashboard`
- [ ] Press Enter or click outside field

**URL 4:**
- [ ] Click **"+ Add URL"** (if needed)
- [ ] Enter: `http://localhost:3000/login`
- [ ] Press Enter or click outside field

**URL 5:**
- [ ] Click **"+ Add URL"** (if needed)
- [ ] Enter: `http://localhost:3000/signup`
- [ ] Press Enter or click outside field

**Verify All URLs:**
- [ ] All 5 URLs are listed
- [ ] No typos in any URL
- [ ] All URLs start with `http://`
- [ ] All URLs use port `3000`
- [ ] Click **Save** button
- [ ] Wait for success message

---

### Step 4: Review Email Templates (Optional)

- [ ] Click on **Email Templates** tab
- [ ] Review **"Confirm signup"** template
  - [ ] Click on template name
  - [ ] Review subject line
  - [ ] Review message content
  - [ ] Default template is fine for now
  - [ ] Click back or close

- [ ] Review **"Reset Password"** template
  - [ ] Click on template name
  - [ ] Review subject line
  - [ ] Review message content
  - [ ] Default template is fine for now
  - [ ] Click back or close

- [ ] Note: Customization is optional for development
- [ ] Note: Can customize later for production

---

### Step 5: Review Additional Settings (Optional)

- [ ] Click on **Settings** (or **Configuration**) tab
- [ ] Find **"JWT expiry (seconds)"**
  - [ ] Current value: _______ (note it down)
  - [ ] Default is 3600 (1 hour) - this is fine
  - [ ] Change only if needed

- [ ] Find **"Refresh token rotation"**
  - [ ] Verify it's **Enabled**
  - [ ] Keep enabled for security

- [ ] Find **"Password Requirements"**
  - [ ] Minimum length: _______ (note it down)
  - [ ] Default is 8 characters - this is fine
  - [ ] Complexity requirements: Check if enabled
  - [ ] For development: Keep complexity OFF
  - [ ] For production: Consider enabling complexity

- [ ] If you made any changes, click **Save**
- [ ] If no changes, no need to save

---

## ✅ Verification Checklist

After completing configuration:

### Visual Verification

- [ ] Go to **Authentication → Providers**
- [ ] Email provider shows **[Enabled]** badge
- [ ] No warning messages visible

- [ ] Go to **Authentication → URL Configuration**
- [ ] Site URL shows: `http://localhost:3000`
- [ ] Redirect URLs section shows 5 URLs
- [ ] No warning messages visible

- [ ] Go to **Authentication → Email Templates**
- [ ] All templates are listed
- [ ] No error messages visible

- [ ] Go to **Authentication → Users**
- [ ] Page loads successfully
- [ ] Shows empty state (no users yet - this is expected)
- [ ] "Add user" button is visible

### Functional Verification (Optional)

- [ ] Create a test user:
  - [ ] Go to **Authentication → Users**
  - [ ] Click **"Add user"** button
  - [ ] Enter email: `admin@test.com`
  - [ ] Enter password: `TestPassword123`
  - [ ] Click **"Create user"**
  - [ ] User appears in list
  - [ ] Status shows "Confirmed" (if confirmations are OFF)

- [ ] Verify test user:
  - [ ] User email is correct
  - [ ] Created timestamp is recent
  - [ ] No error indicators

---

## 📊 Configuration Summary

Fill in this summary for your records:

### Email Provider Settings
```
Email provider enabled:        [ ] Yes  [ ] No
Email confirmations:           [ ] ON   [ ] OFF
Secure email change:           [ ] ON   [ ] OFF
```

### URL Configuration
```
Site URL: _________________________________

Redirect URLs:
1. _________________________________
2. _________________________________
3. _________________________________
4. _________________________________
5. _________________________________
```

### Additional Settings
```
JWT expiry:              _______ seconds
Refresh token rotation:  [ ] Enabled  [ ] Disabled
Min password length:     _______ characters
Password complexity:     [ ] Enabled  [ ] Disabled
```

### Test User (if created)
```
Email:    _________________________________
Password: _________________________________ (store securely!)
Status:   [ ] Confirmed  [ ] Waiting for verification
```

---

## 🎯 Final Verification

Before marking this task complete:

- [ ] All configuration steps completed
- [ ] All verification steps passed
- [ ] No error messages in Supabase dashboard
- [ ] Configuration summary filled out
- [ ] Test user created successfully (optional)
- [ ] Documentation reviewed and understood

---

## 🚨 Troubleshooting Quick Reference

If you encounter issues:

### Can't find Authentication tab
→ Look for 🔐 icon in left sidebar

### Save button not working
→ Check for red error messages, verify all fields

### Invalid redirect URL error
→ Ensure URLs start with `http://` or `https://`

### Users can't log in after signup
→ Check if email confirmations are enabled; disable for dev

### CORS errors in browser
→ Verify Site URL matches your app URL

**Full troubleshooting guide:** `docs/SUPABASE_AUTH_TROUBLESHOOTING.md`

---

## 📚 Documentation Reference

Keep these documents handy:

- [ ] **Main Instructions:** `docs/TASK_2.4_INSTRUCTIONS.md`
- [ ] **Visual Guide:** `docs/TASK_2.4_VISUAL_GUIDE.md`
- [ ] **Quick Reference:** `docs/SUPABASE_AUTH_QUICK_REFERENCE.md`
- [ ] **Troubleshooting:** `docs/SUPABASE_AUTH_TROUBLESHOOTING.md`
- [ ] **This Checklist:** `docs/TASK_2.4_CHECKLIST.md`

---

## ⏱️ Time Tracking

Track your time:

```
Start time:  __________
End time:    __________
Total time:  __________

Expected: 15-25 minutes
```

---

## 🎉 Task Completion

When all items are checked:

- [ ] All configuration steps completed ✅
- [ ] All verification steps passed ✅
- [ ] No outstanding issues ✅
- [ ] Documentation reviewed ✅
- [ ] Ready to proceed to Task 2.5 ✅

**Congratulations! Task 2.4 is complete!** 🎉

---

## 🚀 Next Steps

After completing this task:

### Immediate Next Task
**Task 2.5: Create Supabase Client Utilities**
- Create `lib/supabase/client.ts`
- Create `lib/supabase/server.ts`
- Set up auth helpers

### Upcoming Tasks
- Task 3.1: Create auth layout and pages structure
- Task 3.2: Implement LoginForm component
- Task 3.3: Implement SignupForm component

---

## 💡 Notes and Observations

Use this space to note anything important:

```
_____________________________________________________________

_____________________________________________________________

_____________________________________________________________

_____________________________________________________________

_____________________________________________________________
```

---

## 📞 Support Contacts

If you need help:

- **Documentation:** Check `docs/` folder
- **Supabase Discord:** https://discord.supabase.com
- **Supabase Docs:** https://supabase.com/docs/guides/auth
- **GitHub Issues:** https://github.com/supabase/supabase/issues

---

**Checklist Version:** 1.0  
**Last Updated:** 2024  
**Task:** 2.4 Configure Supabase Auth settings  
**Status:** Ready for execution

---

## 🖨️ Print Instructions

To print this checklist:

1. **In your browser:**
   - Press Ctrl+P (Cmd+P on Mac)
   - Select printer or "Save as PDF"
   - Print or save

2. **In your editor:**
   - Open this file in your code editor
   - Use editor's print function
   - Or copy to a word processor

3. **Keep it handy:**
   - Print and keep next to your computer
   - Or keep open in a separate window
   - Check off items as you complete them

---

**Happy configuring!** 🚀
