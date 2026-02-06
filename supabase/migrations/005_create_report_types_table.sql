-- Migration: Create report_types table
-- Description: Creates the report_types table to store definitions of different report types
-- Date: 2025-01-XX
-- Task: 1.1 Create report_types table migration
-- Requirement: 10.1

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create report_types table
CREATE TABLE IF NOT EXISTS report_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_report_types_code ON report_types(code);

-- Create index on is_active for filtering active report types
CREATE INDEX IF NOT EXISTS idx_report_types_is_active ON report_types(is_active);

-- Add comment to table
COMMENT ON TABLE report_types IS 'Stores definitions of different medical test report types';

-- Add comments to columns
COMMENT ON COLUMN report_types.id IS 'Unique identifier for the report type';
COMMENT ON COLUMN report_types.code IS 'Unique code identifier for the report type (e.g., BLOOD_GROUP, CBC)';
COMMENT ON COLUMN report_types.name IS 'Human-readable name of the report type';
COMMENT ON COLUMN report_types.description IS 'Optional description of what the report type is used for';
COMMENT ON COLUMN report_types.is_active IS 'Flag indicating whether this report type is currently active';
COMMENT ON COLUMN report_types.created_at IS 'Timestamp when the report type was created';
COMMENT ON COLUMN report_types.updated_at IS 'Timestamp when the report type was last updated';
