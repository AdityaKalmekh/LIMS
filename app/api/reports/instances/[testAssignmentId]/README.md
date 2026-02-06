# Report Instances API Endpoint

## Overview

This endpoint retrieves report instance data for a specific test assignment, including all saved field values transformed from the EAV (Entity-Attribute-Value) storage format into a convenient key-value object.

## Endpoint

```
GET /api/reports/instances/[testAssignmentId]
```

## Authentication

Requires authentication via Supabase Auth. The user must be logged in to access this endpoint.

## Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| testAssignmentId | UUID | The unique identifier of the test assignment |

## Response Format

### Success Response (200 OK)

When a report instance exists:

```json
{
  "reportInstance": {
    "id": "uuid",
    "testAssignmentId": "uuid",
    "reportTypeId": "uuid",
    "status": "pending" | "in-progress" | "completed",
    "createdBy": "uuid",
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp",
    "completedAt": "ISO 8601 timestamp" | null
  },
  "values": {
    "field_name_1": "value1",
    "field_name_2": 123.45,
    "field_name_3": "value3"
  }
}
```

When no report instance exists yet:

```json
{
  "reportInstance": null,
  "values": {}
}
```

## Error Responses

### 400 Bad Request

Invalid test assignment ID format:

```json
{
  "success": false,
  "error": "Invalid test assignment ID",
  "message": "Test assignment ID must be a valid UUID"
}
```

### 401 Unauthorized

User is not authenticated:

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "You must be logged in to view report instances"
}
```

### 404 Not Found

Test assignment does not exist:

```json
{
  "success": false,
  "error": "Test assignment not found",
  "message": "No test assignment found with ID: {testAssignmentId}"
}
```

### 500 Internal Server Error

Database or server error:

```json
{
  "success": false,
  "error": "Database error" | "Internal server error",
  "message": "Failed to fetch report instance. Please try again."
}
```

## Data Transformation

The endpoint performs the following transformations:

1. **EAV to Key-Value**: Report values are stored in the database using an EAV pattern (report_values table). This endpoint joins with report_fields to transform the data into a simple key-value object where keys are field names and values are the actual field values.

2. **Field Type Handling**: 
   - For `number` field types: Uses `value_number` column
   - For `text`, `dropdown`, `textarea` field types: Uses `value_text` column

3. **Snake Case to Camel Case**: Database column names (snake_case) are transformed to camelCase for the API response.

## Use Cases

### 1. Loading Existing Report Data

When a user expands a report form, this endpoint is called to load any previously saved data:

```typescript
const response = await fetch(`/api/reports/instances/${testAssignmentId}`)
const { reportInstance, values } = await response.json()

if (reportInstance) {
  // Populate form with saved values
  form.setValues(values)
}
```

### 2. Checking Report Status

The endpoint returns the current status of the report:

```typescript
const { reportInstance } = await response.json()
const status = reportInstance?.status || 'pending'
```

### 3. Determining if Report Exists

Check if a report has been started:

```typescript
const { reportInstance } = await response.json()
const hasStarted = reportInstance !== null
```

## Database Schema

The endpoint queries the following tables:

1. **test_assignments**: Verifies the test assignment exists
2. **report_instances**: Fetches the report instance record
3. **report_values**: Fetches all field values (joined with report_fields)
4. **report_fields**: Provides field metadata (field_name, field_type)

## Requirements Satisfied

- **Requirement 3.3**: Load previously saved data when report form is expanded
- **Requirement 14.2**: Populate form fields with saved values when existing data is found
- **Requirement 14.3**: Display empty fields with defaults when no existing data is found

## Example Usage

### JavaScript/TypeScript

```typescript
async function loadReportData(testAssignmentId: string) {
  try {
    const response = await fetch(
      `/api/reports/instances/${testAssignmentId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to load report data:', error)
    throw error
  }
}

// Usage
const { reportInstance, values } = await loadReportData('123e4567-e89b-12d3-a456-426614174000')

if (reportInstance) {
  console.log('Report status:', reportInstance.status)
  console.log('Field values:', values)
} else {
  console.log('No report data exists yet')
}
```

### cURL

```bash
# Load report data
curl -X GET \
  'http://localhost:3000/api/reports/instances/123e4567-e89b-12d3-a456-426614174000' \
  -H 'Cookie: your-auth-cookie'
```

## Performance Considerations

- The endpoint uses a single join query to fetch all report values with their field definitions
- Indexes on `report_instance_id` in the `report_values` table ensure fast lookups
- The unique constraint on `(test_assignment_id)` in `report_instances` ensures at most one report instance per test assignment

## Testing

Unit tests are available in `__tests__/api/report-instances.test.ts` covering:

- Authentication checks
- UUID validation
- Test assignment existence verification
- Report instance retrieval with no data
- EAV to key-value transformation
- Numeric and text field handling
- Error handling scenarios
