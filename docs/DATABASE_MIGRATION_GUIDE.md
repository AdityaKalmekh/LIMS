# Database Migration Guide

## Overview

This guide explains how to run database migrations for the LIMS application using Supabase SQL Editor.

## Prerequisites

Before running migrations, ensure you have:

1. ✅ Created a Supabase project (Task 2.1)
2. ✅ Configured environment variables in `.env.local`
3. ✅ Access to your Supabase Dashboard

## Migration Files

Migration files are located in: `lims-app/supabase/migrations/`

### Available Migrations

| Migration File | Description | Task |
|---------------|-------------|------|
| `001_create_patients_table.sql` | Creates the patients table with schema | 2.2 |

---

## How to Run Migrations

### Method 1: Using Supabase SQL Editor (Recommended)

This is the easiest method for running migrations manually.

#### Step 1: Access SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **lims-project** (or your project name)
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query** button

#### Step 2: Copy Migration SQL

1. Open the migration file you want to run:
   - For Task 2.2: `lims-app/supabase/migrations/001_create_patients_table.sql`
2. Copy the entire contents of the file

#### Step 3: Execute Migration

1. Paste the SQL into the SQL Editor
2. Click **Run** button (or press `Ctrl+Enter` / `Cmd+Enter`)
3. Wait for the query to complete
4. Check for success message: "Success. No rows returned"

#### Step 4: Verify Migration

After running the migration, verify it was successful:

1. In Supabase Dashboard, click **Table Editor** in the left sidebar
2. You should see the **patients** table listed
3. Click on the **patients** table to view its structure
4. Verify all columns are present:
   - `id` (uuid, primary key)
   - `mobile_number` (varchar)
   - `title` (varchar)
   - `first_name` (varchar)
   - `last_name` (varchar)
   - `sex` (varchar)
   - `age_years` (integer)
   - `age_months` (integer)
   - `age_days` (integer)
   - `referred_by` (varchar)
   - `created_at` (timestamptz)
   - `created_by` (uuid)
   - `updated_at` (timestamptz)

---

### Method 2: Using Supabase CLI (Advanced)

If you have the Supabase CLI installed, you can run migrations programmatically.

#### Prerequisites

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login
```

#### Initialize Supabase in Project

```bash
cd lims-app
supabase init
```

#### Link to Remote Project

```bash
# Get your project reference from Supabase Dashboard URL
# Format: https://supabase.com/dashboard/project/YOUR_PROJECT_REF
supabase link --project-ref YOUR_PROJECT_REF
```

#### Run Migrations

```bash
# Run all pending migrations
supabase db push

# Or run a specific migration file
supabase db execute --file supabase/migrations/001_create_patients_table.sql
```

---

## Migration Details: 001_create_patients_table.sql

### What This Migration Does

1. **Enables UUID Extension**: Ensures `uuid-ossp` extension is available for generating UUIDs
2. **Creates patients Table**: Creates the main table for storing patient records
3. **Adds Constraints**: 
   - Primary key on `id`
   - NOT NULL constraints on required fields
   - CHECK constraints for data validation:
     - `sex` must be 'Male', 'Female', or 'Other'
     - `age_years` must be >= 0
     - `age_months` must be 0-11
     - `age_days` must be 0-30
   - Foreign key on `created_by` referencing `auth.users(id)`
4. **Creates Indexes**:
   - `idx_patients_mobile`: For fast lookups by mobile number
   - `idx_patients_created_at`: For sorting by creation date
5. **Adds Documentation**: Comments on table and columns for clarity

### Schema Diagram

```
patients
├── id (UUID, PK) - Auto-generated unique identifier
├── mobile_number (VARCHAR(15), NOT NULL) - Patient phone number
├── title (VARCHAR(10), NOT NULL) - Mr., Mrs., Ms., Dr., etc.
├── first_name (VARCHAR(100), NOT NULL) - Patient first name
├── last_name (VARCHAR(100)) - Patient last name (optional)
├── sex (VARCHAR(10), NOT NULL) - Male, Female, or Other
├── age_years (INTEGER, NOT NULL) - Age in years (>= 0)
├── age_months (INTEGER) - Additional months (0-11)
├── age_days (INTEGER) - Additional days (0-30)
├── referred_by (VARCHAR(200)) - Referring doctor (optional)
├── created_at (TIMESTAMPTZ) - Record creation timestamp
├── created_by (UUID, FK) - Admin who created the record
└── updated_at (TIMESTAMPTZ) - Last update timestamp

Indexes:
- idx_patients_mobile (mobile_number)
- idx_patients_created_at (created_at DESC)

Foreign Keys:
- created_by → auth.users(id)
```

---

## Troubleshooting

### Error: "extension uuid-ossp does not exist"

**Solution**: The migration includes `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"` which should handle this automatically. If you still see this error, run:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Error: "relation auth.users does not exist"

**Solution**: This means Supabase Auth is not properly set up. Ensure:
1. Your Supabase project has Auth enabled (it should be by default)
2. You're running the migration on the correct project

### Error: "table patients already exists"

**Solution**: The migration uses `CREATE TABLE IF NOT EXISTS`, so this shouldn't happen. If you need to recreate the table:

```sql
-- Drop the table (WARNING: This deletes all data!)
DROP TABLE IF EXISTS patients CASCADE;

-- Then re-run the migration
```

### Migration Runs But Table Not Visible

**Solution**:
1. Refresh the Table Editor page
2. Check you're looking at the correct project
3. Verify the migration completed successfully (check for error messages)

---

## Next Steps

After successfully running this migration, you can proceed to:

### Task 2.3: Setup Row Level Security (RLS) Policies

You'll need to:
1. Enable RLS on the patients table
2. Create policies for authenticated users to view and insert patients

### Task 2.4: Configure Supabase Auth Settings

Configure authentication settings for admin users.

---

## Verification Checklist

Before moving to the next task, verify:

- [ ] Migration executed without errors
- [ ] `patients` table is visible in Table Editor
- [ ] All 13 columns are present with correct data types
- [ ] Indexes are created (`idx_patients_mobile`, `idx_patients_created_at`)
- [ ] Foreign key constraint exists on `created_by`
- [ ] CHECK constraints are in place for `sex`, `age_years`, `age_months`, `age_days`

---

## Additional Resources

- [Supabase SQL Editor Documentation](https://supabase.com/docs/guides/database/overview)
- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [PostgreSQL Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)

---

## Support

If you encounter issues:

1. Check the Supabase Dashboard logs
2. Review the error message carefully
3. Consult the Troubleshooting section above
4. Check Supabase documentation
5. Ask for help in the project chat

---

**Last Updated**: Task 2.2 - Create patients table with schema
