# Unassigned Patients API Endpoint

## Overview

This endpoint fetches patients who have not been assigned to any lab tests. It's used by the Patient Route page to display available patients for test assignment.

## Endpoint

```
GET /api/patients/unassigned
```

## Authentication

Requires a valid Supabase authentication session. The user must be logged in.

## Query Parameters

| Parameter | Type   | Default | Max | Description                           |
|-----------|--------|---------|-----|---------------------------------------|
| page      | number | 1       | -   | Page number for pagination            |
| limit     | number | 50      | 100 | Number of patients per page           |

## Response Format

### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "mobileNumber": "+91XXXXXXXXXX",
      "title": "Mr.",
      "firstName": "John",
      "lastName": "Doe",
      "sex": "Male",
      "ageYears": 30,
      "ageMonths": 6,
      "ageDays": 15,
      "referredBy": "Dr. Smith",
      "createdAt": "2025-01-15T10:30:00Z",
      "createdBy": "uuid",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2,
    "hasMore": true
  }
}
```

### Error Responses

#### 401 Unauthorized

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "You must be logged in to view patients"
}
```

#### 500 Server Error

```json
{
  "success": false,
  "error": "Database error",
  "message": "Failed to fetch unassigned patients. Please try again."
}
```

## Implementation Details

### Filtering Logic

The endpoint excludes patients who have any test assignments by:

1. Fetching all patient IDs from the `test_assignments` table
2. Querying the `patients` table and excluding those IDs
3. This ensures only patients without any test assignments are returned

### Performance Considerations

- Uses indexed queries on `created_at` for efficient sorting
- Implements pagination to limit result set size
- Caches assigned patient IDs in memory for the request duration

## Testing

### Manual Testing with curl

```bash
# Get first page of unassigned patients (requires authentication cookie)
curl -X GET 'http://localhost:3000/api/patients/unassigned?page=1&limit=10' \
  -H 'Cookie: sb-access-token=YOUR_TOKEN_HERE'

# Get second page with custom limit
curl -X GET 'http://localhost:3000/api/patients/unassigned?page=2&limit=25' \
  -H 'Cookie: sb-access-token=YOUR_TOKEN_HERE'
```

### Testing Scenarios

1. **No patients exist**: Should return empty array with total: 0
2. **All patients assigned**: Should return empty array with total: 0
3. **Some patients unassigned**: Should return only unassigned patients
4. **Pagination**: Should correctly paginate results
5. **Unauthenticated request**: Should return 401 error

## Requirements Validation

- ✅ **Requirement 1.1**: Fetches all registered patients (excluding assigned ones)
- ✅ **Requirement 5.4**: Excludes patients with test_assignments records

## Related Files

- `/app/(dashboard)/patient-route/page.tsx` - Consumes this endpoint
- `/types/index.ts` - Type definitions for request/response
- `/supabase/migrations/001_create_patients_table.sql` - Patients table schema
- `/supabase/migrations/003_create_test_assignments_table.sql` - Test assignments table schema
