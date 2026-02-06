-- Migration: Create report_values table
-- Description: Creates the report_values table using EAV (Entity-Attribute-Value) pattern to store field values for report instances
-- Date: 2025-01-XX
-- Task: 1.4 Create report_values table migration
-- Requirement: 10.3

-- Create report_values table
CREATE TABLE IF NOT EXISTS report_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_instance_id UUID NOT NULL REFERENCES report_instances(id) ON DELETE CASCADE,
  report_field_id UUID NOT NULL REFERENCES report_fields(id),
  value_text TEXT,
  value_number DECIMAL(10, 4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_instance_field UNIQUE(report_instance_id, report_field_id)
);

-- Create index on report_instance_id for faster lookups when retrieving all values for a report
CREATE INDEX IF NOT EXISTS idx_report_values_report_instance_id ON report_values(report_instance_id);

-- Add comment to table
COMMENT ON TABLE report_values IS 'Stores field values for report instances using EAV pattern, allowing flexible storage of different report types without schema changes';

-- Add comments to columns
COMMENT ON COLUMN report_values.id IS 'Unique identifier for the report value record';
COMMENT ON COLUMN report_values.report_instance_id IS 'Foreign key to report_instances table indicating which report this value belongs to';
COMMENT ON COLUMN report_values.report_field_id IS 'Foreign key to report_fields table indicating which field this value represents';
COMMENT ON COLUMN report_values.value_text IS 'Text value for text, dropdown, and textarea field types';
COMMENT ON COLUMN report_values.value_number IS 'Numeric value for number field types';
COMMENT ON COLUMN report_values.created_at IS 'Timestamp when the value was first created';
COMMENT ON COLUMN report_values.updated_at IS 'Timestamp when the value was last updated';
