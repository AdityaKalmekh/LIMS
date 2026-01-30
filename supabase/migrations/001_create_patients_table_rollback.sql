-- Rollback Migration: Drop patients table
-- Description: Rolls back the creation of the patients table
-- Date: 2025-01-XX
-- Task: 2.2 Create patients table with schema (ROLLBACK)

-- WARNING: This will delete all patient data!
-- Only run this if you need to undo the migration and recreate the table

-- Drop indexes first
DROP INDEX IF EXISTS idx_patients_created_at;
DROP INDEX IF EXISTS idx_patients_mobile;

-- Drop the patients table
-- CASCADE will also drop any dependent objects (like foreign key constraints from other tables)
DROP TABLE IF EXISTS patients CASCADE;

-- Note: We don't drop the uuid-ossp extension as it might be used by other tables
-- If you need to drop it, uncomment the line below:
-- DROP EXTENSION IF EXISTS "uuid-ossp";

-- Verification query (should return no results if rollback was successful)
-- SELECT * FROM patients;
