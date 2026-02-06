-- Migration: Seed report types data
-- Description: Inserts Blood Group and CBC report types with their field definitions
-- Date: 2025-01-XX
-- Task: 1.5 Create seed data migration for Blood Group and CBC report types
-- Requirements: 6.1, 6.2, 6.3, 7.1, 7.3, 7.4

-- ============================================================================
-- BLOOD GROUP REPORT TYPE
-- ============================================================================

-- Insert Blood Group report type
INSERT INTO report_types (code, name, description, is_active)
VALUES (
  'BLOOD_GROUP',
  'Blood Group Test',
  'Determines blood type and Rh factor',
  true
)
ON CONFLICT (code) DO NOTHING;

-- Insert Blood Group field: Blood Group dropdown
INSERT INTO report_fields (
  report_type_id,
  field_name,
  field_label,
  field_type,
  field_order,
  is_required,
  dropdown_options
)
VALUES (
  (SELECT id FROM report_types WHERE code = 'BLOOD_GROUP'),
  'blood_group',
  'Blood Group',
  'dropdown',
  1,
  true,
  '["A", "B", "AB", "O"]'::jsonb
)
ON CONFLICT (report_type_id, field_name) DO NOTHING;

-- Insert Blood Group field: Rh Factor dropdown
INSERT INTO report_fields (
  report_type_id,
  field_name,
  field_label,
  field_type,
  field_order,
  is_required,
  dropdown_options
)
VALUES (
  (SELECT id FROM report_types WHERE code = 'BLOOD_GROUP'),
  'rh_factor',
  'Rh Factor',
  'dropdown',
  2,
  true,
  '["POSITIVE", "NEGATIVE"]'::jsonb
)
ON CONFLICT (report_type_id, field_name) DO NOTHING;

-- ============================================================================
-- CBC (COMPLETE BLOOD COUNT) REPORT TYPE
-- ============================================================================

-- Insert CBC report type
INSERT INTO report_types (code, name, description, is_active)
VALUES (
  'CBC',
  'Complete Blood Count',
  'Comprehensive blood cell analysis',
  true
)
ON CONFLICT (code) DO NOTHING;

-- Insert CBC field 1: Hb (Haemoglobin)
INSERT INTO report_fields (
  report_type_id,
  field_name,
  field_label,
  field_type,
  field_order,
  is_required,
  unit,
  normal_range_min,
  normal_range_max,
  normal_range_text
)
VALUES (
  (SELECT id FROM report_types WHERE code = 'CBC'),
  'hb',
  'Hb (Haemoglobin)',
  'number',
  1,
  true,
  'gm/dl',
  13.0,
  17.0,
  '13-17'
)
ON CONFLICT (report_type_id, field_name) DO NOTHING;

-- Insert CBC field 2: Total Leukocyte Count
INSERT INTO report_fields (
  report_type_id,
  field_name,
  field_label,
  field_type,
  field_order,
  is_required,
  unit,
  normal_range_min,
  normal_range_max,
  normal_range_text
)
VALUES (
  (SELECT id FROM report_types WHERE code = 'CBC'),
  'total_leukocyte_count',
  'Total Leukocyte Count',
  'number',
  2,
  true,
  '/Cumm.',
  4000.0,
  11000.0,
  '4000-11000'
)
ON CONFLICT (report_type_id, field_name) DO NOTHING;

-- Insert CBC field 3: RBC
INSERT INTO report_fields (
  report_type_id,
  field_name,
  field_label,
  field_type,
  field_order,
  is_required,
  unit,
  normal_range_min,
  normal_range_max,
  normal_range_text
)
VALUES (
  (SELECT id FROM report_types WHERE code = 'CBC'),
  'rbc',
  'RBC',
  'number',
  3,
  true,
  'mill/cumm',
  4.5,
  5.5,
  '4.5-5.5'
)
ON CONFLICT (report_type_id, field_name) DO NOTHING;

-- Insert CBC field 4: PCV/Haematocrit
INSERT INTO report_fields (
  report_type_id,
  field_name,
  field_label,
  field_type,
  field_order,
  is_required,
  unit,
  normal_range_min,
  normal_range_max,
  normal_range_text
)
VALUES (
  (SELECT id FROM report_types WHERE code = 'CBC'),
  'pcv_haematocrit',
  'PCV/Haematocrit',
  'number',
  4,
  true,
  '%',
  40.0,
  50.0,
  '40-50'
)
ON CONFLICT (report_type_id, field_name) DO NOTHING;

-- Insert CBC field 5: Platelet Count
INSERT INTO report_fields (
  report_type_id,
  field_name,
  field_label,
  field_type,
  field_order,
  is_required,
  unit,
  normal_range_min,
  normal_range_max,
  normal_range_text
)
VALUES (
  (SELECT id FROM report_types WHERE code = 'CBC'),
  'platelet_count',
  'Platelet Count',
  'number',
  5,
  true,
  'lakhs/cumm',
  1.5,
  4.5,
  '1.5-4.5'
)
ON CONFLICT (report_type_id, field_name) DO NOTHING;

-- Insert CBC field 6: MCV
INSERT INTO report_fields (
  report_type_id,
  field_name,
  field_label,
  field_type,
  field_order,
  is_required,
  unit,
  normal_range_min,
  normal_range_max,
  normal_range_text
)
VALUES (
  (SELECT id FROM report_types WHERE code = 'CBC'),
  'mcv',
  'MCV',
  'number',
  6,
  true,
  'fL',
  83.0,
  101.0,
  '83-101'
)
ON CONFLICT (report_type_id, field_name) DO NOTHING;

-- Insert CBC field 7: MCH
INSERT INTO report_fields (
  report_type_id,
  field_name,
  field_label,
  field_type,
  field_order,
  is_required,
  unit,
  normal_range_min,
  normal_range_max,
  normal_range_text
)
VALUES (
  (SELECT id FROM report_types WHERE code = 'CBC'),
  'mch',
  'MCH',
  'number',
  7,
  true,
  'pg',
  27.0,
  32.0,
  '27-32'
)
ON CONFLICT (report_type_id, field_name) DO NOTHING;

-- Insert CBC field 8: MCHC
INSERT INTO report_fields (
  report_type_id,
  field_name,
  field_label,
  field_type,
  field_order,
  is_required,
  unit,
  normal_range_min,
  normal_range_max,
  normal_range_text
)
VALUES (
  (SELECT id FROM report_types WHERE code = 'CBC'),
  'mchc',
  'MCHC',
  'number',
  8,
  true,
  'g/dL',
  31.5,
  34.5,
  '31.5-34.5'
)
ON CONFLICT (report_type_id, field_name) DO NOTHING;

-- Insert CBC field 9: RDW-CV
INSERT INTO report_fields (
  report_type_id,
  field_name,
  field_label,
  field_type,
  field_order,
  is_required,
  unit,
  normal_range_min,
  normal_range_max,
  normal_range_text
)
VALUES (
  (SELECT id FROM report_types WHERE code = 'CBC'),
  'rdw_cv',
  'RDW-CV',
  'number',
  9,
  true,
  '%',
  11.6,
  14.0,
  '11.6-14.0'
)
ON CONFLICT (report_type_id, field_name) DO NOTHING;

-- Insert CBC field 10: Neutrophil
INSERT INTO report_fields (
  report_type_id,
  field_name,
  field_label,
  field_type,
  field_order,
  is_required,
  unit,
  normal_range_min,
  normal_range_max,
  normal_range_text
)
VALUES (
  (SELECT id FROM report_types WHERE code = 'CBC'),
  'neutrophil',
  'Neutrophil',
  'number',
  10,
  true,
  '%',
  40.0,
  80.0,
  '40-80'
)
ON CONFLICT (report_type_id, field_name) DO NOTHING;

-- Insert CBC field 11: Lymphocyte
INSERT INTO report_fields (
  report_type_id,
  field_name,
  field_label,
  field_type,
  field_order,
  is_required,
  unit,
  normal_range_min,
  normal_range_max,
  normal_range_text
)
VALUES (
  (SELECT id FROM report_types WHERE code = 'CBC'),
  'lymphocyte',
  'Lymphocyte',
  'number',
  11,
  true,
  '%',
  20.0,
  40.0,
  '20-40'
)
ON CONFLICT (report_type_id, field_name) DO NOTHING;

-- Insert CBC field 12: Monocyte
INSERT INTO report_fields (
  report_type_id,
  field_name,
  field_label,
  field_type,
  field_order,
  is_required,
  unit,
  normal_range_min,
  normal_range_max,
  normal_range_text
)
VALUES (
  (SELECT id FROM report_types WHERE code = 'CBC'),
  'monocyte',
  'Monocyte',
  'number',
  12,
  true,
  '%',
  2.0,
  10.0,
  '2-10'
)
ON CONFLICT (report_type_id, field_name) DO NOTHING;

-- Insert CBC field 13: Eosinophil
INSERT INTO report_fields (
  report_type_id,
  field_name,
  field_label,
  field_type,
  field_order,
  is_required,
  unit,
  normal_range_min,
  normal_range_max,
  normal_range_text
)
VALUES (
  (SELECT id FROM report_types WHERE code = 'CBC'),
  'eosinophil',
  'Eosinophil',
  'number',
  13,
  true,
  '%',
  1.0,
  6.0,
  '1-6'
)
ON CONFLICT (report_type_id, field_name) DO NOTHING;

-- Insert CBC field 14: Basophil
INSERT INTO report_fields (
  report_type_id,
  field_name,
  field_label,
  field_type,
  field_order,
  is_required,
  unit,
  normal_range_min,
  normal_range_max,
  normal_range_text
)
VALUES (
  (SELECT id FROM report_types WHERE code = 'CBC'),
  'basophil',
  'Basophil',
  'number',
  14,
  true,
  '%',
  0.0,
  1.0,
  '0-1'
)
ON CONFLICT (report_type_id, field_name) DO NOTHING;

-- Insert CBC field 15: Platelet on Smear (dropdown)
INSERT INTO report_fields (
  report_type_id,
  field_name,
  field_label,
  field_type,
  field_order,
  is_required,
  dropdown_options,
  default_value
)
VALUES (
  (SELECT id FROM report_types WHERE code = 'CBC'),
  'platelet_on_smear',
  'Platelet on Smear',
  'dropdown',
  15,
  false,
  '["Adequate", "Increased", "Decreased"]'::jsonb,
  'Adequate'
)
ON CONFLICT (report_type_id, field_name) DO NOTHING;

-- Insert CBC field 16: Malarial Parasite (dropdown)
INSERT INTO report_fields (
  report_type_id,
  field_name,
  field_label,
  field_type,
  field_order,
  is_required,
  dropdown_options,
  default_value
)
VALUES (
  (SELECT id FROM report_types WHERE code = 'CBC'),
  'malarial_parasite',
  'Malarial Parasite',
  'dropdown',
  16,
  false,
  '["NO MALARIAL PARASITE SEEN IN SMEAR EXAMINED", "Plasmodium Falciparum", "Plasmodium Vivax", "Plasmodium Ovale", "Plasmodium Malariae"]'::jsonb,
  'NO MALARIAL PARASITE SEEN IN SMEAR EXAMINED'
)
ON CONFLICT (report_type_id, field_name) DO NOTHING;

-- Add comments
COMMENT ON TABLE report_types IS 'Stores definitions of different medical test report types';
COMMENT ON TABLE report_fields IS 'Stores field definitions for each report type, enabling dynamic form generation';
