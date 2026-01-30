# Task 6: Patient Data Management - Testing Guide

## Quick Start Testing

### Prerequisites
1. Supabase project is set up and running
2. Environment variables are configured in `.env.local`
3. Database migrations have been applied
4. RLS policies are enabled

### Start the Development Server

```bash
cd lims-app
npm run dev
```

The application will be available at `http://localhost:3000`

## Test Scenarios

### Scenario 1: Successful Patient Registration

**Steps:**
1. Navigate to `http://localhost:3000`
2. Log in with your admin credentials
3. Click the "New" button in the dashboard header
4. Fill in the patient registration form:
   - Mobile Number: `+919876543210`
   - Title: `Mr.`
   - First Name: `John`
   - Last Name: `Doe`
   - Sex: `Male`
   - Age Years: `30`
   - Age Months: `6`
   - Age Days: `15`
   - Referred By: `Dr. Smith`
5. Click "Register Patient"

**Expected Results:**
- ✅ Form submits successfully
- ✅ Green success toast appears: "Patient Registered Successfully"
- ✅ Toast description shows: "Mr. John Doe has been registered."
- ✅ Form resets to default values
- ✅ Modal closes (if using modal)
- ✅ Patient list refreshes (if implemented)

### Scenario 2: Validation Errors

**Test Invalid Mobile Number:**
1. Open patient registration form
2. Enter mobile number: `9876543210` (missing +91)
3. Fill other required fields
4. Click "Register Patient"

**Expected Results:**
- ❌ Form shows validation error
- ❌ Error message: "Mobile number must be in format +91XXXXXXXXXX"

**Test Missing Required Fields:**
1. Open patient registration form
2. Leave First Name empty
3. Click "Register Patient"

**Expected Results:**
- ❌ Form shows validation error
- ❌ Error message: "First name is required"

**Test Invalid Age:**
1. Open patient registration form
2. Enter Age Months: `15` (should be 0-11)
3. Fill other required fields
4. Click "Register Patient"

**Expected Results:**
- ❌ Form shows validation error
- ❌ Error message: "Months must be between 0 and 11"

### Scenario 3: Authentication Required

**Steps:**
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Clear all cookies (to log out)
4. Try to submit patient registration form

**Expected Results:**
- ❌ Red error toast appears: "Authentication Required"
- ❌ Toast description: "Please log in to continue"

### Scenario 4: Network Error

**Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Enable "Offline" mode
4. Try to submit patient registration form

**Expected Results:**
- ❌ Red error toast appears: "Network Error"
- ❌ Toast description: "Failed to connect to the server. Please try again."

### Scenario 5: Fetch Patients with Pagination

**Using Browser DevTools:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run the following code:

```javascript
// Fetch first page (10 patients)
fetch('/api/patients?page=1&limit=10')
  .then(res => res.json())
  .then(data => console.log('Page 1:', data))

// Fetch second page
fetch('/api/patients?page=2&limit=10')
  .then(res => res.json())
  .then(data => console.log('Page 2:', data))

// Fetch with custom limit
fetch('/api/patients?page=1&limit=5')
  .then(res => res.json())
  .then(data => console.log('5 patients:', data))
```

**Expected Results:**
- ✅ Returns JSON with `success: true`
- ✅ Returns `data` array with patient objects
- ✅ Returns `pagination` object with:
  - `page`: Current page number
  - `limit`: Items per page
  - `total`: Total number of patients
  - `totalPages`: Total number of pages
  - `hasMore`: Boolean indicating more pages

## API Testing with cURL

### Test POST /api/patients

**Successful Request:**
```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SESSION_COOKIE" \
  -d '{
    "mobileNumber": "+919876543210",
    "title": "Mr.",
    "firstName": "John",
    "lastName": "Doe",
    "sex": "Male",
    "ageYears": 30,
    "ageMonths": 6,
    "ageDays": 15,
    "referredBy": "Dr. Smith"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Patient registered successfully",
  "data": {
    "id": "uuid-here",
    "mobileNumber": "+919876543210",
    "title": "Mr.",
    "firstName": "John",
    "lastName": "Doe",
    "sex": "Male",
    "ageYears": 30,
    "ageMonths": 6,
    "ageDays": 15,
    "referredBy": "Dr. Smith",
    "createdAt": "2024-01-01T00:00:00Z",
    "createdBy": "user-uuid",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Invalid Request (Missing Required Field):**
```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SESSION_COOKIE" \
  -d '{
    "mobileNumber": "+919876543210",
    "title": "Mr.",
    "sex": "Male",
    "ageYears": 30
  }'
```

**Expected Response (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Please check your input and try again",
  "errors": [
    {
      "field": "firstName",
      "message": "First name is required"
    }
  ]
}
```

### Test GET /api/patients

**Fetch First Page:**
```bash
curl http://localhost:3000/api/patients?page=1&limit=10 \
  -H "Cookie: YOUR_SESSION_COOKIE"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "mobileNumber": "+919876543210",
      "title": "Mr.",
      "firstName": "John",
      "lastName": "Doe",
      "sex": "Male",
      "ageYears": 30,
      "ageMonths": 6,
      "ageDays": 15,
      "referredBy": "Dr. Smith",
      "createdAt": "2024-01-01T00:00:00Z",
      "createdBy": "user-uuid",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasMore": true
  }
}
```

## Database Verification

### Check Patient Records in Supabase

1. Go to your Supabase project dashboard
2. Navigate to Table Editor
3. Select the `patients` table
4. Verify the newly created patient record appears
5. Check that all fields are correctly populated:
   - `mobile_number` should be in format `+91XXXXXXXXXX`
   - `created_by` should match your user ID
   - `created_at` should be the current timestamp

### SQL Query to Verify

```sql
-- View all patients
SELECT * FROM patients ORDER BY created_at DESC;

-- Count total patients
SELECT COUNT(*) FROM patients;

-- View patients created by specific user
SELECT * FROM patients WHERE created_by = 'your-user-id';

-- View recent patients (last 10)
SELECT * FROM patients ORDER BY created_at DESC LIMIT 10;
```

## Troubleshooting

### Issue: 401 Unauthorized Error

**Cause:** User is not authenticated or session expired

**Solution:**
1. Log out and log back in
2. Check that cookies are enabled in browser
3. Verify Supabase Auth is configured correctly
4. Check `.env.local` has correct Supabase credentials

### Issue: 500 Internal Server Error

**Cause:** Database connection or query error

**Solution:**
1. Check Supabase project is running
2. Verify database migrations have been applied
3. Check RLS policies are configured correctly
4. Review server logs for detailed error messages

### Issue: Validation Errors Not Showing

**Cause:** Client-side validation may be bypassed

**Solution:**
1. Check browser console for JavaScript errors
2. Verify Zod schema is correctly imported
3. Ensure react-hook-form is properly configured

### Issue: Form Not Resetting After Success

**Cause:** Reset function not called or callback not triggered

**Solution:**
1. Check that `onSuccess` callback is called
2. Verify `reset()` function is called in success handler
3. Check for JavaScript errors in console

## Performance Testing

### Test Pagination Performance

Create multiple patients and test pagination:

```javascript
// Create 50 test patients
for (let i = 1; i <= 50; i++) {
  fetch('/api/patients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mobileNumber: `+9198765432${i.toString().padStart(2, '0')}`,
      title: 'Mr.',
      firstName: `Patient${i}`,
      lastName: 'Test',
      sex: 'Male',
      ageYears: 25 + i,
      ageMonths: 0,
      ageDays: 0,
      referredBy: 'Test'
    })
  })
}

// Test pagination
fetch('/api/patients?page=1&limit=10')
  .then(res => res.json())
  .then(data => console.log('Page 1:', data.pagination))
```

### Expected Performance

- API response time: < 500ms
- Form submission: < 1 second
- Page load: < 2 seconds

## Success Criteria

All tests should pass with the following results:

- ✅ Patient registration works with valid data
- ✅ Validation errors are shown for invalid data
- ✅ Authentication is required for all endpoints
- ✅ Success toast appears after registration
- ✅ Form resets after successful submission
- ✅ Pagination works correctly
- ✅ Data is correctly stored in Supabase
- ✅ No TypeScript errors
- ✅ No console errors in browser

## Next Steps

After verifying all tests pass:

1. Proceed to Task 7: Patient List Display
2. Implement PatientList component to display registered patients
3. Add search and filter functionality
4. Implement edit and delete operations (future enhancement)
