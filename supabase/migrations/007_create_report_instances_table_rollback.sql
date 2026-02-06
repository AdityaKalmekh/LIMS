-- Rollback Migration: Drop report_instances table
-- Description: Drops the report_instances table and its indexes
-- Date: 2025-01-XX
-- Task: 1.3 Create report_instances table migration (rollback)
-- Requirement: 10.3

-- Drop indexes
DROP INDEX IF EXISTS idx_report_instances_status;
DROP INDEX IF EXISTS idx_report_instances_test_assignment_id;

-- Drop table
DROP TABLE IF EXISTS report_instances;
