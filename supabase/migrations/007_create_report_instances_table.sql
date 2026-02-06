-- Migration: Create report_instances table
-- Description: Creates the report_instances table to store individual report instances for test assignments
-- Date: 2025-01-XX
-- Task: 1.3 Create report_instances table migration
-- Requirement: 10.3

-- Create report_instances table
CREATE TABLE IF NOT EXISTS report_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_assignment_id UUID NOT NULL REFERENCES test_assignments(id) ON DELETE CASCADE,
  report_type_id UUID NOT NULL REFERENCES report_types(id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT unique_test_assignment UNIQUE(test_assignment_id)
);

-- Create index on test_assignment_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_report_instances_test_assignment_id ON report_instances(test_assignment_id);

-- Create index on status for filtering by report status
CREATE INDEX IF NOT EXISTS idx_report_instances_status ON report_instances(status);

-- Add comment to table
COMMENT ON TABLE report_instances IS 'Stores individual report instances for test assignments, linking patients to specific report data';

-- Add comments to columns
COMMENT ON COLUMN report_instances.id IS 'Unique identifier for the report instance';
COMMENT ON COLUMN report_instances.test_assignment_id IS 'Foreign key to test_assignments table (one report instance per test assignment)';
COMMENT ON COLUMN report_instances.report_type_id IS 'Foreign key to report_types table indicating which report type this instance belongs to';
COMMENT ON COLUMN report_instances.status IS 'Current status of the report: pending (no data), in-progress (partial data), completed (all required fields filled)';
COMMENT ON COLUMN report_instances.created_by IS 'UUID of the user who created this report instance';
COMMENT ON COLUMN report_instances.created_at IS 'Timestamp when the report instance was created';
COMMENT ON COLUMN report_instances.updated_at IS 'Timestamp when the report instance was last updated';
COMMENT ON COLUMN report_instances.completed_at IS 'Timestamp when the report was marked as completed (all required fields filled)';
