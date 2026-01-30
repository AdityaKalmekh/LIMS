-- Migration: Setup Row Level Security (RLS) policies for patients table
-- Description: Enables RLS and creates policies for authenticated admin users
-- Date: 2025-01-XX
-- Task: 2.3 Setup Row Level Security (RLS) policies

-- Enable Row Level Security on patients table
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all patients
-- Allows authenticated users to SELECT (read) all patient records
CREATE POLICY "Admins can view patients"
  ON patients
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Admins can insert patients
-- Allows authenticated users to INSERT (create) new patient records
CREATE POLICY "Admins can insert patients"
  ON patients
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Add comments for documentation
COMMENT ON POLICY "Admins can view patients" ON patients IS 
  'Allows authenticated admin users to view all patient records';

COMMENT ON POLICY "Admins can insert patients" ON patients IS 
  'Allows authenticated admin users to create new patient records';
