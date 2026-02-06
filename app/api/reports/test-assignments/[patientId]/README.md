# Test Assignments by Patient API Endpoint

## Overview

This API endpoint fetches test assignments for a specific patient with their report status. It joins the `test_assignments` table with the `report_instances` table to determine the current status of each report (pending, in-progress, or completed).

## Endpoint

```
GET /api/reports/test-assignments/[patientId]
```

## Authentication

This endpoint requires authentication via Supabase Auth. The user must be logged in to access test assignments.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| patientId | UUID | Yes | The unique identifier of the patient |

## Response Format

### Success Response (200 OK)

```json
{
  "testAssignments": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "testName": "Complete Blood Count",
      "assignedDate": "2025-01-15T10:30:00Z",
      "reportStatus": "pending",
      "reportTypeCode": "CBC"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "testName": "Blood Group",
      "assignedDate": "2025-01-15T10:30:00Z",
      "reportStatus": "in-progress",
      "reportTypeCode": "BLOOD_GROUP"
    }
  ]
}
```

### Empty Response (200 OK)

When a patient has no test assignments:

```json
{
  "testAssignments": []
}
```

## Error Responses

### 400 Bad Request - Invalid Patient ID

```json
{
  "success": false,
  "error": "Invalid patient ID",
  "message": "Patient ID must be a valid UUID"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "You must be logged in to view test assignments"
}
```

### 404 Not Found - Patient Not Found

```json
{
  "success": false,
  "error": "Patient not found",
  "message": "No patient found with ID: 550e8400-e29b-41d4-a716-446655440000"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Database error",
  "message": "Failed to fetch test assignments. Please try again."
}
```

## Data Mapping

### Test Type to Report Type Code

| Test Type (DB) | Report Type Code | Display Name |
|----------------|------------------|--------------|
| CBC | CBC | Complete Blood Count |
| BG | BLOOD_GROUP | Blood Group |
| VDRL | VDRL | VDRL Test |

### Report Status

The report status is determined by checking the `report_instances` table:

- **pending**: No report instance exists for the test assignment
- **in-progress**: Report instance exists with status 'in-progress'
- **completed**: Report instance exists with status 'completed'

## Database Queries

### 1. Verify Patient Exists

```sql
SELECT id FROM patients WHERE id = $patientId
```

### 2. Fetch Test Assignments

```sql
SELECT id, test_type, assigned_at, status
FROM test_assignments
WHERE patient_id = $patientId
ORDER BY assigned_at DESC
```

### 3. Fetch Report Instances

```sql
SELECT test_assignment_id, status
FROM report_instances
WHERE test_assignment_id IN ($testAssignmentIds)
```

## Usage Example

### JavaScript/TypeScript

```typescript
async function fetchTestAssignments(patientId: string) {
  const response = await fetch(`/api/reports/test-assignments/${patientId}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }
  
  const data = await response.json()
  return data.testAssignments
}

// Usage
try {
  const assignments = await fetchTestAssignments('550e8400-e29b-41d4-a716-446655440000')
  console.log('Test assignments:', assignments)
} catch (error) {
  console.error('Failed to fetch test assignments:', error)
}
```

### cURL

```bash
curl -X GET \
  'http://localhost:3000/api/reports/test-assignments/550e8400-e29b-41d4-a716-446655440000' \
  -H 'Cookie: your-auth-cookie'
```

## Requirements Validation

This endpoint satisfies the following requirements:

- **Requirement 2.1**: Displays all test assignments for a patient
- **Requirement 2.2**: Shows test name and assignment date
- **Requirement 2.3**: Indicates report status (pending, in-progress, completed)

## Related Endpoints

- `GET /api/reports/patients` - Fetch all patients with test assignments
- `POST /api/test-assignments` - Create new test assignments

## Notes

- Test assignments are ordered by `assigned_at` in descending order (most recent first)
- If report instances cannot be fetched, the endpoint defaults all statuses to 'pending' and continues
- The endpoint validates the patient ID format before querying the database
- The endpoint verifies the patient exists before fetching test assignments
