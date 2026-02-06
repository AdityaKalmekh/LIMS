-- Rollback Migration: Drop report_values table
-- Description: Removes the report_values table and its indexes
-- Date: 2025-01-XX
-- Task: 1.4 Create report_values table migration (rollback)
-- Requirement: 10.3

-- Drop the index
DROP INDEX IF EXISTS idx_report_values_report_instance_id;

-- Drop the table (CASCADE will remove dependent objects if any)
DROP TABLE IF EXISTS report_values CASCADE;
