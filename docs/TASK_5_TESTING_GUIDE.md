# Task 5: Patient Registration Form - Testing Guide

## Manual Testing Instructions

### Prerequisites
1. Development server running: `npm run dev`
2. Navigate to: http://localhost:3000
3. Login with valid credentials

### Test Case 1: Open Patient Registration Modal

**Steps:**
1. Navigate to the dashboard
2. Click the "New" button in the header (blue button with plus icon)

**Expected Result:**
- Modal opens with title "Register New Patient"
- Form displays with all fields visible
- Modal is centered and responsive

### Test Case 2: Form Field Validation - Required Fields

**Steps:**
1. Open the patient registration modal
2. Click "Register Patient" button without filling any fields

**Expected Result:**
- Error messages appear for required fields:
  - Mobile number: "Mobile number is required"
  - Title: "Please select a valid title"
  - First name: "First name is required"
  - Sex: "Please select a valid option"
  - Age Years: "Age in years is required"

### Test Case 3: Mobile Number Validation

**Test 3.1: Invalid Format**
**Steps:**
1. Enter mobile number: "9876543210" (without +91)
2. Tab out of the field

**Expected Result:**
- Error: "Mobile number must be in format +91XXXXXXXXXX (10 digits)"

**Test 3.2: Incomplete Number**
**Steps:**
1. Enter mobile number: "+91123"
2. Tab out of the field

**Expected Result:**
- Error: "Mobile number must be in format +91XXXXXXXXXX (10 digits)"

**Test 3.3: Valid Format**
**Steps:**
1. Enter mobile number: "+919876543210"
2. Tab out of the field

**Expected Result:**
- No error message
- Field border returns to normal

### Test Case 4: Title Dropdown

**Steps:**
1. Click on the Title dropdown
2. Verify all options are visible

**Expected Result:**
- Dropdown opens with 6 options:
  - Mr.
  - Mrs.
  - Ms.
  - Dr.
  - Master
  - Miss
- Selecting an option updates the field
- No error message after selection

### Test Case 5: Name Fields

**Test 5.1: First Name Required**
**Steps:**
1. Leave first name empty
2. Try to submit form

**Expected Result:**
- Error: "First name is required"

**Test 5.2: First Name Max Length**
**Steps:**
1. Enter 101 characters in first name
2. Tab out of the field

**Expected Result:**
- Error: "First name must be less than 100 characters"

**Test 5.3: Last Name Optional**
**Steps:**
1. Fill all required fields
2. Leave last name empty
3. Submit form

**Expected Result:**
- Form submits successfully
- No error for last name

### Test Case 6: Sex Radio Buttons

**Steps:**
1. Click each radio button option (Male, Female, Other)
2. Verify selection changes

**Expected Result:**
- Only one option can be selected at a time
- Visual feedback shows selected option
- No error after selection

### Test Case 7: Age Validation

**Test 7.1: Age Years Required**
**Steps:**
1. Leave age years empty
2. Try to submit

**Expected Result:**
- Error: "Age in years is required"

**Test 7.2: Age Years Range**
**Steps:**
1. Enter -5 in age years
2. Tab out

**Expected Result:**
- Error: "Age cannot be negative"

**Steps:**
1. Enter 200 in age years
2. Tab out

**Expected Result:**
- Error: "Please enter a valid age"

**Test 7.3: Age Months Range**
**Steps:**
1. Enter 15 in age months
2. Tab out

**Expected Result:**
- Error: "Months must be between 0 and 11"

**Test 7.4: Age Days Range**
**Steps:**
1. Enter 35 in age days
2. Tab out

**Expected Result:**
- Error: "Days must be between 0 and 30"

**Test 7.5: Valid Age**
**Steps:**
1. Enter: Years: 45, Months: 6, Days: 15
2. Tab out

**Expected Result:**
- No error messages
- All fields accept the values

### Test Case 8: Referred By Field (Optional)

**Steps:**
1. Fill all required fields
2. Leave "Referred By" empty
3. Submit form

**Expected Result:**
- Form submits successfully
- No error for referred by field

### Test Case 9: Successful Form Submission

**Steps:**
1. Fill all required fields with valid data:
   - Mobile: +919876543210
   - Title: Dr.
   - First Name: John
   - Last Name: Doe
   - Sex: Male
   - Age Years: 45
   - Age Months: 6
   - Age Days: 15
   - Referred By: Dr. Smith
2. Click "Register Patient" button

**Expected Result:**
- Loading spinner appears on button
- Button text changes to "Registering..."
- After 1 second (simulated delay):
  - Modal closes
  - Success toast appears: "Patient registered successfully"
  - Toast description shows: "Dr. John Doe has been registered."

### Test Case 10: Cancel Button

**Steps:**
1. Open modal
2. Fill some fields
3. Click "Cancel" button

**Expected Result:**
- Modal closes immediately
- No data is saved
- No toast notification

### Test Case 11: Close Modal (X button)

**Steps:**
1. Open modal
2. Click the X button in top-right corner

**Expected Result:**
- Modal closes immediately
- No data is saved

### Test Case 12: Mobile Responsiveness

**Test 12.1: Mobile View (< 640px)**
**Steps:**
1. Resize browser to mobile width (e.g., 375px)
2. Open patient registration modal

**Expected Result:**
- Modal takes full width with padding
- All fields stack vertically
- Name fields stack vertically (not side-by-side)
- Age inputs remain in 3-column grid
- Action buttons stack vertically
- "New" button shows only icon (no text)
- Modal is scrollable if content exceeds viewport

**Test 12.2: Tablet View (640px - 1024px)**
**Steps:**
1. Resize browser to tablet width (e.g., 768px)
2. Open patient registration modal

**Expected Result:**
- Modal width is constrained (max-w-2xl)
- Name fields display side-by-side
- Sex radio buttons display horizontally
- Action buttons display horizontally
- All content is readable and accessible

**Test 12.3: Desktop View (> 1024px)**
**Steps:**
1. View on desktop width (e.g., 1440px)
2. Open patient registration modal

**Expected Result:**
- Modal is centered with max-width
- All fields properly spaced
- Two-column layout for name fields
- Horizontal layout for sex options
- Horizontal layout for action buttons

### Test Case 13: Keyboard Navigation

**Steps:**
1. Open modal
2. Use Tab key to navigate through fields
3. Use Enter to submit form
4. Use Escape to close modal

**Expected Result:**
- Tab moves focus through all fields in logical order
- Focus indicators are visible
- Enter submits form when on submit button
- Escape closes modal

### Test Case 14: Loading State

**Steps:**
1. Fill form with valid data
2. Click "Register Patient"
3. Observe button during submission

**Expected Result:**
- Button becomes disabled
- Spinner icon appears
- Text changes to "Registering..."
- Cancel button is disabled
- Form fields remain visible but not editable

### Test Case 15: Error State Styling

**Steps:**
1. Submit form with invalid data
2. Observe fields with errors

**Expected Result:**
- Invalid fields have red border
- Error message appears below field in red text
- Error message is clear and actionable
- Multiple errors can display simultaneously

## Automated Testing (Future)

### Unit Tests to Write
- [ ] Validation schema tests
- [ ] Form submission logic tests
- [ ] Error handling tests
- [ ] Component rendering tests

### Integration Tests to Write
- [ ] Modal open/close flow
- [ ] Form submission with API
- [ ] Toast notification display
- [ ] Patient list refresh after registration

### E2E Tests to Write
- [ ] Complete registration flow
- [ ] Validation error scenarios
- [ ] Mobile responsive behavior
- [ ] Keyboard navigation

## Known Issues

None at this time.

## Browser Compatibility

Tested on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Accessibility Checklist

- [x] All form fields have labels
- [x] Required fields are marked
- [x] Error messages are associated with fields
- [x] Keyboard navigation works
- [x] Focus indicators are visible
- [x] Color contrast meets WCAG AA standards
- [x] Screen reader compatible (semantic HTML)

## Performance Checklist

- [x] Form renders quickly
- [x] No unnecessary re-renders
- [x] Validation is responsive
- [x] Modal opens/closes smoothly
- [x] No layout shifts

## Next Steps

After manual testing is complete:
1. Proceed to Task 6.1: Create API route for patient creation
2. Implement actual data persistence
3. Add patient list refresh functionality
4. Write automated tests
