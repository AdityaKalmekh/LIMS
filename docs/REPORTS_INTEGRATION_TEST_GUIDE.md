# Patient Test Reports Integration Testing Guide

This guide provides step-by-step instructions for manually testing the complete integration of the Patient Test Report Management System.

## Prerequisites

1. **Development Server Running**: Ensure the Next.js development server is running
   ```bash
   cd lims-app
   npm run dev
   ```

2. **Database Migrations Applied**: All report system migrations should be applied
   - Check in Supabase Dashboard → Database → Migrations
   - Required migrations: 005-009 (report_types, report_fields, report_instances, report_values, seed data)

3. **Test Data Created**: Run the test data SQL script
   - Open Supabase Dashboard → SQL Editor
   - Copy and paste the contents of `scripts/create-test-data.sql`
   - Execute the script
   - Verify that 2 patients and 3 test assignments were created

4. **User Authenticated**: Log in to the application
   - Navigate to the login page
   - Sign in with your credentials

## Test Scenarios

### Test 1: Page Load and Patient Display

**Objective**: Verify that the Reports page loads correctly and displays patients with test assignments.

**Steps**:
1. Navigate to http://localhost:3000/reports
2. Observe the page layout

**Expected Results**:
- ✅ Page loads without errors
- ✅ Page header displays "Reports" title
- ✅ Three-column layout is visible:
  - Left column: "Patients" section
  - Middle column: "Test Assignments" section
  - Right column: "Report Form" section
- ✅ Patient list shows 2 patients:
  - Mr. John Doe (35 years, Male, +91-555-0101)
  - Ms. Jane Smith (28 years, Female, +91-555-0102)
- ✅ Each patient card shows:
  - Patient name with avatar icon
  - Patient ID (UUID)
  - Age and gender
  - Contact number
  - Badge showing number of pending tests
- ✅ First patient is auto-selected (highlighted with blue ring)

**Requirements Validated**: 1.1, 1.2

---

### Test 2: Patient Selection

**Objective**: Verify that clicking on a patient displays their test assignments.

**Steps**:
1. Click on "Ms. Jane Smith" in the patient list
2. Observe the test assignments section

**Expected Results**:
- ✅ Jane Smith's patient card is highlighted (blue ring)
- ✅ John Doe's patient card is no longer highlighted
- ✅ Test assignments section shows Jane Smith's tests:
  - Blood Group Test (Pending status)
- ✅ Test assignment card shows:
  - Test name with file icon
  - Assignment date (e.g., "Today" or "2 days ago")
  - Status badge (gray "Pending")
- ✅ Report form section shows message: "Select a test assignment to view and enter report data"

**Requirements Validated**: 2.1, 2.2, 2.3

---

### Test 3: Test Assignment Selection and Form Expansion

**Objective**: Verify that clicking on a test assignment expands the report form.

**Steps**:
1. Ensure John Doe is selected in the patient list
2. Click on "Blood Group Test" in the test assignments list
3. Observe the report form section

**Expected Results**:
- ✅ Blood Group Test card is highlighted (blue ring)
- ✅ Report form section displays:
  - Card with title "Blood Group Test"
  - Description (if any)
  - Loading indicator briefly appears
  - Form fields appear after loading:
    - "Blood Group" dropdown (required, marked with *)
    - "Rh Factor" dropdown (required, marked with *)
  - "Previous Report" and "Next Report" buttons at bottom left
  - "Save Report" button at bottom right
- ✅ Dropdowns show placeholder text initially
- ✅ Save button is disabled (required fields are empty)

**Requirements Validated**: 3.1, 3.3, 6.1, 6.2, 6.3

---

### Test 4: Form Expansion/Collapse Behavior

**Objective**: Verify that only one form is expanded at a time.

**Steps**:
1. Ensure Blood Group Test form is expanded
2. Click on "Complete Blood Count" test in the test assignments list
3. Observe the form transition

**Expected Results**:
- ✅ Blood Group Test form collapses
- ✅ Complete Blood Count form expands
- ✅ CBC form displays:
  - Card with title "Complete Blood Count"
  - Multiple sections:
    - RBC Parameters (7 fields)
    - WBC Parameters (6 fields)
    - Platelet Parameters (2 fields)
    - Other Tests (1 field)
  - All numeric fields show:
    - Field label with unit (e.g., "Hb (Haemoglobin)" - "gm/dl")
    - Input box
    - Normal range text below (e.g., "Normal Range: 13-17")
  - Dropdown fields show default values:
    - "Platelet on Smear": "Adequate"
    - "Malarial Parasite": "NO MALARIAL PARASITE SEEN IN SMEAR EXAMINED"
- ✅ Only CBC form is visible (Blood Group form is not visible)

**Requirements Validated**: 3.2, 7.1, 7.2, 7.3, 7.4

---

### Test 5: Blood Group Form Data Entry and Validation

**Objective**: Verify that data can be entered and validated in the Blood Group form.

**Steps**:
1. Click on "Blood Group Test" to expand it
2. Click on "Blood Group" dropdown
3. Select "A" from the options
4. Observe the save button state
5. Click on "Rh Factor" dropdown
6. Select "POSITIVE" from the options
7. Observe the save button state

**Expected Results**:
- ✅ Blood Group dropdown shows options: A, B, AB, O
- ✅ After selecting "A", the dropdown displays "A"
- ✅ Save button remains disabled (Rh Factor still empty)
- ✅ Rh Factor dropdown shows options: POSITIVE, NEGATIVE
- ✅ After selecting "POSITIVE", the dropdown displays "POSITIVE"
- ✅ Save button becomes enabled (all required fields filled)
- ✅ No validation errors are displayed

**Requirements Validated**: 6.1, 6.2, 6.3, 8.4, 8.5

---

### Test 6: Save Operation - Blood Group

**Objective**: Verify that report data can be saved successfully.

**Steps**:
1. Ensure Blood Group form has data entered (A, POSITIVE)
2. Click "Save Report" button
3. Observe the save feedback

**Expected Results**:
- ✅ Save button shows loading state:
  - Button text changes to "Saving..."
  - Spinner icon appears
  - Button is disabled
- ✅ After ~1-2 seconds, success feedback appears:
  - Green success alert: "Report saved successfully!"
  - Toast notification: "Report saved successfully"
- ✅ Success message disappears after 3 seconds
- ✅ Save button returns to normal state: "Save Report"
- ✅ Test assignment status badge updates to "In Progress" or "Completed" (yellow or green)
- ✅ Patient badge updates to reflect new status

**Requirements Validated**: 5.1, 5.3, 5.5, 11.2, 11.3, 13.1, 13.2, 13.4, 13.5

---

### Test 7: Data Persistence and Retrieval

**Objective**: Verify that saved data persists and can be retrieved.

**Steps**:
1. After saving Blood Group data, click on "Complete Blood Count" test
2. Then click back on "Blood Group Test"
3. Observe the form fields

**Expected Results**:
- ✅ Blood Group dropdown shows "A" (previously saved value)
- ✅ Rh Factor dropdown shows "POSITIVE" (previously saved value)
- ✅ Save button is enabled (form is valid)
- ✅ No loading errors occur

**Requirements Validated**: 3.3, 14.2, 14.3

---

### Test 8: CBC Form Data Entry with Validation

**Objective**: Verify numeric field validation and out-of-range indicators.

**Steps**:
1. Click on "Complete Blood Count" test to expand it
2. In the "Hb (Haemoglobin)" field, enter "15.5"
3. Observe the field state
4. In the "Hb (Haemoglobin)" field, change value to "10.0" (below normal range)
5. Observe the field state
6. In the "Total Leukocyte Count" field, enter "abc" (non-numeric)
7. Observe the field state

**Expected Results**:
- ✅ After entering "15.5":
  - Value is accepted
  - No error or warning (within normal range 13-17)
  - Field has normal border
- ✅ After entering "10.0":
  - Value is accepted
  - Yellow warning icon appears next to field
  - Yellow border on input field
  - Warning text: "Value is outside normal range"
  - Save button remains enabled (out-of-range values are allowed)
- ✅ After entering "abc":
  - Red error border on input field
  - Error message: "Must be a valid number"
  - Save button becomes disabled
  - Cannot save with invalid data

**Requirements Validated**: 8.1, 8.2, 8.3, 8.4

---

### Test 9: CBC Form Complete Data Entry and Save

**Objective**: Verify that a complete CBC report can be entered and saved.

**Steps**:
1. Ensure CBC form is expanded
2. Enter valid numeric values for all required fields:
   - Hb: 15.5
   - Total Leukocyte Count: 8000
   - RBC: 5.0
   - PCV/Haematocrit: 45
   - Platelet Count: 250000
   - MCV: 85
   - MCH: 28
   - MCHC: 33
   - RDW-CV: 13
   - Neutrophil: 60
   - Lymphocyte: 30
   - Monocyte: 5
   - Eosinophil: 3
   - Basophil: 1
3. Verify dropdown defaults are set:
   - Platelet on Smear: "Adequate"
   - Malarial Parasite: "NO MALARIAL PARASITE SEEN IN SMEAR EXAMINED"
4. Click "Save Report"
5. Observe the save operation

**Expected Results**:
- ✅ All numeric fields accept the values
- ✅ No validation errors appear
- ✅ Save button is enabled
- ✅ Save operation succeeds with success message
- ✅ Test assignment status updates to "Completed" (green badge)
- ✅ Patient badge shows "All complete" or reduced test count

**Requirements Validated**: 7.1, 7.3, 7.4, 5.3, 9.2, 9.3

---

### Test 10: Keyboard Navigation - Right Arrow

**Objective**: Verify that pressing the right arrow key navigates to the next test.

**Steps**:
1. Ensure John Doe is selected (has 2 test assignments)
2. Click on "Blood Group Test" to expand it
3. Press the Right Arrow key on your keyboard
4. Observe the form change

**Expected Results**:
- ✅ Blood Group Test form collapses
- ✅ Complete Blood Count form expands automatically
- ✅ CBC test assignment card is highlighted
- ✅ Previously entered CBC data is displayed (if any)
- ✅ Keyboard navigation hint appears at bottom: "Use ← → arrow keys to navigate between reports"

**Requirements Validated**: 4.1

---

### Test 11: Keyboard Navigation - Left Arrow

**Objective**: Verify that pressing the left arrow key navigates to the previous test.

**Steps**:
1. Ensure CBC form is expanded (from previous test)
2. Press the Left Arrow key on your keyboard
3. Observe the form change

**Expected Results**:
- ✅ CBC form collapses
- ✅ Blood Group Test form expands automatically
- ✅ Blood Group test assignment card is highlighted
- ✅ Previously saved Blood Group data is displayed (A, POSITIVE)

**Requirements Validated**: 4.2

---

### Test 12: Keyboard Navigation - Boundary Conditions

**Objective**: Verify that keyboard navigation respects list boundaries.

**Steps**:
1. Ensure Blood Group Test form is expanded (first test)
2. Press the Left Arrow key multiple times
3. Observe the behavior
4. Press the Right Arrow key to navigate to CBC (last test)
5. Press the Right Arrow key multiple times
6. Observe the behavior

**Expected Results**:
- ✅ When on first test, pressing Left Arrow does nothing (stays on first test)
- ✅ No error occurs
- ✅ When on last test, pressing Right Arrow does nothing (stays on last test)
- ✅ No error occurs

**Requirements Validated**: 4.3, 4.4

---

### Test 13: Keyboard Navigation - No Selection

**Objective**: Verify that arrow keys have no effect when no test is selected.

**Steps**:
1. Click on the currently expanded test to collapse it (click the same test again)
2. Verify no form is displayed
3. Press Left Arrow and Right Arrow keys
4. Observe the behavior

**Expected Results**:
- ✅ Report form section shows: "Select a test assignment to view and enter report data"
- ✅ Pressing arrow keys has no effect
- ✅ No form expands
- ✅ No errors occur

**Requirements Validated**: 4.5

---

### Test 14: Navigation Buttons

**Objective**: Verify that Previous/Next buttons work correctly.

**Steps**:
1. Click on Blood Group Test to expand it
2. Click "Next Report" button
3. Observe the form change
4. Click "Previous Report" button
5. Observe the form change

**Expected Results**:
- ✅ "Next Report" button navigates to CBC form
- ✅ "Previous Report" button navigates back to Blood Group form
- ✅ Buttons work the same as arrow keys
- ✅ Buttons are disabled during save operations

**Requirements Validated**: 4.1, 4.2

---

### Test 15: Unsaved Changes Preservation

**Objective**: Verify that unsaved changes are preserved when navigating away and back.

**Steps**:
1. Click on Blood Group Test to expand it
2. Change Blood Group to "B" (don't save)
3. Click on CBC test to navigate away
4. Click back on Blood Group Test
5. Observe the Blood Group field

**Expected Results**:
- ✅ Blood Group field shows "B" (unsaved change preserved)
- ✅ Form state is maintained in memory
- ✅ No data loss occurs

**Requirements Validated**: 3.4

---

### Test 16: Save Error Handling

**Objective**: Verify that save errors are handled gracefully.

**Steps**:
1. Stop the development server (Ctrl+C in terminal)
2. In the browser, try to save a report
3. Observe the error handling
4. Restart the development server
5. Verify the entered data is still in the form

**Expected Results**:
- ✅ Save operation fails
- ✅ Error message appears: "Failed to save report. Please try again."
- ✅ Red error alert is displayed
- ✅ Toast notification shows error
- ✅ Entered data remains in form fields (not lost)
- ✅ Save button returns to enabled state
- ✅ User can retry the save operation

**Requirements Validated**: 5.6, 11.4

---

### Test 17: Status Updates After Save

**Objective**: Verify that report status updates correctly after saving.

**Steps**:
1. Select Jane Smith (who has only Blood Group test)
2. Click on Blood Group Test
3. Enter partial data: Blood Group = "O", leave Rh Factor empty
4. Try to save
5. Observe the status
6. Fill in Rh Factor = "NEGATIVE"
7. Save the report
8. Observe the status change

**Expected Results**:
- ✅ With partial data, save button is disabled (required field empty)
- ✅ After filling all required fields, save succeeds
- ✅ Test assignment status badge updates from "Pending" (gray) to "Completed" (green)
- ✅ Patient badge updates to show "All complete"
- ✅ Status update is immediate (no page refresh needed)

**Requirements Validated**: 9.1, 9.2, 9.3, 9.4, 9.5, 11.5

---

### Test 18: Multiple Patients Workflow

**Objective**: Verify that switching between patients works correctly.

**Steps**:
1. Select John Doe
2. Expand and view Blood Group Test (should show saved data: A, POSITIVE)
3. Select Jane Smith
4. Expand and view Blood Group Test (should show saved data: O, NEGATIVE)
5. Select John Doe again
6. Verify Blood Group Test still shows: A, POSITIVE

**Expected Results**:
- ✅ Each patient's data is independent
- ✅ Switching patients loads correct test assignments
- ✅ Switching patients loads correct report data
- ✅ No data mixing between patients
- ✅ Previously selected test is cleared when switching patients

**Requirements Validated**: All requirements (end-to-end workflow)

---

### Test 19: Empty State Handling

**Objective**: Verify that empty states are displayed correctly.

**Steps**:
1. In Supabase, temporarily delete all test assignments
2. Refresh the Reports page
3. Observe the display

**Expected Results**:
- ✅ Patient list shows patients (if any exist)
- ✅ Test assignments section shows: "No test assignments - This patient has no assigned tests"
- ✅ Report form section shows: "Select a test assignment to view and enter report data"
- ✅ No errors occur

**Requirements Validated**: 1.4

---

### Test 20: Responsive Layout

**Objective**: Verify that the layout works on different screen sizes.

**Steps**:
1. Open browser developer tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)
4. Observe the layout

**Expected Results**:
- ✅ Desktop: Three-column layout side by side
- ✅ Tablet: Columns stack vertically or adjust width
- ✅ Mobile: Single column layout
- ✅ All content remains accessible
- ✅ No horizontal scrolling
- ✅ Forms remain usable on all screen sizes

**Requirements Validated**: 12.1, 12.3, 12.4

---

## Test Summary Checklist

After completing all tests, verify the following:

### Data Flow
- [ ] Patients load correctly from database
- [ ] Test assignments load for selected patient
- [ ] Report type definitions load correctly
- [ ] Existing report data loads into forms
- [ ] New report data saves to database
- [ ] Saved data can be retrieved and edited

### Keyboard Navigation
- [ ] Right arrow navigates to next test
- [ ] Left arrow navigates to previous test
- [ ] Navigation respects list boundaries
- [ ] Arrow keys have no effect when no test selected
- [ ] Navigation buttons work correctly

### Save Operations
- [ ] Save button state management works
- [ ] Loading indicator appears during save
- [ ] Success message appears after save
- [ ] Error handling works correctly
- [ ] Status updates after save
- [ ] Data persists across navigation

### Form Expansion/Collapse
- [ ] Only one form expanded at a time
- [ ] Forms expand/collapse smoothly
- [ ] Unsaved changes preserved during navigation
- [ ] Form state maintained correctly

### Report Types
- [ ] Blood Group form renders correctly
- [ ] Blood Group validation works
- [ ] Blood Group save works
- [ ] CBC form renders correctly
- [ ] CBC validation works (numeric, required, range)
- [ ] CBC save works
- [ ] Out-of-range indicators display correctly

### UI/UX
- [ ] Page loads without errors
- [ ] Layout is responsive
- [ ] Visual feedback is clear
- [ ] Error messages are helpful
- [ ] Status badges are distinct
- [ ] Loading states are visible

## Known Issues

Document any issues found during testing:

1. **Issue**: [Description]
   - **Steps to Reproduce**: [Steps]
   - **Expected**: [Expected behavior]
   - **Actual**: [Actual behavior]
   - **Severity**: [Critical/High/Medium/Low]

## Test Results

- **Date Tested**: [Date]
- **Tested By**: [Name]
- **Environment**: [Development/Staging/Production]
- **Browser**: [Chrome/Firefox/Safari/Edge]
- **Overall Result**: [Pass/Fail]
- **Tests Passed**: [X/20]
- **Tests Failed**: [X/20]

## Notes

Add any additional observations or comments here.
