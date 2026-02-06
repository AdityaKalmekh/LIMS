-- Rollback Migration: Drop report_types table
-- Description: Rolls back the creation of the report_types table
-- Date: 2025-01-XX
-- Task: 1.1 Create report_types table migration

-- Drop indexes
DROP INDEX IF EXISTS idx_report_types_is_active;
DROP INDEX IF EXISTS idx_report_types_code;

-- Drop table
DROP TABLE IF EXISTS report_types;
