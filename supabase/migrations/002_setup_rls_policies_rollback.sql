-- Rollback Migration: Remove Row Level Security (RLS) policies
-- Description: Drops RLS policies and disables RLS on patients table
-- Date: 2025-01-XX
-- Task: 2.3 Setup Row Level Security (RLS) policies (rollback)
-- WARNING: This will remove all security policies from the patients table!

-- Drop the RLS policies
DROP POLICY IF EXISTS "Admins can view patients" ON patients;
DROP POLICY IF EXISTS "Admins can insert patients" ON patients;

-- Disable Row Level Security on patients table
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;

-- Note: After running this rollback, the patients table will be accessible
-- without any row-level security restrictions. This should only be used
-- in development or if you need to completely reconfigure security policies.
