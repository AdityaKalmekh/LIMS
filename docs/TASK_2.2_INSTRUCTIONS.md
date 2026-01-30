# Task 2.2: Create Patients Table with Schema

## Quick Start Guide

This guide provides step-by-step instructions for completing Task 2.2.

---

## 📋 Task Overview

**Goal**: Create the `patients` table in your Supabase database with the required schema.

**Prerequisites**:
- ✅ Supabase project created (Task 2.1)
- ✅ Environment variables configured
- ✅ Access to Supabase Dashboard

**Estimated Time**: 5-10 minutes

---

## 🚀 Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Click on your project: **lims-project**
3. In the left sidebar, click **SQL Editor**
4. Click the **New Query** button

### Step 2: Copy the Migration SQL

Open the file: `lims-app/supabase/migrations/001_create_patients_table.sql`

**Copy the entire contents** of this file. The SQL includes:
- UUID extension setup
- Table creation with all columns
- Constraints and validations
- Indexes for performance
- Documentation comments

### Step 3: Execute the Migration

1. **Paste** the SQL into the Supabase SQL Editor
2. **Click Run** (or press `Ctrl+Enter` on Windows/Linux, `Cmd+Enter` on Mac)
3. Wait for execution to complete
4. Look for the success message: **"Success. No rows returned"**

### Step 4: Verify the Table Was Created

1. In the left sidebar, click **Table Editor**
2. You should see **patients** in the list of tables
3. Click on **patients** to view the table structure

### Step 5: Verify Table Schema

Confirm the following columns exist:

| Column Name | Type | Constraints |
|------------|------|-------------|
| `id` | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| `mobile_number` | varchar(15) | NOT NULL |
| `title` | varchar(10) | NOT NULL |
| `first_name` | varchar(100) | NOT NULL |
| `last_name` | varchar(100) | - |
| `sex` | varchar(10) | NOT NULL, CHECK (Male/Female/Other) |
| `age_years` | integer | NOT NULL, CHECK (>= 0) |
| `age_months` | integer | CHECK (0-11) |
| `age_days` | integer | CHECK (0-30) |
| `referred_by` | varchar(200) | - |
| `created_at` | timestamptz | DEFAULT NOW() |
| `created_by` | uuid | FOREIGN KEY → auth.users(id) |
| `updated_at` | timestamptz | DEFAULT NOW() |

---

## ✅ Verification Checklist

Before marking this task complete, verify:

- [ ] SQL executed without errors
- [ ] `patients` table appears in Table Editor
- [ ] All 13 columns are present
- [ ] Column types match the schema above
- [ ] Indexes created: `idx_patients_mobile`, `idx_patients_created_at`
- [ ] Foreign key constraint on `created_by` exists

---

## 🎯 What You've Accomplished

After completing this task:

✅ **Database Schema Created**: The patients table is ready to store patient records

✅ **Data Validation**: CHECK constraints ensure data integrity:
- Sex must be Male, Female, or Other
- Age values must be within valid ranges
- Required fields cannot be null

✅ **Performance Optimized**: Indexes created for:
- Fast mobile number lookups
- Efficient sorting by creation date

✅ **Audit Trail**: Tracks who created each record and when

---

## 🔍 Testing the Table (Optional)

You can test the table by inserting a sample record:

```sql
-- Insert a test patient record
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

-- Query the record
SELECT * FROM patients;

-- Clean up test data (optional)
DELETE FROM patients WHERE mobile_number = '+919876543210';
```

**Note**: You may get an error about RLS (Row Level Security) policies. This is expected and will be fixed in Task 2.3.

---

## 🐛 Troubleshooting

### Issue: "extension uuid-ossp does not exist"

**Solution**: The migration should handle this automatically. If you see this error, run:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

Then re-run the migration.

### Issue: "permission denied for schema auth"

**Solution**: This is normal. The `auth.users` table is managed by Supabase Auth. The foreign key constraint will work correctly.

### Issue: "table patients already exists"

**Solution**: The table was already created. You can:

1. **Skip this step** if the table structure is correct
2. **Drop and recreate** (WARNING: deletes all data):
   ```sql
   DROP TABLE IF EXISTS patients CASCADE;
   ```
   Then re-run the migration.

### Issue: Table not visible in Table Editor

**Solution**:
1. Refresh the page
2. Check you're in the correct project
3. Look for error messages in the SQL Editor

---

## 📚 Understanding the Schema

### Why These Fields?

- **mobile_number**: Primary contact method for patients
- **title**: Professional/social title (Mr., Mrs., Dr., etc.)
- **first_name & last_name**: Patient identification
- **sex**: Medical records requirement
- **age_years/months/days**: Precise age tracking (important for pediatric patients)
- **referred_by**: Track referral sources
- **created_at/created_by**: Audit trail for compliance
- **updated_at**: Track record modifications

### Why These Constraints?

- **NOT NULL on required fields**: Ensures data completeness
- **CHECK on sex**: Prevents invalid values
- **CHECK on age**: Ensures logical age values
- **Foreign key on created_by**: Links to admin user who created the record

### Why These Indexes?

- **idx_patients_mobile**: Fast patient lookup by phone number
- **idx_patients_created_at**: Efficient sorting/filtering by date

---

## 📖 Next Steps

After completing Task 2.2, proceed to:

### Task 2.3: Setup Row Level Security (RLS) Policies

You'll configure security policies to:
- Allow authenticated admins to view all patients
- Allow authenticated admins to insert new patients
- Prevent unauthorized access

### Task 2.4: Configure Supabase Auth Settings

Configure authentication settings for admin users.

---

## 📁 Related Files

- **Migration File**: `lims-app/supabase/migrations/001_create_patients_table.sql`
- **Full Guide**: `lims-app/docs/DATABASE_MIGRATION_GUIDE.md`
- **Design Reference**: `.kiro/specs/lims-admin-patient-registration/design.md` (Section 4.1)

---

## 💡 Tips

1. **Save Your Work**: The SQL Editor in Supabase doesn't auto-save. Copy your SQL before running it.

2. **Use Comments**: The migration includes helpful comments. Read them to understand what each part does.

3. **Check Logs**: If something goes wrong, check the Supabase logs in the Dashboard.

4. **Backup**: Before dropping tables, consider exporting data if you have any.

---

## ✨ Success Criteria

You've successfully completed Task 2.2 when:

1. ✅ The `patients` table exists in your Supabase database
2. ✅ All 13 columns are present with correct types
3. ✅ Constraints are in place (NOT NULL, CHECK, FK)
4. ✅ Indexes are created
5. ✅ No errors in the SQL Editor

---

**Task Status**: Ready to Execute  
**Next Task**: 2.3 - Setup Row Level Security (RLS) policies

---

## 🆘 Need Help?

If you encounter issues:

1. Review the Troubleshooting section above
2. Check the full DATABASE_MIGRATION_GUIDE.md
3. Consult Supabase documentation
4. Ask for assistance in the project chat

---

**Good luck! 🚀**
