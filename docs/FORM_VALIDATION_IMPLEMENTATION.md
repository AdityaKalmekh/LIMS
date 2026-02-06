# Form Validation Implementation

## Overview

This document describes the implementation of the form validation function for the Patient Test Report Management System (Task 4.2).

## Implementation Details

### Files Created

1. **`lib/validation/form-validator.ts`** - Main form validation module
2. **`__tests__/validation/form-validator.test.ts`** - Comprehensive unit tests
3. **`scripts/test-form-validator.ts`** - Manual verification script

### Core Functions

#### `validateReportForm(fields, data): ValidationResult`

The main validation function that validates all fields in a report form based on their field definitions.

**Validation Rules:**
- **Required Fields**: Checks that required fields are not empty, null, undefined, or whitespace-only
- **Numeric Fields**: Validates that numeric fields contain valid numbers (not NaN or Infinity)
- **Dropdown Fields**: Ensures dropdown values are from the allowed options list
- **Text Fields**: Verifies text fields contain string values (when not empty)

**Returns:**
```typescript
{
  isValid: boolean,      // true if all validations pass
  errors: ValidationError[]  // array of field-specific errors
}
```

#### `validateReportField(field, value): ValidationError | null`

Convenience function for validating a single field, useful for real-time validation as users type.

#### `validationErrorsToMap(errors): Record<string, string>`

Utility function that converts an array of ValidationError objects into a map for easier field-level error display.

#### `hasValidationErrors(result): boolean`

Quick check to determine if a validation result contains any errors.

## Requirements Satisfied

### Requirement 5.2
"WHEN a lab technician clicks the save button, THE Report_System SHALL validate all field values against their constraints"

✅ **Implemented**: The `validateReportForm` function validates all fields based on their field definitions, checking:
- Required field constraints
- Numeric field type constraints
- Dropdown option constraints
- Data type constraints

### Requirement 5.4
"WHEN validation fails, THE Report_System SHALL display error messages indicating which fields are invalid"

✅ **Implemented**: The function returns a `ValidationResult` with:
- `isValid` flag indicating overall validation status
- `errors` array containing specific error messages for each invalid field
- Each error includes the field name and a user-friendly message

## Validation Behavior

### Required Fields
- Empty strings, null, undefined, and whitespace-only values fail validation
- Zero (0) and false are considered valid values for required fields
- Error message format: `"{Field Label} is required"`

### Numeric Fields
- Must be valid numbers (not NaN or Infinity)
- Can be provided as strings (e.g., "15.5") or numbers (e.g., 15.5)
- Empty optional numeric fields are skipped
- Error message format: `"{Field Label} must be a valid number"`

### Dropdown Fields
- Value must be in the defined options list
- Case-sensitive matching
- Error message format: `"{Field Label} must be one of: {options}"`

### Text Fields
- Must be strings when not empty
- Empty optional text fields are skipped
- Error message format: `"{Field Label} must be text"`

### Out-of-Range Values
**Important**: Values outside the normal range are NOT considered validation errors. They are displayed with visual indicators but do not prevent saving, as per Requirement 8.3.

## Testing

### Manual Verification
The implementation was manually tested using `scripts/test-form-validator.ts` with the following test cases:

1. ✅ Required field validation (empty values)
2. ✅ Numeric field validation (invalid and valid values)
3. ✅ Multiple fields validation (all valid and multiple invalid)
4. ✅ Optional field validation (empty optional fields)

All manual tests passed successfully.

### Unit Tests
Comprehensive unit tests were created in `__tests__/validation/form-validator.test.ts` covering:

- Required field validation (empty, null, undefined, whitespace)
- Numeric field validation (invalid text, valid numbers, valid strings)
- Dropdown field validation (invalid and valid options)
- Text field validation (non-string values)
- Multiple field validation
- Edge cases (empty arrays, empty objects, special characters)
- Utility functions (validateReportField, validationErrorsToMap, hasValidationErrors)

### Build Verification
The implementation was verified to compile successfully with TypeScript and integrate properly with the Next.js build system:

```
✓ Compiled successfully
✓ Finished TypeScript
```

## Usage Example

```typescript
import { validateReportForm } from '@/lib/validation/form-validator'
import { ReportField } from '@/types/reports'

// Define fields
const fields: ReportField[] = [
  {
    fieldName: 'hb',
    fieldLabel: 'Haemoglobin',
    fieldType: 'number',
    isRequired: true,
    // ... other properties
  },
  {
    fieldName: 'blood_group',
    fieldLabel: 'Blood Group',
    fieldType: 'dropdown',
    isRequired: true,
    dropdownOptions: ['A', 'B', 'AB', 'O'],
    // ... other properties
  }
]

// Validate form data
const data = { hb: '15.5', blood_group: 'A' }
const result = validateReportForm(fields, data)

if (result.isValid) {
  // Proceed with save
  console.log('Validation passed!')
} else {
  // Display errors
  result.errors.forEach(error => {
    console.log(`${error.fieldName}: ${error.message}`)
  })
}
```

## Integration Points

The form validation function integrates with:

1. **Report Form Container** (Task 10.1): Will use this function to validate form data before saving
2. **Field Validators** (Task 4.1): Uses the individual field validation functions
3. **Type Definitions** (Task 2.1): Uses ReportField, ValidationResult, and ValidationError types

## Next Steps

The validation function is ready to be integrated into the Report Form Container component (Task 10.1), where it will be called:
- Before saving report data
- To provide real-time validation feedback
- To enable/disable the save button based on validation status

## Notes

- The implementation follows the design document specifications exactly
- All validation logic is centralized in this module for maintainability
- The function is pure and has no side effects, making it easy to test
- Error messages are user-friendly and include the field label for clarity
