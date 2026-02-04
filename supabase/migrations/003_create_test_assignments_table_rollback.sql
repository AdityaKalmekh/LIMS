-- Rollback Migration: Drop test_assignments table
-- Description: Removes the test_assignments table and its indexes
-- Date: 2025-01-XX
-- Task: 1. Create database schema for test assignments

-- Drop indexes
DROP INDEX IF EXISTS idx_test_assignments_assigned_at;
DROP INDEX IF EXISTS idx_test_assignments_status;
DROP INDEX IF EXISTS idx_test_assignments_patient_id;

-- Drop table (CASCADE will remove dependent objects if any)
DROP TABLE IF EXISTS test_assignments CASCADE;
