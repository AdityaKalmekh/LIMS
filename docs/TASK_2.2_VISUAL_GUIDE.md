# Task 2.2: Visual Step-by-Step Guide

## 🎯 Goal: Create the Patients Table in Supabase

This visual guide walks you through executing Task 2.2 with screenshots descriptions.

---

## 📍 Step 1: Access Your Supabase Dashboard

### What to do:
1. Open your web browser
2. Go to: **https://supabase.com/dashboard**
3. You should see your project listed

### What you'll see:
- Your project name: **lims-project** (or whatever you named it)
- Project status: Active (green dot)
- Your project card with database info

### Action:
**Click on your project card** to open the project dashboard

---

## 📍 Step 2: Open the SQL Editor

### What to do:
1. Look at the left sidebar
2. Find the **SQL Editor** option (it has a `</>` icon)
3. Click on **SQL Editor**

### What you'll see:
- The SQL Editor interface
- A list of saved queries (if any)
- A **"New Query"** button in the top right

### Action:
**Click the "New Query" button**

---

## 📍 Step 3: Prepare the Migration SQL

### What to do:
1. Open your code editor (VS Code, etc.)
2. Navigate to: `lims-app/supabase/migrations/001_create_patients_table.sql`
3. Select all the content (Ctrl+A / Cmd+A)
4. Copy it (Ctrl+C / Cmd+C)

### What you're copying:
```sql
-- Migration: Create patients table
-- Description: Creates the patients table with all required fields and constraints
-- Date: 2025-01-XX
-- Task: 2.2 Create patients table with schema

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mobile_number VARCHAR(15) NOT NULL,
  title VARCHAR(10) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  sex VARCHAR(10) NOT NULL CHECK (sex IN ('Male', 'Female', 'Other')),
  age_years INTEGER NOT NULL CHECK (age_years >= 0),
  age_months INTEGER CHECK (age_months >= 0 AND age_months < 12),
  age_days INTEGER CHECK (age_days >= 0 AND age_days < 31),
  referred_by VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_patients_mobile ON patients(mobile_number);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at DESC);

-- Add comment to table
COMMENT ON TABLE patients IS 'Stores patient registration information for the LIMS system';

-- Add comments to columns
COMMENT ON COLUMN patients.id IS 'Unique identifier for the patient';
COMMENT ON COLUMN patients.mobile_number IS 'Patient mobile number with country code (e.g., +91XXXXXXXXXX)';
COMMENT ON COLUMN patients.title IS 'Patient title (Mr., Mrs., Ms., Dr., etc.)';
COMMENT ON COLUMN patients.first_name IS 'Patient first name (required)';
COMMENT ON COLUMN patients.last_name IS 'Patient last name (optional)';
COMMENT ON COLUMN patients.sex IS 'Patient sex (Male, Female, or Other)';
COMMENT ON COLUMN patients.age_years IS 'Patient age in years';
COMMENT ON COLUMN patients.age_months IS 'Additional months for patient age (0-11)';
COMMENT ON COLUMN patients.age_days IS 'Additional days for patient age (0-30)';
COMMENT ON COLUMN patients.referred_by IS 'Name of the referring doctor or entity (optional)';
COMMENT ON COLUMN patients.created_at IS 'Timestamp when the patient record was created';
COMMENT ON COLUMN patients.created_by IS 'UUID of the admin user who created the record';
COMMENT ON COLUMN patients.updated_at IS 'Timestamp when the patient record was last updated';
```

### Action:
**Copy the entire SQL file content**

---

## 📍 Step 4: Paste SQL into Editor

### What to do:
1. Go back to the Supabase SQL Editor tab
2. Click in the query editor area (the large text box)
3. Paste the SQL (Ctrl+V / Cmd+V)

### What you'll see:
- The SQL code appears in the editor
- Syntax highlighting (colors for SQL keywords)
- Line numbers on the left

### Tip:
You can optionally give your query a name:
- Look for the "Untitled Query" text at the top
- Click it and rename to: "Create Patients Table"

### Action:
**Paste the SQL into the editor**

---

## 📍 Step 5: Execute the Migration

### What to do:
1. Look for the **"Run"** button (usually green, top right of editor)
2. Click **"Run"**
   - Or use keyboard shortcut: **Ctrl+Enter** (Windows/Linux) or **Cmd+Enter** (Mac)

### What happens:
- The SQL executes against your database
- You'll see a loading indicator
- After a few seconds, you'll see the result

### What you should see:
✅ **Success message**: "Success. No rows returned"

This is correct! The migration creates a table but doesn't return any data.

### If you see an error:
- Read the error message carefully
- Check the Troubleshooting section below
- Common errors are listed with solutions

### Action:
**Click "Run" and wait for success message**

---

## 📍 Step 6: Verify the Table Was Created

### What to do:
1. Look at the left sidebar again
2. Find **"Table Editor"** (it has a table/grid icon)
3. Click on **"Table Editor"**

### What you'll see:
- A list of tables in your database
- You should now see **"patients"** in the list
- It will show "0 rows" (empty table)

### Action:
**Click on the "patients" table** to view its structure

---

## 📍 Step 7: Inspect the Table Structure

### What to do:
1. With the patients table selected, look at the columns
2. Verify all columns are present

### What you should see:

| Column Name | Type | Default | Nullable |
|------------|------|---------|----------|
| id | uuid | uuid_generate_v4() | No |
| mobile_number | varchar(15) | - | No |
| title | varchar(10) | - | No |
| first_name | varchar(100) | - | No |
| last_name | varchar(100) | - | Yes |
| sex | varchar(10) | - | No |
| age_years | int4 | - | No |
| age_months | int4 | - | Yes |
| age_days | int4 | - | Yes |
| referred_by | varchar(200) | - | Yes |
| created_at | timestamptz | now() | Yes |
| created_by | uuid | - | Yes |
| updated_at | timestamptz | now() | Yes |

### Check for:
- ✅ 13 columns total
- ✅ `id` is the primary key
- ✅ Required fields are NOT NULL
- ✅ Optional fields are NULL (nullable)
- ✅ Timestamps have default values

### Action:
**Verify all 13 columns are present**

---

## 📍 Step 8: Check Indexes (Optional)

### What to do:
1. In the Table Editor, look for an **"Indexes"** tab or section
2. Click on it to view indexes

### What you should see:
1. **patients_pkey** (Primary Key on `id`)
2. **idx_patients_mobile** (Index on `mobile_number`)
3. **idx_patients_created_at** (Index on `created_at`)

### Why this matters:
- Indexes make queries faster
- `idx_patients_mobile`: Fast patient lookup by phone
- `idx_patients_created_at`: Fast sorting by date

### Action:
**Verify the two custom indexes exist**

---

## 📍 Step 9: Test the Table (Optional)

### What to do:
1. Go back to **SQL Editor**
2. Create a new query
3. Try inserting a test record

### Test SQL:
```sql
-- Insert a test patient
INSERT INTO patients (
  mobile_number,
  title,
  first_name,
  last_name,
  sex,
  age_years,
  age_months,
  age_days,
  referred_by
) VALUES (
  '+919876543210',
  'Mr.',
  'John',
  'Doe',
  'Male',
  35,
  6,
  15,
  'Dr. Smith'
);

-- View the record
SELECT * FROM patients;
```

### Expected result:
You might see an **RLS (Row Level Security) error**. This is normal!

**Error message**: "new row violates row-level security policy"

**Why**: We haven't set up security policies yet (that's Task 2.3)

**What this means**: The table is working correctly! The error is a security feature.

### If the insert works:
- You'll see the new record in the SELECT query
- You can delete it: `DELETE FROM patients WHERE mobile_number = '+919876543210';`

### Action:
**Try the test (optional) - expect RLS error**

---

## ✅ Success Checklist

You've successfully completed Task 2.2 when:

- [x] SQL executed without syntax errors
- [x] Success message appeared: "Success. No rows returned"
- [x] `patients` table appears in Table Editor
- [x] All 13 columns are present
- [x] Column types match the specification
- [x] Primary key exists on `id`
- [x] Two custom indexes exist
- [x] Foreign key constraint on `created_by` exists

---

## 🐛 Troubleshooting

### Error: "extension uuid-ossp does not exist"

**What it means**: The UUID extension isn't enabled

**Solution**:
1. Run this SQL first:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```
2. Then run the full migration again

---

### Error: "permission denied for schema auth"

**What it means**: You're seeing a warning about the auth schema

**Solution**: This is normal! The `auth.users` table is managed by Supabase. The foreign key will work correctly. You can ignore this warning.

---

### Error: "relation patients already exists"

**What it means**: The table was already created

**Solution**:
1. Check if the table structure is correct in Table Editor
2. If correct, you're done! No need to run again.
3. If incorrect, run the rollback migration first:
   - Open `001_create_patients_table_rollback.sql`
   - Copy and run it in SQL Editor
   - Then run the main migration again

---

### Error: "syntax error at or near..."

**What it means**: There's a typo in the SQL

**Solution**:
1. Make sure you copied the ENTIRE migration file
2. Check for any accidental edits
3. Re-copy from the original file

---

### Table not visible in Table Editor

**What it means**: The table might not have been created, or the UI needs refresh

**Solution**:
1. Refresh the browser page (F5)
2. Check the SQL Editor for error messages
3. Try running the migration again
4. Check you're in the correct project

---

### Can't insert test data (RLS error)

**What it means**: Row Level Security is enabled (good!)

**Solution**: This is expected! You'll fix this in Task 2.3 by adding security policies. For now, just verify the table structure is correct.

---

## 🎉 Congratulations!

If you've completed all the steps above, you've successfully:

✅ Created the patients table in Supabase  
✅ Set up all required columns and constraints  
✅ Added indexes for performance  
✅ Prepared the database for patient registration  

---

## 📖 What's Next?

### Task 2.3: Setup Row Level Security (RLS) Policies

You'll configure security to:
- Allow authenticated admins to view patients
- Allow authenticated admins to insert patients
- Prevent unauthorized access

### Task 2.4: Configure Supabase Auth Settings

Set up authentication for admin users.

---

## 📚 Additional Resources

- **Quick Instructions**: `TASK_2.2_INSTRUCTIONS.md`
- **Detailed Guide**: `DATABASE_MIGRATION_GUIDE.md`
- **Migration File**: `supabase/migrations/001_create_patients_table.sql`
- **Design Spec**: `.kiro/specs/lims-admin-patient-registration/design.md`

---

## 💡 Tips for Success

1. **Take your time**: Read each step carefully
2. **Check for errors**: Look for red error messages
3. **Verify each step**: Use the checklist
4. **Don't skip verification**: Make sure the table structure is correct
5. **Save your work**: The SQL Editor doesn't auto-save queries

---

## 🆘 Need Help?

If you're stuck:

1. ✅ Review the troubleshooting section above
2. ✅ Check the error message carefully
3. ✅ Look at the detailed migration guide
4. ✅ Ask for help in the project chat

---

**You've got this! 🚀**

The migration is straightforward - just copy, paste, and run. The table will be created in seconds.

---

**Last Updated**: Task 2.2 - Create patients table with schema
