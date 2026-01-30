# Row Level Security (RLS) Setup Guide

## Overview

This guide explains the Row Level Security (RLS) policies implemented for the LIMS application. RLS is a PostgreSQL feature that allows you to control which rows users can access in database tables based on security policies.

## What is Row Level Security?

Row Level Security (RLS) is a security feature that restricts which rows can be returned by normal queries or inserted, updated, or deleted by data modification commands. This is particularly important for multi-tenant applications or applications where different users should have access to different subsets of data.

## Why RLS for LIMS?

In the LIMS application:
- Only authenticated admin users should be able to view patient records
- Only authenticated admin users should be able to create new patient records
- RLS provides an additional security layer beyond application-level checks
- Even if there's a bug in the application code, the database will enforce these rules

## RLS Policies for Patients Table

### Policy 1: Admins can view patients

```sql
CREATE POLICY "Admins can view patients"
  ON patients
  FOR SELECT
  USING (auth.role() = 'authenticated');
```

**What it does:**
- Applies to SELECT queries (reading data)
- Only allows authenticated users to view patient records
- Uses Supabase's `auth.role()` function to check authentication status

**Example:**
- ✅ Authenticated admin runs `SELECT * FROM patients` → Returns all patients
- ❌ Unauthenticated user runs `SELECT * FROM patients` → Returns no rows

### Policy 2: Admins can insert patients

```sql
CREATE POLICY "Admins can insert patients"
  ON patients
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

**What it does:**
- Applies to INSERT queries (creating new records)
- Only allows authenticated users to create patient records
- Uses `WITH CHECK` to validate the condition before allowing the insert

**Example:**
- ✅ Authenticated admin inserts a patient → Success
- ❌ Unauthenticated user tries to insert → Error: "new row violates row-level security policy"

## How to Apply RLS Policies

### Step 1: Run the Migration

1. Open your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `supabase/migrations/002_setup_rls_policies.sql`
5. Paste into the SQL Editor
6. Click **Run**

### Step 2: Verify RLS is Enabled

Run this query to check if RLS is enabled:

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

### Step 3: Verify Policies Exist

Run this query to list all policies:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'patients';
```

Expected result should show two policies:
- `Admins can view patients` (SELECT)
- `Admins can insert patients` (INSERT)

## Testing RLS Policies

### Test 1: Authenticated User Can View Patients

```javascript
// In your Next.js application
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// User must be logged in
const { data: patients, error } = await supabase
  .from('patients')
  .select('*');

// Should return patient records if authenticated
console.log(patients);
```

### Test 2: Authenticated User Can Insert Patients

```javascript
const { data, error } = await supabase
  .from('patients')
  .insert({
    mobile_number: '+919876543210',
    title: 'Mr.',
    first_name: 'John',
    last_name: 'Doe',
    sex: 'Male',
    age_years: 30,
  });

// Should succeed if authenticated
```

### Test 3: Unauthenticated User Cannot Access

```javascript
// Without authentication
const supabase = createClient();

const { data, error } = await supabase
  .from('patients')
  .select('*');

// Should return empty array or error
console.log(data); // []
console.log(error); // May contain RLS policy violation
```

## Understanding Supabase Auth Context

Supabase automatically handles the authentication context:

- When a user is logged in via `supabase.auth.signInWithPassword()`, their JWT token is included in all database requests
- The `auth.role()` function in PostgreSQL reads this token and returns:
  - `'authenticated'` - User is logged in
  - `'anon'` - User is not logged in (anonymous)
- RLS policies use this information to determine access

## Future RLS Policies

As the application grows, you may need additional policies:

### Update Policy (Future)
```sql
CREATE POLICY "Admins can update patients"
  ON patients
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

### Delete Policy (Future)
```sql
CREATE POLICY "Admins can delete patients"
  ON patients
  FOR DELETE
  USING (auth.role() = 'authenticated');
```

### Role-Based Policies (Future)
If you add different user roles (admin, viewer, etc.):

```sql
-- Only admins can insert
CREATE POLICY "Only admins can insert patients"
  ON patients
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Viewers can only read
CREATE POLICY "Viewers can read patients"
  ON patients
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' IN ('admin', 'viewer')
  );
```

## Troubleshooting

### Issue: "new row violates row-level security policy"

**Cause:** Trying to insert/update data without proper authentication or permissions.

**Solution:**
1. Ensure user is authenticated: `const { data: { user } } = await supabase.auth.getUser()`
2. Check that the JWT token is being sent with requests
3. Verify the RLS policy conditions match your use case

### Issue: SELECT returns empty array for authenticated user

**Cause:** RLS policy might be too restrictive or authentication not properly set up.

**Solution:**
1. Verify user is actually authenticated
2. Check the policy using `SELECT * FROM pg_policies WHERE tablename = 'patients'`
3. Test the policy condition manually: `SELECT auth.role()`

### Issue: RLS policies not applying

**Cause:** RLS might not be enabled on the table.

**Solution:**
```sql
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
```

## Security Best Practices

1. **Always enable RLS on tables with sensitive data**
   - Patient records are sensitive and should always be protected

2. **Use the principle of least privilege**
   - Only grant the minimum permissions needed
   - Start restrictive and loosen as needed

3. **Test policies thoroughly**
   - Test with authenticated users
   - Test with unauthenticated users
   - Test edge cases

4. **Document your policies**
   - Explain why each policy exists
   - Document any special conditions

5. **Monitor policy violations**
   - Set up logging for RLS violations
   - Review logs regularly for suspicious activity

6. **Keep policies simple**
   - Complex policies are harder to maintain and debug
   - Break complex logic into multiple policies if needed

## Rollback Instructions

If you need to remove RLS policies (e.g., for testing or reconfiguration):

1. Open Supabase SQL Editor
2. Run the rollback migration: `supabase/migrations/002_setup_rls_policies_rollback.sql`

**WARNING:** This will remove all security policies! Only do this in development or if you plan to immediately add new policies.

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)

## Summary

Row Level Security is a critical security feature for the LIMS application. The policies ensure that:

✅ Only authenticated admins can view patient records  
✅ Only authenticated admins can create patient records  
✅ Database enforces security even if application code has bugs  
✅ Patient data is protected at the database level  

Always test RLS policies after applying them and monitor for any access issues.
