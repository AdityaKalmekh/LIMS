# Task 1.5: Seed Data Migration for Blood Group and CBC Report Types

## Overview

This document describes the seed data migration created for Task 1.5, which populates the database with Blood Group and CBC (Complete Blood Count) report type definitions and their associated field configurations.

## Migration Files Created

### 1. `009_seed_report_types_data.sql`
Main migration file that inserts seed data for two report types.

### 2. `009_seed_report_types_data_rollback.sql`
Rollback migration that removes the seeded data.

## What This Migration Does

### Blood Group Report Type

**Report Type:**
- Code: `BLOOD_GROUP`
- Name: Blood Group Test
- Description: Determines blood type and Rh factor

**Fields (2 dropdown fields):**

1. **Blood Group**
   - Field Type: Dropdown
   - Options: A, B, AB, O
   - Required: Yes
   - Order: 1

2. **Rh Factor**
   - Field Type: Dropdown
   - Options: POSITIVE, NEGATIVE
   - Required: Yes
   - Order: 2

### CBC (Complete Blood Count) Report Type

**Report Type:**
- Code: `CBC`
- Name: Complete Blood Count
- Description: Comprehensive blood cell analysis

**Fields (14 numeric fields + 2 dropdown fields):**

#### Numeric Fields (with units and normal ranges):

1. **Hb (Haemoglobin)**
   - Unit: gm/dl
   - Normal Range: 13-17
   - Required: Yes

2. **Total Leukocyte Count**
   - Unit: /Cumm.
   - Normal Range: 4000-11000
   - Required: Yes

3. **RBC**
   - Unit: mill/cumm
   - Normal Range: 4.5-5.5
   - Required: Yes

4. **PCV/Haematocrit**
   - Unit: %
   - Normal Range: 40-50
   - Required: Yes

5. **Platelet Count**
   - Unit: lakhs/cumm
   - Normal Range: 1.5-4.5
   - Required: Yes

6. **MCV**
   - Unit: fL
   - Normal Range: 83-101
   - Required: Yes

7. **MCH**
   - Unit: pg
   - Normal Range: 27-32
   - Required: Yes

8. **MCHC**
   - Unit: g/dL
   - Normal Range: 31.5-34.5
   - Required: Yes

9. **RDW-CV**
   - Unit: %
   - Normal Range: 11.6-14.0
   - Required: Yes

10. **Neutrophil**
    - Unit: %
    - Normal Range: 40-80
    - Required: Yes

11. **Lymphocyte**
    - Unit: %
    - Normal Range: 20-40
    - Required: Yes

12. **Monocyte**
    - Unit: %
    - Normal Range: 2-10
    - Required: Yes

13. **Eosinophil**
    - Unit: %
    - Normal Range: 1-6
    - Required: Yes

14. **Basophil**
    - Unit: %
    - Normal Range: 0-1
    - Required: Yes

#### Dropdown Fields:

15. **Platelet on Smear**
    - Options: Adequate, Increased, Decreased
    - Default Value: Adequate
    - Required: No

16. **Malarial Parasite**
    - Options: 
      - NO MALARIAL PARASITE SEEN IN SMEAR EXAMINED
      - Plasmodium Falciparum
      - Plasmodium Vivax
      - Plasmodium Ovale
      - Plasmodium Malariae
    - Default Value: NO MALARIAL PARASITE SEEN IN SMEAR EXAMINED
    - Required: No

## How to Run This Migration

### Prerequisites

Before running this migration, ensure the following migrations have been run:
1. `005_create_report_types_table.sql`
2. `006_create_report_fields_table.sql`

### Method 1: Using Supabase SQL Editor (Recommended)

1. Open your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query** button
5. Copy the contents of `lims-app/supabase/migrations/009_seed_report_types_data.sql`
6. Paste into the SQL Editor
7. Click **Run** (or press Ctrl+Enter / Cmd+Enter)
8. Wait for success message: "Success. No rows returned"

### Method 2: Using Supabase CLI

```bash
cd lims-app
supabase db execute --file supabase/migrations/009_seed_report_types_data.sql
```

## Verification Steps

After running the migration, verify the data was inserted correctly:

### 1. Check Report Types

```sql
SELECT * FROM report_types WHERE code IN ('BLOOD_GROUP', 'CBC');
```

Expected result: 2 rows (Blood Group and CBC)

### 2. Check Blood Group Fields

```sql
SELECT 
  rf.field_name,
  rf.field_label,
  rf.field_type,
  rf.field_order,
  rf.is_required,
  rf.dropdown_options
FROM report_fields rf
JOIN report_types rt ON rf.report_type_id = rt.id
WHERE rt.code = 'BLOOD_GROUP'
ORDER BY rf.field_order;
```

Expected result: 2 rows (blood_group and rh_factor)

### 3. Check CBC Fields

```sql
SELECT 
  rf.field_name,
  rf.field_label,
  rf.field_type,
  rf.field_order,
  rf.is_required,
  rf.unit,
  rf.normal_range_text,
  rf.dropdown_options,
  rf.default_value
FROM report_fields rf
JOIN report_types rt ON rf.report_type_id = rt.id
WHERE rt.code = 'CBC'
ORDER BY rf.field_order;
```

Expected result: 16 rows (14 numeric fields + 2 dropdown fields)

### 4. Verify Field Count

```sql
SELECT 
  rt.code,
  rt.name,
  COUNT(rf.id) as field_count
FROM report_types rt
LEFT JOIN report_fields rf ON rf.report_type_id = rt.id
WHERE rt.code IN ('BLOOD_GROUP', 'CBC')
GROUP BY rt.code, rt.name;
```

Expected result:
- BLOOD_GROUP: 2 fields
- CBC: 16 fields

## Rollback Instructions

If you need to remove the seeded data:

### Using Supabase SQL Editor

1. Open SQL Editor
2. Copy contents of `lims-app/supabase/migrations/009_seed_report_types_data_rollback.sql`
3. Paste and run

### Using Supabase CLI

```bash
cd lims-app
supabase db execute --file supabase/migrations/009_seed_report_types_data_rollback.sql
```

**WARNING:** This will delete all Blood Group and CBC report type definitions and their associated fields. Any report instances using these types will be affected.

## Migration Features

### Idempotency

The migration uses `ON CONFLICT ... DO NOTHING` clauses to ensure it can be run multiple times safely without creating duplicate data.

### Data Integrity

- Foreign key relationships are maintained using subqueries
- All required fields are properly marked
- Normal ranges are stored in multiple formats (min/max values and text)
- Dropdown options are stored as JSONB arrays

### Documentation

- Comprehensive comments explain each section
- Field specifications match the design document
- Requirements are referenced in the header

## Requirements Satisfied

This migration satisfies the following requirements:

- **6.1**: Blood Group dropdown field with options A, B, AB, O
- **6.2**: Rh Factor dropdown field with options POSITIVE, NEGATIVE
- **6.3**: Both Blood Group fields are required
- **7.1**: CBC report with 14 numeric text input fields
- **7.3**: CBC Platelet on Smear dropdown with default "Adequate"
- **7.4**: CBC Malarial Parasite dropdown with default value

## Next Steps

After running this migration, you can proceed with:

1. **Task 2.1**: Create TypeScript types for report data models
2. **Task 3.x**: Implement API endpoints to fetch report type definitions
3. **Task 6.x**: Create Blood Group form component
4. **Task 7.x**: Create CBC form component

## Troubleshooting

### Error: "relation report_types does not exist"

**Solution**: Run migrations 005 and 006 first to create the report_types and report_fields tables.

### Error: "duplicate key value violates unique constraint"

**Solution**: The data already exists. This is safe to ignore due to the `ON CONFLICT DO NOTHING` clause.

### No rows inserted

**Solution**: Check if the data already exists:
```sql
SELECT * FROM report_types WHERE code IN ('BLOOD_GROUP', 'CBC');
```

If rows exist, the migration has already been run successfully.

## Additional Resources

- [Design Document](.kiro/specs/patient-test-reports/design.md)
- [Requirements Document](.kiro/specs/patient-test-reports/requirements.md)
- [Database Migration Guide](./DATABASE_MIGRATION_GUIDE.md)
- [Supabase SQL Editor Documentation](https://supabase.com/docs/guides/database/overview)

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review the verification steps
3. Consult the Database Migration Guide
4. Check Supabase Dashboard logs

---

**Task**: 1.5 Create seed data migration for Blood Group and CBC report types  
**Status**: ✅ Complete  
**Date**: 2025-01-XX  
**Requirements**: 6.1, 6.2, 6.3, 7.1, 7.3, 7.4
