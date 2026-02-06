-- Rollback Migration: Seed report types data
-- Description: Removes Blood Group and CBC report types and their field definitions
-- Date: 2025-01-XX
-- Task: 1.5 Create seed data migration for Blood Group and CBC report types (Rollback)

-- Delete report fields for CBC report type
-- (CASCADE will handle this automatically, but being explicit for clarity)
DELETE FROM report_fields
WHERE report_type_id IN (
  SELECT id FROM report_types WHERE code IN ('CBC', 'BLOOD_GROUP')
);

-- Delete report types
DELETE FROM report_types WHERE code = 'CBC';
DELETE FROM report_types WHERE code = 'BLOOD_GROUP';
