# Task 12: Integration Testing Checklist
## Patient Report Assignment Feature

This document provides a comprehensive checklist for integration testing the patient-report-assignment feature.

## Overview

The Patient Report Assignment feature allows administrators to:
- View all registered patients who haven't been assigned to lab tests
- Select multiple patients
- Assign lab tests (CBC, BG, VDRL) to each patient
- Submit assignments to transition patients into the reports workflow

## Pre-Testing Setup

### 1. Verify Database Migrations
Ensure the test_assignments table has been created:

```sql
-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'test_assignments'
);

-- Check table structure
\d test_assignments
```

### 2. Verify Test Data
Ensure you have test patients in the database:

```sql
-- Check patient count
SELECT COUNT(*) FROM patients;

-- View unassigned patients
SELECT p.* 
FROM patients p
LEFT JOIN test_assignments ta ON p.id = ta.patient_id
WHERE ta.id IS NULL;
```

### 3. Verify Server is Running
- Development server should be running at: http://localhost:3000
- Check console for any startup errors

## Integration Testing Checklist

### ✅ Test 1: Navigation Access
**Requirement: 7.1, 7.2, 7.3**

- [ ] Open http://localhost:3000 in browser
- [ ] Log in with valid credentials
- [ ] Verify "Patient Route" link appears in sidebar
- [ ] Click "Patient Route" link
- [ ] Verify navigation to /patient-route page
- [ ] Verify "Patient Route" is highlighted in sidebar (active state)

**Expected Result:** Page loads successfully, navigation works correctly

---

### ✅ Test 2: Display Registered Patients
**Requirement: 1.1, 1.2, 1.5**

#### Scenario A: Patients Exist
- [ ] Navigate to /patient-route page
- [ ] Verify page title "Patient Route" is displayed
- [ ] Verify subtitle "Assign lab tests to registered patients" is displayed
- [ ] Verify patients are displayed in table format (desktop)
- [ ] Verify all columns are present:
  - [ ] Selection checkbox
  - [ ] Patient Name (with title, first name, last name)
  - [ ] Mobile Number
  - [ ] Sex
  - [ ] Age (formatted as XY XM XD)
  - [ ] Referred By
  - [ ] Tests dropdown

**Expected Result:** All patient information is displayed correctly in table format

#### Scenario B: No Patients Exist
- [ ] Ensure all patients have test assignments (or delete test patients)
- [ ] Navigate to /patient-route page
- [ ] Verify empty state message is displayed
- [ ] Verify message includes icon and text "No unassigned patients"

**Expected Result:** Empty state displays correctly

---

### ✅ Test 3: Test Selection Functionality
**Requirement: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**

- [ ] Click on "Select tests" dropdown for a patient
- [ ] Verify dropdown opens with three test options:
  - [ ] CBC (Complete Blood Count)
  - [ ] BG (Blood Glucose)
  - [ ] VDRL (Venereal Disease Research Laboratory)
- [ ] Verify all checkboxes are initially unchecked
- [ ] Check CBC checkbox
- [ ] Verify checkbox is checked
- [ ] Verify dropdown button shows "1 test selected"
- [ ] Check BG checkbox
- [ ] Verify dropdown button shows "2 tests selected"
- [ ] Uncheck CBC checkbox
- [ ] Verify dropdown button shows "1 test selected"
- [ ] Check VDRL checkbox
- [ ] Verify dropdown button shows "2 tests selected"
- [ ] Close dropdown and reopen
- [ ] Verify selections are maintained

**Expected Result:** Test selection works correctly, count updates accurately

---

### ✅ Test 4: Patient Selection Functionality
**Requirement: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

- [ ] Click checkbox next to first patient
- [ ] Verify checkbox is checked
- [ ] Verify patient row is highlighted (blue background)
- [ ] Verify submit button is enabled
- [ ] Verify submit button shows count badge "1"
- [ ] Click checkbox next to second patient
- [ ] Verify both patients are highlighted
- [ ] Verify submit button shows count badge "2"
- [ ] Click first patient checkbox again
- [ ] Verify first patient is deselected (no highlight)
- [ ] Verify submit button shows count badge "1"
- [ ] Deselect all patients
- [ ] Verify submit button is disabled

**Expected Result:** Patient selection works correctly, UI updates appropriately

---

### ✅ Test 5: Validation - No Tests Assigned
**Requirement: 4.4, 4.5**

- [ ] Select a patient (check the checkbox)
- [ ] Do NOT assign any tests to the patient
- [ ] Click "Submit Assignments" button
- [ ] Verify validation error message appears
- [ ] Verify error message includes patient name
- [ ] Verify error message says "Please assign at least one test to: [Patient Name]"
- [ ] Verify no API call is made (check Network tab)
- [ ] Verify patient remains selected

**Expected Result:** Validation prevents submission, clear error message displayed

---

### ✅ Test 6: Validation - Multiple Patients Without Tests
**Requirement: 4.4, 4.5**

- [ ] Select three patients
- [ ] Assign tests to only one patient
- [ ] Click "Submit Assignments" button
- [ ] Verify validation error appears
- [ ] Verify error lists all patients without tests
- [ ] Verify format: "Please assign at least one test to: Patient1, Patient2"

**Expected Result:** Validation catches all patients without tests

---

### ✅ Test 7: Successful Submission - Single Patient
**Requirement: 4.6, 4.7, 4.8, 4.9, 5.2**

- [ ] Select one patient
- [ ] Assign at least one test (e.g., CBC)
- [ ] Click "Submit Assignments" button
- [ ] Verify loading state appears (button shows "Submitting...")
- [ ] Verify success message appears
- [ ] Verify success message says "Successfully assigned tests to 1 patient"
- [ ] Verify patient is removed from the list
- [ ] Verify selection state is cleared
- [ ] Open browser DevTools Network tab
- [ ] Verify POST request to /api/test-assignments was made
- [ ] Verify response status is 201

**Expected Result:** Assignment succeeds, patient removed from list, success message shown

---

### ✅ Test 8: Successful Submission - Multiple Patients
**Requirement: 4.6, 4.7, 4.8, 4.9, 5.5**

- [ ] Select three patients
- [ ] Assign different tests to each:
  - Patient 1: CBC
  - Patient 2: BG, VDRL
  - Patient 3: CBC, BG, VDRL
- [ ] Click "Submit Assignments" button
- [ ] Verify success message says "Successfully assigned tests to 3 patients"
- [ ] Verify all three patients are removed from the list
- [ ] Verify database has correct records:
  - [ ] Patient 1 has 1 test_assignment record
  - [ ] Patient 2 has 2 test_assignment records
  - [ ] Patient 3 has 3 test_assignment records

**Expected Result:** Multiple assignments succeed, all patients removed

---

### ✅ Test 9: Database Verification
**Requirement: 5.1, 5.2, 5.3, 5.4, 5.5**

After successful submission, verify database records:

```sql
-- Check test_assignments table
SELECT * FROM test_assignments ORDER BY created_at DESC LIMIT 10;

-- Verify required fields are populated
SELECT 
  id,
  patient_id,
  test_type,
  status,
  assigned_at,
  assigned_by,
  created_at
FROM test_assignments
WHERE patient_id = '[PATIENT_ID]';

-- Verify unique constraint (should fail if duplicate)
-- Try to insert duplicate patient-test combination
```

- [ ] Verify all required fields are populated
- [ ] Verify status is 'pending'
- [ ] Verify assigned_by is current user's ID
- [ ] Verify assigned_at timestamp is correct
- [ ] Verify unique constraint prevents duplicates

**Expected Result:** Database records are correct and complete

---

### ✅ Test 10: Error Handling - API Failure
**Requirement: 1.4, 4.8**

#### Scenario A: Network Error
- [ ] Open browser DevTools
- [ ] Go to Network tab, enable "Offline" mode
- [ ] Try to load /patient-route page
- [ ] Verify error message appears
- [ ] Verify "Try Again" button is displayed
- [ ] Disable offline mode
- [ ] Click "Try Again" button
- [ ] Verify page loads successfully

**Expected Result:** Error state displays correctly, retry works

#### Scenario B: Submission Error
- [ ] Temporarily modify API to return error (or disconnect network during submission)
- [ ] Select patient and assign tests
- [ ] Click "Submit Assignments"
- [ ] Verify error message appears
- [ ] Verify selection state is maintained (patient still selected)
- [ ] Verify patient is NOT removed from list

**Expected Result:** Error handled gracefully, state preserved

---

### ✅ Test 11: Responsive Design - Desktop
**Requirement: 8.1**

Test on desktop screen (1920x1080 or larger):

- [ ] Navigate to /patient-route page
- [ ] Verify table layout is displayed
- [ ] Verify all columns are visible
- [ ] Verify sidebar is always visible
- [ ] Verify no horizontal scrolling required
- [ ] Verify checkboxes are easy to click
- [ ] Verify dropdowns open correctly

**Expected Result:** Desktop layout works perfectly

---

### ✅ Test 12: Responsive Design - Tablet
**Requirement: 8.2**

Test on tablet screen (768px - 1024px):

- [ ] Resize browser to tablet size
- [ ] Verify layout adapts appropriately
- [ ] Verify table remains usable
- [ ] Verify all controls are accessible

**Expected Result:** Tablet layout is functional

---

### ✅ Test 13: Responsive Design - Mobile
**Requirement: 8.2, 8.3**

Test on mobile screen (375px - 414px):

- [ ] Resize browser to mobile size (or use device emulation)
- [ ] Verify layout switches to card view
- [ ] Verify each patient is displayed as a card
- [ ] Verify all patient information is visible in card
- [ ] Verify checkbox is accessible (larger touch target)
- [ ] Verify test dropdown works on mobile
- [ ] Verify submit button is accessible
- [ ] Verify sidebar becomes a drawer (hamburger menu)
- [ ] Test touch interactions:
  - [ ] Tap checkbox to select patient
  - [ ] Tap dropdown to open test selection
  - [ ] Tap test checkboxes
  - [ ] Tap submit button

**Expected Result:** Mobile layout is fully functional with touch-friendly controls

---

### ✅ Test 14: Concurrent Access
**Requirement: 6.1, 6.2, 6.3, 6.4**

Test with two browser windows/tabs:

- [ ] Open /patient-route in two different browser windows
- [ ] In Window 1: Select and assign tests to Patient A
- [ ] In Window 2: Select and assign tests to Patient A
- [ ] In Window 1: Submit assignments
- [ ] Verify success in Window 1
- [ ] In Window 2: Try to submit assignments
- [ ] Verify appropriate error or handling in Window 2
- [ ] Refresh Window 2
- [ ] Verify Patient A no longer appears in list

**Expected Result:** Concurrent access is handled gracefully

---

### ✅ Test 15: Page Refresh Behavior
**Requirement: 6.4**

- [ ] Select multiple patients
- [ ] Assign tests to selected patients
- [ ] Refresh the page (F5 or Ctrl+R)
- [ ] Verify selection state is cleared
- [ ] Verify test assignments are cleared
- [ ] Verify patient list is reloaded from database

**Expected Result:** Page refresh clears state and reloads data

---

### ✅ Test 16: Accessibility Testing
**Requirement: 8.3**

- [ ] Test keyboard navigation:
  - [ ] Tab through all interactive elements
  - [ ] Verify focus indicators are visible
  - [ ] Press Space to toggle checkboxes
  - [ ] Press Enter to open dropdowns
  - [ ] Press Escape to close dropdowns
- [ ] Test screen reader (if available):
  - [ ] Verify labels are read correctly
  - [ ] Verify checkbox states are announced
  - [ ] Verify button states are announced
- [ ] Test color contrast:
  - [ ] Verify text is readable
  - [ ] Verify selected states are distinguishable

**Expected Result:** Feature is accessible to all users

---

## Performance Testing

### Test 17: Large Dataset Performance

- [ ] Add 50+ patients to database
- [ ] Navigate to /patient-route page
- [ ] Verify page loads in reasonable time (< 2 seconds)
- [ ] Verify scrolling is smooth
- [ ] Verify interactions are responsive

**Expected Result:** Performance is acceptable with large datasets

---

## Security Testing

### Test 18: Authentication Required

- [ ] Log out of the application
- [ ] Try to access /patient-route directly
- [ ] Verify redirect to login page
- [ ] Try to access /api/patients/unassigned directly
- [ ] Verify 401 Unauthorized response
- [ ] Try to access /api/test-assignments directly
- [ ] Verify 401 Unauthorized response

**Expected Result:** All endpoints require authentication

---

## Browser Compatibility Testing

### Test 19: Cross-Browser Testing

Test in multiple browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

For each browser:
- [ ] Verify page loads correctly
- [ ] Verify all functionality works
- [ ] Verify styling is consistent
- [ ] Verify no console errors

**Expected Result:** Feature works in all major browsers

---

## Final Verification

### Test 20: End-to-End Workflow

Complete the entire workflow from start to finish:

1. [ ] Log in to application
2. [ ] Navigate to Patient Route from sidebar
3. [ ] View list of unassigned patients
4. [ ] Select 2-3 patients
5. [ ] Assign different tests to each patient
6. [ ] Submit assignments
7. [ ] Verify success message
8. [ ] Verify patients removed from list
9. [ ] Verify database records created
10. [ ] Log out and log back in
11. [ ] Navigate to Patient Route again
12. [ ] Verify previously assigned patients don't appear

**Expected Result:** Complete workflow works seamlessly

---

## Known Issues / Notes

Document any issues found during testing:

1. Issue: [Description]
   - Steps to reproduce:
   - Expected behavior:
   - Actual behavior:
   - Severity: [Critical/High/Medium/Low]

---

## Sign-Off

- [ ] All critical tests passed
- [ ] All high-priority tests passed
- [ ] Known issues documented
- [ ] Feature ready for production

**Tested by:** _______________
**Date:** _______________
**Signature:** _______________

---

## Additional Resources

- Requirements Document: `.kiro/specs/patient-report-assignment/requirements.md`
- Design Document: `.kiro/specs/patient-report-assignment/design.md`
- Tasks Document: `.kiro/specs/patient-report-assignment/tasks.md`
- API Documentation: `lims-app/docs/TEST_ASSIGNMENTS_API.md`
