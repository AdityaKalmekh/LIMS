-- Migration: Create report_fields table
-- Description: Creates the report_fields table to store field definitions for each report type
-- Date: 2025-01-XX
-- Task: 1.2 Create report_fields table migration
-- Requirement: 10.2

-- Create report_fields table
CREATE TABLE IF NOT EXISTS report_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_type_id UUID NOT NULL REFERENCES report_types(id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL,
  field_label VARCHAR(255) NOT NULL,
  field_type VARCHAR(50) NOT NULL, -- 'text', 'number', 'dropdown', 'textarea'
  field_order INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT false,
  unit VARCHAR(50),
  normal_range_min DECIMAL(10, 4),
  normal_range_max DECIMAL(10, 4),
  normal_range_text VARCHAR(255),
  dropdown_options JSONB, -- Array of options for dropdown fields
  default_value TEXT,
  validation_rules JSONB, -- Additional validation rules
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_report_type_field UNIQUE(report_type_id, field_name)
);

-- Create index on report_type_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_report_fields_report_type_id ON report_fields(report_type_id);

-- Create index on field_order for sorting fields
CREATE INDEX IF NOT EXISTS idx_report_fields_field_order ON report_fields(report_type_id, field_order);

-- Add comment to table
COMMENT ON TABLE report_fields IS 'Stores field definitions for each report type, enabling dynamic form generation';

-- Add comments to columns
COMMENT ON COLUMN report_fields.id IS 'Unique identifier for the report field';
COMMENT ON COLUMN report_fields.report_type_id IS 'Foreign key reference to the report type this field belongs to';
COMMENT ON COLUMN report_fields.field_name IS 'Internal name of the field (used as key in data storage)';
COMMENT ON COLUMN report_fields.field_label IS 'Human-readable label displayed in the form';
COMMENT ON COLUMN report_fields.field_type IS 'Type of input field: text, number, dropdown, or textarea';
COMMENT ON COLUMN report_fields.field_order IS 'Order in which the field should be displayed in the form';
COMMENT ON COLUMN report_fields.is_required IS 'Flag indicating whether this field must be filled';
COMMENT ON COLUMN report_fields.unit IS 'Unit of measurement for numeric fields (e.g., gm/dl, /Cumm.)';
COMMENT ON COLUMN report_fields.normal_range_min IS 'Minimum value of the normal range for numeric fields';
COMMENT ON COLUMN report_fields.normal_range_max IS 'Maximum value of the normal range for numeric fields';
COMMENT ON COLUMN report_fields.normal_range_text IS 'Text representation of the normal range (e.g., "13-17")';
COMMENT ON COLUMN report_fields.dropdown_options IS 'JSON array of options for dropdown fields';
COMMENT ON COLUMN report_fields.default_value IS 'Default value to pre-populate in the field';
COMMENT ON COLUMN report_fields.validation_rules IS 'JSON object containing additional validation rules';
COMMENT ON COLUMN report_fields.created_at IS 'Timestamp when the field definition was created';
