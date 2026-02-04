# Test Assignments API Documentation

## Endpoint: POST /api/test-assignments

Creates test assignment records linking patients to lab tests.

### Authentication

Requires authentication via Supabase Auth. The authenticated user's ID is automatically recorded as `assigned_by`.

### Request

**URL:** `/api/test-assignments`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
Cookie: <supabase-auth-token>
```

**Body:**
```json
{
  "assignments": [
    {
      "patientId": "123e4567-e89b-12d3-a456-426614174000",
      "tests": ["CBC", "BG", "VDRL"]
    },
    {
      "patientId": "223e4567-e89b-12d3-a456-426614174001",
      "tests": ["CBC"]
    }
  ]
}
```

**Body Schema:**
- `assignments` (required): Array of patient-test assignments
  - `patientId` (required): UUID of the patient
  - `tests` (required): Array of test types (must contain at least one)
    - Valid values: `"CBC"`, `"BG"`, `"VDRL"`

### Response

#### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Successfully assigned tests to 2 patients",
  "data": {
    "created": 4,
    "assignments": [
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "patientId": "123e4567-e89b-12d3-a456-426614174000",
        "testType": "CBC",
        "status": "pending",
        "assignedAt": "2025-01-15T10:30:00.000Z",
        "assignedBy": "user-id-123",
        "createdAt": "2025-01-15T10:30:00.000Z"
      },
      {
        "id": "b2c3d4e5-f6g7-8901-bcde-f12345678901",
        "patientId": "123e4567-e89b-12d3-a456-426614174000",
        "testType": "BG",
        "status": "pending",
        "assignedAt": "2025-01-15T10:30:00.000Z",
        "assignedBy": "user-id-123",
        "createdAt": "2025-01-15T10:30:00.000Z"
      }
      // ... more assignments
    ]
  }
}
```

#### Error Responses

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "You must be logged in to create test assignments"
}
```

**400 Bad Request - Validation Error**
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Please check your input and try again",
  "errors": [
    {
      "field": "assignments.0.tests",
      "message": "At least one test must be assigned to each patient"
    }
  ]
}
```

**400 Bad Request - Invalid Patient ID**
```json
{
  "success": false,
  "error": "Invalid patient IDs",
  "message": "The following patient IDs do not exist: 123e4567-e89b-12d3-a456-426614174000"
}
```

**400 Bad Request - Duplicate Assignment**
```json
{
  "success": false,
  "error": "Duplicate assignment",
  "message": "One or more patients already have these tests assigned"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Database error",
  "message": "Failed to create test assignments. Please try again."
}
```

## Validation Rules

1. **At least one assignment required**: The `assignments` array must contain at least one item
2. **At least one test per patient**: Each patient must have at least one test in their `tests` array
3. **Valid UUID format**: Patient IDs must be valid UUIDs
4. **Valid test types**: Test types must be one of: `CBC`, `BG`, or `VDRL`
5. **Patient must exist**: All patient IDs must exist in the database
6. **No duplicate assignments**: A patient cannot have the same test assigned twice (enforced by database constraint)

## Database Behavior

### Transaction Atomicity

All test assignments are created in a single database transaction. If any assignment fails, all assignments are rolled back.

### Multiple Assignments Per Patient

The endpoint supports creating multiple test assignments for a single patient. For example:

```json
{
  "assignments": [
    {
      "patientId": "123e4567-e89b-12d3-a456-426614174000",
      "tests": ["CBC", "BG", "VDRL"]
    }
  ]
}
```

This creates **three** separate records in the `test_assignments` table:
1. Patient → CBC
2. Patient → BG
3. Patient → VDRL

### Unique Constraint

The database enforces a unique constraint on `(patient_id, test_type)`. This prevents duplicate test assignments for the same patient.

## Example Usage

### Using cURL

```bash
# First, get your auth token from the browser's cookies
# Then make the request:

curl -X POST http://localhost:3000/api/test-assignments \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-<your-project>-auth-token=<your-token>" \
  -d '{
    "assignments": [
      {
        "patientId": "123e4567-e89b-12d3-a456-426614174000",
        "tests": ["CBC", "BG"]
      }
    ]
  }'
```

### Using JavaScript Fetch

```javascript
const response = await fetch('/api/test-assignments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    assignments: [
      {
        patientId: '123e4567-e89b-12d3-a456-426614174000',
        tests: ['CBC', 'BG', 'VDRL']
      },
      {
        patientId: '223e4567-e89b-12d3-a456-426614174001',
        tests: ['CBC']
      }
    ]
  })
})

const data = await response.json()

if (data.success) {
  console.log(`Created ${data.data.created} test assignments`)
  console.log(data.data.assignments)
} else {
  console.error('Error:', data.error, data.message)
}
```

## Requirements Satisfied

- **Requirement 4.4**: Validates that each selected patient has at least one test assigned
- **Requirement 4.6**: Creates test assignment records in the database
- **Requirement 5.2**: Stores all required fields (patient_id, test_type, assigned_by, assigned_at, status)
- **Requirement 5.5**: Supports multiple test assignments per patient (one record per test type)

## Related Endpoints

- `GET /api/patients/unassigned` - Fetch patients without test assignments
- `GET /api/patients` - Fetch all patients

## Database Schema

The endpoint creates records in the `test_assignments` table:

```sql
CREATE TABLE test_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  test_type VARCHAR(20) NOT NULL CHECK (test_type IN ('CBC', 'BG', 'VDRL')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID NOT NULL REFERENCES auth.users(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(patient_id, test_type)
);
```
