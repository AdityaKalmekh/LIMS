-- Migration: Create patients table
-- Description: Creates the patients table with all required fields and constraints
-- Date: 2025-01-XX
-- Task: 2.2 Create patients table with schema

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mobile_number VARCHAR(15) NOT NULL,
  title VARCHAR(10) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  sex VARCHAR(10) NOT NULL CHECK (sex IN ('Male', 'Female', 'Other')),
  age_years INTEGER NOT NULL CHECK (age_years >= 0),
  age_months INTEGER CHECK (age_months >= 0 AND age_months < 12),
  age_days INTEGER CHECK (age_days >= 0 AND age_days < 31),
  referred_by VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_patients_mobile ON patients(mobile_number);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at DESC);

-- Add comment to table
COMMENT ON TABLE patients IS 'Stores patient registration information for the LIMS system';

-- Add comments to columns
COMMENT ON COLUMN patients.id IS 'Unique identifier for the patient';
COMMENT ON COLUMN patients.mobile_number IS 'Patient mobile number with country code (e.g., +91XXXXXXXXXX)';
COMMENT ON COLUMN patients.title IS 'Patient title (Mr., Mrs., Ms., Dr., etc.)';
COMMENT ON COLUMN patients.first_name IS 'Patient first name (required)';
COMMENT ON COLUMN patients.last_name IS 'Patient last name (optional)';
COMMENT ON COLUMN patients.sex IS 'Patient sex (Male, Female, or Other)';
COMMENT ON COLUMN patients.age_years IS 'Patient age in years';
COMMENT ON COLUMN patients.age_months IS 'Additional months for patient age (0-11)';
COMMENT ON COLUMN patients.age_days IS 'Additional days for patient age (0-30)';
COMMENT ON COLUMN patients.referred_by IS 'Name of the referring doctor or entity (optional)';
COMMENT ON COLUMN patients.created_at IS 'Timestamp when the patient record was created';
COMMENT ON COLUMN patients.created_by IS 'UUID of the admin user who created the record';
COMMENT ON COLUMN patients.updated_at IS 'Timestamp when the patient record was last updated';
