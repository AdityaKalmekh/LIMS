-- Migration: Setup Row Level Security (RLS) policies for test_assignments table
-- Description: Enables RLS and creates policies for authenticated admin users
-- Date: 2025-01-XX
-- Task: Setup RLS for test_assignments table
-- Requirements: 5.1, 5.2, 5.3

-- Enable Row Level Security on test_assignments table
ALTER TABLE test_assignments ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all test assignments
-- Allows authenticated users to SELECT (read) all test assignment records
CREATE POLICY "Admins can view test assignments"
  ON test_assignments
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Admins can insert test assignments
-- Allows authenticated users to INSERT (create) new test assignment records
CREATE POLICY "Admins can insert test assignments"
  ON test_assignments
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Admins can update test assignments
-- Allows authenticated users to UPDATE existing test assignment records
CREATE POLICY "Admins can update test assignments"
  ON test_assignments
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Admins can delete test assignments
-- Allows authenticated users to DELETE test assignment records
CREATE POLICY "Admins can delete test assignments"
  ON test_assignments
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Add comments for documentation
COMMENT ON POLICY "Admins can view test assignments" ON test_assignments IS 
  'Allows authenticated admin users to view all test assignment records';

COMMENT ON POLICY "Admins can insert test assignments" ON test_assignments IS 
  'Allows authenticated admin users to create new test assignment records';

COMMENT ON POLICY "Admins can update test assignments" ON test_assignments IS 
  'Allows authenticated admin users to update test assignment records (e.g., change status, add notes)';

COMMENT ON POLICY "Admins can delete test assignments" ON test_assignments IS 
  'Allows authenticated admin users to delete test assignment records';
