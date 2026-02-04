# Task 12: Integration Testing - Quick Start Guide

## Overview

This guide helps you quickly start integration testing for the Patient Report Assignment feature.

## Prerequisites

✅ **Already Completed:**
- Database schema created (test_assignments table)
- API routes implemented
- UI components built
- Navigation added
- Responsive design implemented

## Quick Start Steps

### Step 1: Verify Development Server

The development server should already be running at:
- **URL:** http://localhost:3000
- **Alternative:** http://localhost:3001 (if port 3000 is busy)

If not running, start it:
```bash
cd lims-app
npm run dev
```

### Step 2: Verify Database Setup

Check if migrations have been run:

1. Go to your Supabase project: https://spfomsintwbxvqkkwowk.supabase.co
2. Navigate to SQL Editor
3. Run this query:

```sql
-- Check if test_assignments table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'test_assignments'
);
```

If the table doesn't exist, run the migration:
```sql
-- Copy and paste the contents of:
-- lims-app/supabase/migrations/003_create_test_assignments_table.sql
```

### Step 3: Create Test Data (If Needed)

If you don't have any patients in the database, create some test patients:

1. Log in to the application at http://localhost:3000
2. Navigate to Dashboard
3. Click "New Patient" button
4. Fill in patient details and submit
5. Repeat to create 3-5 test patients

### Step 4: Start Testing

1. **Open the application:** http://localhost:3000
2. **Log in** with your credentials
3. **Click "Patient Route"** in the sidebar
4. **Follow the testing checklist** in `TASK_12_INTEGRATION_TESTING.md`

## Quick Test Workflow

### Minimal Test (5 minutes)

1. ✅ Navigate to Patient Route page
2. ✅ Verify patients are displayed
3. ✅ Select a patient (checkbox)
4. ✅ Assign a test (dropdown)
5. ✅ Submit assignment
6. ✅ Verify success message
7. ✅ Verify patient removed from list

### Full Test (30 minutes)

Follow the complete checklist in `TASK_12_INTEGRATION_TESTING.md`

## Common Issues & Solutions

### Issue 1: Page Not Loading

**Symptoms:** Blank page or error message

**Solutions:**
- Check browser console for errors (F12)
- Verify dev server is running
- Check network tab for failed API calls
- Verify you're logged in

### Issue 2: No Patients Displayed

**Symptoms:** Empty state message appears

**Possible Causes:**
1. No patients in database → Create test patients
2. All patients already assigned → Check database or create new patients
3. API error → Check browser console and server logs

**Check Database:**
```sql
-- Count total patients
SELECT COUNT(*) FROM patients;

-- Count unassigned patients
SELECT COUNT(*) 
FROM patients p
LEFT JOIN test_assignments ta ON p.id = ta.patient_id
WHERE ta.id IS NULL;
```

### Issue 3: Submission Fails

**Symptoms:** Error message after clicking submit

**Solutions:**
- Check browser console for error details
- Verify you assigned at least one test to each selected patient
- Check network tab for API response
- Verify database connection

### Issue 4: Validation Error

**Symptoms:** "Please assign at least one test to: [Patient Name]"

**This is expected behavior!** You must assign at least one test to each selected patient before submitting.

**Solution:** Open the test dropdown and select at least one test (CBC, BG, or VDRL)

## Testing Checklist Summary

Use this quick checklist to track your progress:

- [ ] **Navigation:** Patient Route link works
- [ ] **Display:** Patients shown in table/cards
- [ ] **Selection:** Can select patients with checkboxes
- [ ] **Tests:** Can assign tests via dropdown
- [ ] **Validation:** Error shown when no tests assigned
- [ ] **Submission:** Can submit assignments successfully
- [ ] **Success:** Success message appears
- [ ] **Removal:** Patients removed from list after submission
- [ ] **Responsive:** Works on mobile (resize browser)
- [ ] **Database:** Records created in test_assignments table

## Verification Queries

### Check Test Assignments

```sql
-- View recent test assignments
SELECT 
  ta.id,
  p.first_name || ' ' || p.last_name as patient_name,
  ta.test_type,
  ta.status,
  ta.assigned_at
FROM test_assignments ta
JOIN patients p ON ta.patient_id = p.id
ORDER BY ta.assigned_at DESC
LIMIT 10;
```

### Check Unassigned Patients

```sql
-- List patients without any test assignments
SELECT 
  p.id,
  p.first_name || ' ' || p.last_name as patient_name,
  p.mobile_number
FROM patients p
LEFT JOIN test_assignments ta ON p.id = ta.patient_id
WHERE ta.id IS NULL;
```

### Check Patient with Multiple Tests

```sql
-- View all tests for a specific patient
SELECT 
  p.first_name || ' ' || p.last_name as patient_name,
  ta.test_type,
  ta.status,
  ta.assigned_at
FROM test_assignments ta
JOIN patients p ON ta.patient_id = p.id
WHERE p.id = '[PATIENT_ID]'
ORDER BY ta.assigned_at;
```

## Browser DevTools Tips

### Network Tab
- Monitor API calls to `/api/patients/unassigned` and `/api/test-assignments`
- Check request/response payloads
- Verify status codes (200, 201, 400, 401, 500)

### Console Tab
- Look for JavaScript errors
- Check for warning messages
- Monitor state changes (if logging is enabled)

### Responsive Design Mode
- Press F12 to open DevTools
- Click device icon (or Ctrl+Shift+M)
- Select mobile device (iPhone, Android)
- Test touch interactions

## Next Steps

After completing integration testing:

1. ✅ Document any issues found
2. ✅ Fix critical bugs
3. ✅ Re-test after fixes
4. ✅ Mark task as complete
5. ✅ Move to next feature or deployment

## Need Help?

If you encounter issues:

1. Check the detailed testing guide: `TASK_12_INTEGRATION_TESTING.md`
2. Review the requirements: `.kiro/specs/patient-report-assignment/requirements.md`
3. Check the design document: `.kiro/specs/patient-report-assignment/design.md`
4. Review API documentation: `lims-app/docs/TEST_ASSIGNMENTS_API.md`

## Success Criteria

The feature is ready when:

✅ All critical tests pass
✅ No blocking bugs found
✅ Responsive design works on mobile and desktop
✅ Database records are created correctly
✅ User experience is smooth and intuitive

---

**Good luck with testing! 🚀**
