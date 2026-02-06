-- SQL Script to Create Test Data for Patient Test Reports Integration
-- Run this script in the Supabase SQL Editor to create test patients and test assignments
-- 
-- This will create:
-- - 2 test patients (John Doe and Jane Smith)
-- - 3 test assignments (Blood Group and CBC tests)

-- Note: Replace 'YOUR_USER_ID_HERE' with an actual user ID from auth.users table
-- You can get a user ID by running: SELECT id FROM auth.users LIMIT 1;

-- First, let's get a user ID (you'll need to replace this with an actual user ID)
-- Run this query first to get a user ID:
-- SELECT id FROM auth.users LIMIT 1;

-- For now, we'll use a placeholder. Replace this with your actual user ID:
DO $$
DECLARE
  v_user_id UUID;
  v_patient1_id UUID;
  v_patient2_id UUID;
BEGIN
  -- Get the first user from auth.users (or create a test user if needed)
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  -- If no user exists, you'll need to create one through the Supabase Auth UI first
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found in auth.users. Please create a user first.';
  END IF;
  
  RAISE NOTICE 'Using user ID: %', v_user_id;
  
  -- Create test patient 1: John Doe
  INSERT INTO patients (
    mobile_number,
    title,
    first_name,
    last_name,
    sex,
    age_years,
    age_months,
    age_days,
    created_by
  ) VALUES (
    '+91-555-0101',
    'Mr.',
    'John',
    'Doe',
    'Male',
    35,
    0,
    0,
    v_user_id
  )
  ON CONFLICT (mobile_number) DO UPDATE
  SET 
    title = EXCLUDED.title,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    sex = EXCLUDED.sex,
    age_years = EXCLUDED.age_years,
    updated_at = NOW()
  RETURNING id INTO v_patient1_id;
  
  RAISE NOTICE 'Created/Updated patient 1: John Doe (ID: %)', v_patient1_id;
  
  -- Create test patient 2: Jane Smith
  INSERT INTO patients (
    mobile_number,
    title,
    first_name,
    last_name,
    sex,
    age_years,
    age_months,
    age_days,
    created_by
  ) VALUES (
    '+91-555-0102',
    'Ms.',
    'Jane',
    'Smith',
    'Female',
    28,
    0,
    0,
    v_user_id
  )
  ON CONFLICT (mobile_number) DO UPDATE
  SET 
    title = EXCLUDED.title,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    sex = EXCLUDED.sex,
    age_years = EXCLUDED.age_years,
    updated_at = NOW()
  RETURNING id INTO v_patient2_id;
  
  RAISE NOTICE 'Created/Updated patient 2: Jane Smith (ID: %)', v_patient2_id;
  
  -- Create test assignment 1: Blood Group for John Doe
  INSERT INTO test_assignments (
    patient_id,
    test_type,
    status,
    assigned_by
  ) VALUES (
    v_patient1_id,
    'BG',
    'pending',
    v_user_id
  )
  ON CONFLICT (patient_id, test_type) DO UPDATE
  SET 
    status = EXCLUDED.status,
    updated_at = NOW();
  
  RAISE NOTICE 'Created/Updated Blood Group test assignment for John Doe';
  
  -- Create test assignment 2: CBC for John Doe
  INSERT INTO test_assignments (
    patient_id,
    test_type,
    status,
    assigned_by
  ) VALUES (
    v_patient1_id,
    'CBC',
    'pending',
    v_user_id
  )
  ON CONFLICT (patient_id, test_type) DO UPDATE
  SET 
    status = EXCLUDED.status,
    updated_at = NOW();
  
  RAISE NOTICE 'Created/Updated CBC test assignment for John Doe';
  
  -- Create test assignment 3: Blood Group for Jane Smith
  INSERT INTO test_assignments (
    patient_id,
    test_type,
    status,
    assigned_by
  ) VALUES (
    v_patient2_id,
    'BG',
    'pending',
    v_user_id
  )
  ON CONFLICT (patient_id, test_type) DO UPDATE
  SET 
    status = EXCLUDED.status,
    updated_at = NOW();
  
  RAISE NOTICE 'Created/Updated Blood Group test assignment for Jane Smith';
  
  RAISE NOTICE 'Test data creation completed successfully!';
  RAISE NOTICE 'You can now test the Reports page at http://localhost:3000/reports';
END $$;

-- Verify the data was created
SELECT 
  p.id,
  p.title || ' ' || p.first_name || ' ' || COALESCE(p.last_name, '') as patient_name,
  p.mobile_number,
  p.sex,
  p.age_years,
  COUNT(ta.id) as test_count
FROM patients p
LEFT JOIN test_assignments ta ON p.id = ta.patient_id
WHERE p.mobile_number IN ('+91-555-0101', '+91-555-0102')
GROUP BY p.id, p.title, p.first_name, p.last_name, p.mobile_number, p.sex, p.age_years
ORDER BY p.created_at DESC;

-- Show test assignments
SELECT 
  ta.id,
  p.title || ' ' || p.first_name || ' ' || COALESCE(p.last_name, '') as patient_name,
  ta.test_type,
  ta.status,
  ta.assigned_at
FROM test_assignments ta
JOIN patients p ON ta.patient_id = p.id
WHERE p.mobile_number IN ('+91-555-0101', '+91-555-0102')
ORDER BY ta.assigned_at DESC;
