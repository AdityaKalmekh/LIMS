# Report Forms

This directory contains specialized form components for different report types in the patient test report management system.

## Components

### BloodGroupForm

A form component for entering blood group test results.

**Location:** `BloodGroupForm.tsx`

**Features:**
- Blood Group dropdown (A, B, AB, O)
- Rh Factor dropdown (POSITIVE, NEGATIVE)
- Both fields are required
- Validation error display
- Uses shadcn/ui Select component

**Props:**
- `fields`: Array of ReportField definitions
- `data`: Current form data (Record<string, any>)
- `errors`: Validation errors (Record<string, string>)
- `onChange`: Callback function for field changes

**Usage:**
```tsx
import { BloodGroupForm } from '@/components/reports/forms/BloodGroupForm'

<BloodGroupForm
  fields={reportFields}
  data={formData}
  errors={validationErrors}
  onChange={(fieldName, value) => handleFieldChange(fieldName, value)}
/>
```

**Requirements:** 6.1, 6.2, 6.3

### CBCForm

A form component for entering Complete Blood Count (CBC) test results.

**Location:** `CBCForm.tsx`

**Features:**
- 14 numeric input fields with units and normal ranges
- 2 dropdown fields with default values
- Organized in logical groups (RBC, WBC, Platelets, Other)
- Visual indicators for out-of-range values (yellow border and warning icon)
- Validation error display
- Uses shadcn/ui Input and Select components

**Props:**
- `fields`: Array of ReportField definitions
- `data`: Current form data (Record<string, any>)
- `errors`: Validation errors (Record<string, string>)
- `onChange`: Callback function for field changes

**Usage:**
```tsx
import { CBCForm } from '@/components/reports/forms/CBCForm'

<CBCForm
  fields={reportFields}
  data={formData}
  errors={validationErrors}
  onChange={(fieldName, value) => handleFieldChange(fieldName, value)}
/>
```

**Field Groups:**
- **RBC Parameters:** Hb, RBC, PCV/Haematocrit, MCV, MCH, MCHC, RDW-CV
- **WBC Parameters:** Total Leukocyte Count, Neutrophil, Lymphocyte, Monocyte, Eosinophil, Basophil
- **Platelet Parameters:** Platelet Count, Platelet on Smear
- **Other Tests:** Malarial Parasite

**Requirements:** 7.1, 7.2, 7.3, 7.4

## Adding New Report Forms

To add a new report form:

1. Create a new component file in this directory (e.g., `CBCForm.tsx`)
2. Implement the component using the `ReportFormProps` interface from `@/types/reports`
3. Use shadcn/ui components for consistency
4. Mark required fields with a red asterisk
5. Display validation errors below each field
6. Register the component in the report form registry (`registry.ts`)
7. Update this README with documentation

## Form Component Pattern

All report form components should follow this pattern:

```tsx
'use client'

import { ReportFormProps } from '@/types/reports'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function MyReportForm({ fields, data, errors, onChange }: ReportFormProps) {
  // Find fields from field definitions
  const myField = fields.find(f => f.fieldName === 'my_field')
  
  // Get current value
  const myValue = data['my_field'] || ''
  
  // Get validation error
  const myError = errors['my_field']
  
  return (
    <div className="space-y-6">
      {myField && (
        <div className="space-y-2">
          <Label htmlFor="my_field" className="text-sm font-medium">
            {myField.fieldLabel}
            {myField.isRequired && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id="my_field"
            value={myValue}
            onChange={(e) => onChange('my_field', e.target.value)}
            className={myError ? 'border-red-500' : ''}
          />
          {myError && <p className="text-sm text-red-500">{myError}</p>}
        </div>
      )}
    </div>
  )
}
```

## Field Types

Report fields can have the following types:
- `text`: Text input field
- `number`: Numeric input field (may have units and normal ranges)
- `dropdown`: Select dropdown with predefined options
- `textarea`: Multi-line text input

## Validation

Validation is handled by the parent ReportFormContainer component. Form components should:
- Display validation errors passed via the `errors` prop
- Apply error styling (red border) to fields with errors
- Show error messages below the field

## Styling

- Use `space-y-6` for spacing between fields
- Use `space-y-2` for spacing within a field group
- Mark required fields with `<span className="text-red-500 ml-1">*</span>`
- Apply `border-red-500` class to fields with validation errors
- Use `text-sm text-red-500` for error messages
