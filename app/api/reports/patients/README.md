# Reports Patients API Endpoint

## Overview

This endpoint fetches patients who have test assignments for display in the Reports section. It joins patient data with test assignments and report instances to provide a complete view of patients with their assigned tests and report statuses.

## Endpoint

```
GET /api/reports/patients
```

## Authentication

Requires authentication via Supabase Auth. The request must include a valid session token.

## Request

No query parameters required.

## Response

### Success Response (200 OK)

```json
{
  "patients": [
    {
      "id": "uuid",
      "name": "Mr. John Doe",
      "patientId": "uuid",
      "age": 35,
      "gender": "Male",
      "contact": "+919876543210",
      "testAssignments": [
        {
          "id": "uuid",
          "testName": "Complete Blood Count",
          "assignedDate": "2025-01-15T10:30:00Z",
          "reportStatus": "pending",
          "reportTypeCode": "CBC"
        },
        {
          "id": "uuid",
          "testName": "Blood Group",
          "assignedDate": "2025-01-15T10:30:00Z",
          "reportStatus": "in-progress",
          "reportTypeCode": "BLOOD_GROUP"
        }
      ]
    }
  ]
}
```

### Error Responses

#### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "You must be logged in to view patients with test assignments"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Database error",
  "message": "Failed to fetch patients with test assignments. Please try again."
}
```

## Implementation Details

### Database Queries

1. **Fetch Patients with Test Assignments**
   - Queries the `patients` table
   - Joins with `test_assignments` table
   - Filters to only include patients who have at least one test assignment
   - Orders by creation date (most recent first)

2. **Fetch Report Instances**
   - Queries the `report_instances` table
   - Gets report status for each test assignment
   - Maps test assignment IDs to report statuses

### Data Transformations

1. **Patient Name Formatting**
   - Combines title, first name, and last name
   - Format: `{title} {firstName} {lastName}`
   - Example: "Mr. John Doe"

2. **Age Calculation**
   - Combines years, months, and days into total age
   - Rounds to nearest year for display
   - Formula: `years + (months/12) + (days/365)`

3. **Test Type Mapping**
   - Maps database test type codes to display names:
     - `CBC` → "Complete Blood Count"
     - `BG` → "Blood Group"
     - `VDRL` → "VDRL Test"
   - Maps to report type codes:
     - `CBC` → "CBC"
     - `BG` → "BLOOD_GROUP"
     - `VDRL` → "VDRL"

4. **Report Status**
   - Defaults to "pending" if no report instance exists
   - Uses actual status from `report_instances` table if available
   - Possible values: "pending", "in-progress", "completed"

### Requirements Satisfied

- **Requirement 1.1**: Displays patients with assigned tests in Reports section
- **Requirement 1.2**: Shows patient name, ID, age, gender, and contact information
- **Requirement 2.4**: Retrieves test assignments from test_assignments table

## Testing

### Manual Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Ensure you're logged in to the application

3. Make a GET request to the endpoint:
   ```bash
   curl -X GET http://localhost:3000/api/reports/patients \
     -H "Cookie: your-session-cookie"
   ```

### Expected Behavior

- Returns empty array if no patients have test assignments
- Returns patients ordered by creation date (newest first)
- Each patient includes all their test assignments
- Report status reflects current state from report_instances table

## Database Schema Dependencies

### Tables Used

1. **patients**
   - `id`, `mobile_number`, `title`, `first_name`, `last_name`
   - `sex`, `age_years`, `age_months`, `age_days`
   - `created_at`

2. **test_assignments**
   - `id`, `patient_id`, `test_type`, `assigned_at`, `status`

3. **report_instances**
   - `test_assignment_id`, `status`

### Relationships

- `test_assignments.patient_id` → `patients.id`
- `report_instances.test_assignment_id` → `test_assignments.id`

## Error Handling

The endpoint handles the following error scenarios:

1. **Authentication Failure**: Returns 401 if user is not authenticated
2. **Database Query Failure**: Returns 500 if patient query fails
3. **Report Instance Query Failure**: Continues with default "pending" status
4. **Unexpected Errors**: Returns 500 with generic error message

## Performance Considerations

- Uses Supabase's nested select to fetch patients and test assignments in a single query
- Fetches all report instances in a second query to avoid N+1 problem
- Creates an in-memory map for O(1) status lookups
- Orders patients by creation date with database index support

## Future Enhancements

Potential improvements for future iterations:

1. Add pagination support for large patient lists
2. Add filtering by report status (pending, in-progress, completed)
3. Add search functionality by patient name or ID
4. Add sorting options (by name, date, status)
5. Include test assignment counts in response
6. Add caching for frequently accessed data
