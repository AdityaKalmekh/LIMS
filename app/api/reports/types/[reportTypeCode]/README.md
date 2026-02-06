# Report Types API Endpoint

## Overview

This endpoint provides access to report type definitions and their associated field specifications. It enables dynamic form generation by fetching the complete structure of a report type including all field metadata.

## Endpoint

### GET /api/reports/types/[reportTypeCode]

Fetches a report type definition by its code along with all associated report fields ordered by field_order.

#### Path Parameters

- `reportTypeCode` (string, required): The unique code identifier for the report type
  - Examples: `BLOOD_GROUP`, `CBC`, `VDRL`

#### Authentication

Requires a valid Supabase authentication session. The endpoint checks for an authenticated user before processing the request.

#### Response Format

**Success Response (200 OK):**

```json
{
  "reportType": {
    "id": "uuid",
    "code": "BLOOD_GROUP",
    "name": "Blood Group Test",
    "description": "Determines blood type and Rh factor",
    "isActive": true,
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  },
  "fields": [
    {
      "id": "uuid",
      "reportTypeId": "uuid",
      "fieldName": "blood_group",
      "fieldLabel": "Blood Group",
      "fieldType": "dropdown",
      "fieldOrder": 1,
      "isRequired": true,
      "unit": null,
      "normalRangeMin": null,
      "normalRangeMax": null,
      "normalRangeText": null,
      "dropdownOptions": ["A", "B", "AB", "O"],
      "defaultValue": null,
      "validationRules": null,
      "createdAt": "2025-01-15T10:00:00Z"
    },
    {
      "id": "uuid",
      "reportTypeId": "uuid",
      "fieldName": "rh_factor",
      "fieldLabel": "Rh Factor",
      "fieldType": "dropdown",
      "fieldOrder": 2,
      "isRequired": true,
      "unit": null,
      "normalRangeMin": null,
      "normalRangeMax": null,
      "normalRangeText": null,
      "dropdownOptions": ["POSITIVE", "NEGATIVE"],
      "defaultValue": null,
      "validationRules": null,
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

**Error Responses:**

- **401 Unauthorized:**
  ```json
  {
    "success": false,
    "error": "Unauthorized",
    "message": "You must be logged in to view report type definitions"
  }
  ```

- **404 Not Found:**
  ```json
  {
    "success": false,
    "error": "Not found",
    "message": "Report type with code 'INVALID_CODE' not found or is not active"
  }
  ```

- **500 Internal Server Error:**
  ```json
  {
    "success": false,
    "error": "Database error",
    "message": "Failed to fetch report type definition. Please try again."
  }
  ```

## Usage Examples

### Fetch Blood Group Report Type

```typescript
const response = await fetch('/api/reports/types/BLOOD_GROUP')
const data = await response.json()

if (response.ok) {
  console.log('Report Type:', data.reportType)
  console.log('Fields:', data.fields)
}
```

### Fetch CBC Report Type

```typescript
const response = await fetch('/api/reports/types/CBC')
const data = await response.json()

if (response.ok) {
  // Use the fields to dynamically generate a form
  data.fields.forEach(field => {
    console.log(`${field.fieldLabel} (${field.fieldType})`)
  })
}
```

### Error Handling

```typescript
const reportTypeCode = 'BLOOD_GROUP'
const response = await fetch(`/api/reports/types/${reportTypeCode}`)

if (!response.ok) {
  const error = await response.json()
  
  switch (response.status) {
    case 401:
      console.error('User not authenticated')
      break
    case 404:
      console.error('Report type not found:', error.message)
      break
    case 500:
      console.error('Server error:', error.message)
      break
  }
  return
}

const data = await response.json()
// Process successful response
```

## Field Types

The `fieldType` property can have the following values:

- `text`: Single-line text input
- `number`: Numeric input (may have normal ranges)
- `dropdown`: Select dropdown (options in `dropdownOptions`)
- `textarea`: Multi-line text input

## Field Properties

### Common Properties

- `fieldName`: Internal identifier used as the key when storing values
- `fieldLabel`: Human-readable label displayed in the form
- `fieldOrder`: Determines the display order (ascending)
- `isRequired`: Whether the field must be filled before saving

### Numeric Field Properties

- `unit`: Unit of measurement (e.g., "gm/dl", "/Cumm.")
- `normalRangeMin`: Minimum value of the normal range
- `normalRangeMax`: Maximum value of the normal range
- `normalRangeText`: Text representation (e.g., "13-17")

### Dropdown Field Properties

- `dropdownOptions`: Array of valid options for the dropdown

### Optional Properties

- `defaultValue`: Pre-populated value when creating a new report
- `validationRules`: Additional validation constraints (JSON object)

## Database Schema

This endpoint queries two tables:

### report_types

Stores report type definitions:
- `id`: UUID primary key
- `code`: Unique code identifier
- `name`: Display name
- `description`: Optional description
- `is_active`: Whether the report type is active
- `created_at`, `updated_at`: Timestamps

### report_fields

Stores field definitions for each report type:
- `id`: UUID primary key
- `report_type_id`: Foreign key to report_types
- `field_name`: Internal field identifier
- `field_label`: Display label
- `field_type`: Type of input field
- `field_order`: Display order
- `is_required`: Required flag
- `unit`, `normal_range_*`: Numeric field properties
- `dropdown_options`: Dropdown options (JSONB)
- `default_value`: Default value
- `validation_rules`: Additional validation (JSONB)
- `created_at`: Timestamp

## Requirements

This endpoint satisfies:
- **Requirement 10.4**: Scalable report type architecture that supports adding new report types without code changes

## Related Endpoints

- `GET /api/reports/patients` - Fetch patients with test assignments
- `GET /api/reports/test-assignments/[patientId]` - Fetch test assignments for a patient
- `GET /api/reports/instances/[testAssignmentId]` - Fetch report instance data
- `POST /api/reports/instances` - Save report instance data

## Notes

- Only active report types (`is_active = true`) are returned
- Fields are automatically ordered by `field_order` in ascending order
- The endpoint transforms database snake_case to TypeScript camelCase
- All timestamps are in ISO 8601 format with timezone
