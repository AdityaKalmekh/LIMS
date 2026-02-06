# Task 6.1: BloodGroupForm Component Implementation

## Overview

This document describes the implementation of the BloodGroupForm component for the patient test report management system.

## Task Details

**Task:** 6.1 Implement BloodGroupForm component

**Requirements:** 6.1, 6.2, 6.3

**Description:**
- Create dropdown for Blood Group (A, B, AB, O)
- Create dropdown for Rh Factor (POSITIVE, NEGATIVE)
- Mark both fields as required
- Use shadcn/ui Select component
- Place in components/reports/forms/BloodGroupForm.tsx

## Implementation

### File Location

```
lims-app/components/reports/forms/BloodGroupForm.tsx
```

### Component Structure

The BloodGroupForm component is a specialized form component that:

1. **Accepts ReportFormProps interface** containing:
   - `fields`: Array of ReportField definitions from the database
   - `data`: Current form data (Record<string, any>)
   - `errors`: Validation errors (Record<string, string>)
   - `onChange`: Callback function for field changes

2. **Renders two dropdown fields**:
   - Blood Group dropdown with options: A, B, AB, O
   - Rh Factor dropdown with options: POSITIVE, NEGATIVE

3. **Displays field metadata**:
   - Field labels from the field definitions
   - Required field indicators (red asterisk)
   - Validation error messages

4. **Handles user interactions**:
   - Calls onChange callback when field values change
   - Applies error styling to fields with validation errors

### Key Features

#### 1. Dynamic Field Rendering

The component finds the blood_group and rh_factor fields from the provided field definitions:

```typescript
const bloodGroupField = fields.find(f => f.fieldName === 'blood_group')
const rhFactorField = fields.find(f => f.fieldName === 'rh_factor')
```

This allows the component to work with the database-driven field definitions.

#### 2. Required Field Indicators

Both fields are marked as required with a red asterisk:

```typescript
{bloodGroupField.isRequired && (
  <span className="text-red-500 ml-1">*</span>
)}
```

#### 3. Validation Error Display

Validation errors are displayed below each field:

```typescript
{bloodGroupError && (
  <p className="text-sm text-red-500">{bloodGroupError}</p>
)}
```

#### 4. Error Styling

Fields with validation errors receive a red border:

```typescript
className={bloodGroupError ? 'border-red-500' : ''}
```

### Component Usage

```tsx
import { BloodGroupForm } from '@/components/reports/forms/BloodGroupForm'

<BloodGroupForm
  fields={reportFields}
  data={formData}
  errors={validationErrors}
  onChange={(fieldName, value) => handleFieldChange(fieldName, value)}
/>
```

### Integration with Report System

The BloodGroupForm component is designed to be used within the ReportFormContainer component, which:

1. Loads the report type definition and field definitions from the database
2. Manages form state (data, errors, save status)
3. Handles validation and save operations
4. Dynamically renders the appropriate form component based on report type

The component will be registered in the report form registry:

```typescript
const reportFormRegistry: ReportFormRegistry = {
  'BLOOD_GROUP': BloodGroupForm,
  'CBC': CBCForm,
  // Future report types...
}
```

## Database Integration

The component works with the following database tables:

### report_types table
- Contains the BLOOD_GROUP report type definition

### report_fields table
- Contains two field definitions:
  1. blood_group (dropdown, required, options: A, B, AB, O)
  2. rh_factor (dropdown, required, options: POSITIVE, NEGATIVE)

### Field Names

The component uses the following field names that match the database:
- `blood_group` - Blood Group field
- `rh_factor` - Rh Factor field

## Styling

The component follows the project's design system:

- **Spacing**: `space-y-6` between fields, `space-y-2` within field groups
- **Labels**: `text-sm font-medium` for field labels
- **Required indicators**: `text-red-500 ml-1` for asterisks
- **Error messages**: `text-sm text-red-500` for validation errors
- **Error borders**: `border-red-500` for fields with errors

## Accessibility

The component includes proper accessibility features:

- Labels are associated with form controls using `htmlFor` and `id` attributes
- Required fields are marked visually with asterisks
- Error messages are displayed in close proximity to the fields
- The shadcn/ui Select component includes built-in keyboard navigation

## Testing Considerations

When testing infrastructure is added, the following tests should be implemented:

### Unit Tests

1. **Rendering Tests**
   - Both dropdowns render with correct labels
   - Both fields are marked as required
   - Placeholder text is displayed correctly

2. **Validation Tests**
   - Validation errors are displayed correctly
   - Error styling is applied to fields with errors
   - Error messages appear below the fields

3. **Interaction Tests**
   - onChange callback is called with correct field name and value
   - Selecting a value updates the display
   - Form works with empty data object

4. **Edge Cases**
   - Component handles missing fields gracefully
   - Component works with partial data
   - Component handles null/undefined values

### Integration Tests

1. **Form Container Integration**
   - Component receives correct props from ReportFormContainer
   - Field changes trigger validation
   - Save operation includes blood group data

2. **Database Integration**
   - Field definitions are loaded correctly from database
   - Dropdown options match database configuration
   - Required status matches database configuration

## Requirements Validation

### Requirement 6.1
✅ Blood Group report displays dropdown field for Blood Group with options: A, B, AB, O

**Implementation:** The component renders a Select dropdown with BLOOD_GROUP_OPTIONS constant containing ['A', 'B', 'AB', 'O'].

### Requirement 6.2
✅ Blood Group report displays dropdown field for Rh Factor with options: POSITIVE, NEGATIVE

**Implementation:** The component renders a Select dropdown with RH_FACTOR_OPTIONS constant containing ['POSITIVE', 'NEGATIVE'].

### Requirement 6.3
✅ When saving a Blood Group report, both Blood Group and Rh Factor fields are required

**Implementation:** The component marks both fields as required by displaying a red asterisk when `isRequired` is true in the field definition. The actual validation is handled by the parent ReportFormContainer component.

## Next Steps

The following tasks should be completed to fully integrate the BloodGroupForm:

1. **Task 7.1**: Implement CBCForm component
2. **Task 8.1**: Implement GenericReportForm component
3. **Task 9.1**: Create report form registry
4. **Task 10.1**: Implement ReportFormContainer component
5. **Task 6.2**: Write unit tests for Blood Group form (when test infrastructure is ready)

## Files Created

1. `lims-app/components/reports/forms/BloodGroupForm.tsx` - Main component
2. `lims-app/components/reports/forms/README.md` - Documentation for forms directory
3. `lims-app/docs/TASK_6.1_BLOOD_GROUP_FORM.md` - This documentation file

## Verification

To verify the implementation:

1. ✅ Component file created at correct location
2. ✅ Component uses ReportFormProps interface
3. ✅ Component renders two Select dropdowns
4. ✅ Blood Group dropdown has options: A, B, AB, O
5. ✅ Rh Factor dropdown has options: POSITIVE, NEGATIVE
6. ✅ Both fields marked as required with red asterisk
7. ✅ Validation errors displayed below fields
8. ✅ Error styling applied to fields with errors
9. ✅ onChange callback called with correct parameters
10. ✅ Component uses shadcn/ui Select component
11. ✅ No TypeScript errors or warnings
12. ✅ Follows project coding standards and patterns

## Conclusion

The BloodGroupForm component has been successfully implemented according to the specifications. The component is ready to be integrated into the report form registry and used within the ReportFormContainer component.
