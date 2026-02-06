-- Rollback Migration: Drop report_fields table
-- Description: Rolls back the creation of the report_fields table
-- Date: 2025-01-XX
-- Task: 1.2 Create report_fields table migration

-- Drop indexes
DROP INDEX IF EXISTS idx_report_fields_field_order;
DROP INDEX IF EXISTS idx_report_fields_report_type_id;

-- Drop table (CASCADE will handle any dependent objects)
DROP TABLE IF EXISTS report_fields CASCADE;
