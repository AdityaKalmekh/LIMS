# Patient Route Page

## Overview

The Patient Route page (`/patient-route`) is the main interface for assigning lab tests to registered patients. This page allows administrators to view unassigned patients, select multiple patients, assign lab tests (CBC, BG, VDRL) to each patient, and submit assignments to transition patients into the reports workflow.

## Features

### 1. Patient Fetching
- Automatically fetches unassigned patients on page mount
- Uses GET `/api/patients/unassigned` endpoint
- Displays loading state during fetch
- Handles errors with retry capability

### 2. Selection Management
- **Patient Selection**: Checkbox-based multi-select for patients
- **Test Assignment**: Dropdown-based multi-select for lab tests per patient
- State managed using:
  - `selectedPatients`: Set<string> - IDs of selected patients
  - `testAssignments`: Map<string, Set<TestType>> - Patient ID to selected tests mapping

### 3. Validation
- Validates that at least one patient is selected
- Validates that each selected patient has at least one test assigned
- Shows clear validation error messages
- Prevents submission if validation fails

### 4. Submission
- Submits assignments to POST `/api/test-assignments` endpoint
- Shows loading state during submission
- Displays success message with patient count
- Automatically refreshes patient list after successful submission
- Clears selection state after submission

### 5. UI States
- **Loading State**: Spinner with "Loading patients..." message
- **Error State**: Error alert with retry button
- **Empty State**: Message when no unassigned patients exist
- **Success State**: Green alert showing successful submission
- **Validation Error State**: Red alert showing validation errors

## Components Used

### PatientAssignmentTable
Displays patients in a table format with:
- Selection checkboxes
- Patient information (Name, Mobile, Sex, Age, Referred By)
- Test selection dropdowns
- Responsive design (table on desktop, cards on mobile)

### UI Components
- `Button`: Submit button with loading state
- `Alert`: Success, error, and validation messages
- `Loader2`: Loading spinner icon
- `AlertCircle`: Error icon
- `CheckCircle2`: Success icon
- `Users`: Empty state icon

## State Management

```typescript
// Patient data
const [patients, setPatients] = useState<Patient[]>([])

// Selection state
const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set())
const [testAssignments, setTestAssignments] = useState<Map<string, Set<TestType>>>(new Map())

// UI state
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
const [submitting, setSubmitting] = useState(false)
const [successMessage, setSuccessMessage] = useState<string | null>(null)
const [validationError, setValidationError] = useState<string | null>(null)
```

## API Integration

### Fetch Unassigned Patients
```typescript
GET /api/patients/unassigned
Response: {
  success: true,
  data: Patient[],
  pagination: { ... }
}
```

### Create Test Assignments
```typescript
POST /api/test-assignments
Body: {
  assignments: [
    {
      patientId: string,
      tests: TestType[]
    }
  ]
}
Response: {
  success: true,
  message: string,
  data: {
    created: number,
    assignments: TestAssignment[]
  }
}
```

## Validation Rules

1. **At least one patient must be selected**
   - Error: "Please select at least one patient"

2. **Each selected patient must have at least one test assigned**
   - Error: "Please assign at least one test to: [patient names]"

## User Flow

1. Page loads → Fetches unassigned patients
2. User selects patients using checkboxes
3. User assigns tests to each selected patient using dropdowns
4. User clicks "Submit Assignments" button
5. System validates selections
6. If valid → Submits to API → Shows success → Refreshes list
7. If invalid → Shows validation error

## Requirements Satisfied

- **1.1**: Fetch all Patient_Records from database on page load
- **1.3**: Display empty state message when no patients exist
- **1.4**: Display error message with retry capability on load failure
- **3.2**: Toggle selection state when patient checkbox is clicked
- **3.6**: Allow multiple Patient_Records to be selected simultaneously
- **4.1**: Show submit button at bottom of page
- **4.2**: Disable submit button when no patients selected
- **4.3**: Enable submit button when at least one patient selected

## Styling

- Uses consistent typography from `@/lib/typography`
- Uses spacing utilities from `@/lib/typography`
- Follows existing dashboard design patterns
- Responsive design with mobile support

## Error Handling

- Network errors: Display error message with retry button
- Validation errors: Display inline validation messages
- API errors: Display error alert with error message
- Maintains selection state on error for user convenience

## Future Enhancements

- Pagination support for large patient lists
- Search/filter functionality
- Bulk test assignment (assign same tests to all selected patients)
- Export functionality
- Patient details preview
