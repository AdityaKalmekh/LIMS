# Task 2.3 Instructions: Apply RLS Policies

## Quick Start

Follow these steps to apply Row Level Security policies to your patients table.

## Prerequisites

✅ Task 2.2 completed (patients table created)  
✅ Supabase project is set up  
✅ You have access to Supabase Dashboard  

## Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your LIMS project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query** button

### Step 2: Run the RLS Migration

1. Open the file: `supabase/migrations/002_setup_rls_policies.sql`
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter / Cmd+Enter)

You should see a success message: "Success. No rows returned"

### Step 3: Verify RLS is Enabled

Run this verification query:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'patients';
```

**Expected Result:**
```
tablename | rowsecurity
----------|------------
patients  | true
```

### Step 4: Verify Policies Exist

Run this query to check the policies:

```sql
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'patients'
ORDER BY policyname;
```

**Expected Result:**
You should see 2 policies:
1. `Admins can insert patients` (cmd: INSERT)
2. `Admins can view patients` (cmd: SELECT)

### Step 5: Test the Policies (Optional)

#### Test 1: Check Current Auth Status
```sql
SELECT auth.role();
```

This will show your current authentication role.

#### Test 2: Try to Query Patients
```sql
SELECT * FROM patients;
```

- If you're authenticated: You'll see patient records (or empty if no patients yet)
- If you're not authenticated: You'll see no rows

## What Was Implemented?

### 🔒 RLS Enabled
The patients table now has Row Level Security enabled, meaning all queries are subject to security policies.

### 📋 Two Security Policies

1. **"Admins can view patients"** (SELECT)
   - Who: Authenticated users only
   - What: Can read all patient records
   - Why: Protects patient data from unauthorized access

2. **"Admins can insert patients"** (INSERT)
   - Who: Authenticated users only
   - What: Can create new patient records
   - Why: Prevents unauthorized patient registration

## How It Works

```
User Request → Supabase Client → PostgreSQL
                                      ↓
                              Check auth.role()
                                      ↓
                    authenticated? → Allow access
                    not authenticated? → Deny access
```

## Troubleshooting

### Issue: "Success. No rows returned" but nothing seems to change

**This is normal!** The migration succeeded. RLS policies don't return data, they just set up rules.

### Issue: Can't see patients after enabling RLS

**Solution:** Make sure you're authenticated. RLS blocks unauthenticated access.

```javascript
// Check if you're logged in
const { data: { user } } = await supabase.auth.getUser();
console.log(user); // Should show user object
```

### Issue: "permission denied for table patients"

**Solution:** This means RLS is working! You need to be authenticated to access the table.

## Next Steps

After completing this task:

1. ✅ RLS policies are active
2. ➡️ Continue to Task 2.4: Configure Supabase Auth settings
3. ➡️ Then Task 2.5: Create Supabase client utilities

## Additional Resources

- **Detailed Guide:** See `docs/RLS_SETUP_GUIDE.md` for comprehensive documentation
- **Migration Guide:** See `docs/DATABASE_MIGRATION_GUIDE.md` for general migration help
- **Supabase RLS Docs:** [https://supabase.com/docs/guides/auth/row-level-security](https://supabase.com/docs/guides/auth/row-level-security)

## Rollback (If Needed)

If you need to undo this migration:

1. Open SQL Editor
2. Run the file: `supabase/migrations/002_setup_rls_policies_rollback.sql`

⚠️ **WARNING:** This removes all security policies! Only use in development.

## Summary

✅ RLS enabled on patients table  
✅ SELECT policy created (view patients)  
✅ INSERT policy created (create patients)  
✅ Database-level security active  
✅ Ready for authentication implementation  

---

**Need Help?** Check the troubleshooting section in `docs/RLS_SETUP_GUIDE.md`
