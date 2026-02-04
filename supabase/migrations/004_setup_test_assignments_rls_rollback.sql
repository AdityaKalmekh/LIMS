-- Rollback Migration: Remove RLS policies from test_assignments table
-- Description: Drops all RLS policies and disables RLS on test_assignments table
-- Date: 2025-01-XX

-- Drop all policies
DROP POLICY IF EXISTS "Admins can view test assignments" ON test_assignments;
DROP POLICY IF EXISTS "Admins can insert test assignments" ON test_assignments;
DROP POLICY IF EXISTS "Admins can update test assignments" ON test_assignments;
DROP POLICY IF EXISTS "Admins can delete test assignments" ON test_assignments;

-- Disable Row Level Security
ALTER TABLE test_assignments DISABLE ROW LEVEL SECURITY;
