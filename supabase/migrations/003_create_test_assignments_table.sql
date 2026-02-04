-- Migration: Create test_assignments table
-- Description: Creates the test_assignments table for tracking lab test assignments to patients
-- Date: 2025-01-XX
-- Task: 1. Create database schema for test assignments
-- Requirements: 5.1, 5.2, 5.3, 5.5

-- Create test_assignments table
CREATE TABLE IF NOT EXISTS test_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  test_type VARCHAR(20) NOT NULL CHECK (test_type IN ('CBC', 'BG', 'VDRL')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID NOT NULL REFERENCES auth.users(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate test assignments for the same patient
  UNIQUE(patient_id, test_type)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_test_assignments_patient_id ON test_assignments(patient_id);
CREATE INDEX IF NOT EXISTS idx_test_assignments_status ON test_assignments(status);
CREATE INDEX IF NOT EXISTS idx_test_assignments_assigned_at ON test_assignments(assigned_at DESC);

-- Add comment to table
COMMENT ON TABLE test_assignments IS 'Stores lab test assignments linking patients to specific tests';

-- Add comments to columns
COMMENT ON COLUMN test_assignments.id IS 'Unique identifier for the test assignment';
COMMENT ON COLUMN test_assignments.patient_id IS 'Foreign key to patients table';
COMMENT ON COLUMN test_assignments.test_type IS 'Type of lab test (CBC: Complete Blood Count, BG: Blood Glucose, VDRL: Venereal Disease Research Laboratory)';
COMMENT ON COLUMN test_assignments.status IS 'Current status of the test (pending, in_progress, completed, cancelled)';
COMMENT ON COLUMN test_assignments.assigned_at IS 'Timestamp when the test was assigned';
COMMENT ON COLUMN test_assignments.assigned_by IS 'UUID of the admin user who assigned the test';
COMMENT ON COLUMN test_assignments.completed_at IS 'Timestamp when the test was completed (nullable)';
COMMENT ON COLUMN test_assignments.notes IS 'Optional notes about the test assignment';
COMMENT ON COLUMN test_assignments.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN test_assignments.updated_at IS 'Timestamp when the record was last updated';
