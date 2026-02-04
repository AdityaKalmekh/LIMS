# Patient Components

This directory contains components related to patient management in the LIMS application.

## Components

### PatientRegistrationForm

A comprehensive form component for registering new patients with all required fields.

**Features:**
- Mobile number input with +91 prefix validation
- Title dropdown (Mr., Mrs., Ms., Dr., Master, Miss)
- First name and last name inputs
- Sex radio buttons (Male, Female, Other)
- Age inputs (Years, Months, Days)
- Referred by input (optional)
- Form validation using react-hook-form and zod
- Error display for all fields
- Mobile-responsive layout
- Loading states during submission

**Props:**
- `onSuccess: (patient: PatientFormData) => void` - Callback when form is successfully submitted
- `onCancel: () => void` - Callback when form is cancelled

**Usage:**
```tsx
import { PatientRegistrationForm } from '@/components/patients/PatientRegistrationForm'

<PatientRegistrationForm
  onSuccess={(data) => console.log('Patient registered:', data)}
  onCancel={() => console.log('Form cancelled')}
/>
```

### PatientRegistrationModal

A modal dialog wrapper for the PatientRegistrationForm component.

**Features:**
- Opens/closes via controlled state
- Displays PatientRegistrationForm in a dialog
- Handles form submission and cancellation
- Shows success toast notification
- Mobile-responsive
- Scrollable content for long forms

**Props:**
- `open: boolean` - Whether the modal is open
- `onOpenChange: (open: boolean) => void` - Callback when the modal open state changes

**Usage:**
```tsx
import { PatientRegistrationModal } from '@/components/patients/PatientRegistrationModal'
import { useState } from 'react'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Register Patient
      </button>
      
      <PatientRegistrationModal
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  )
}
```

## Validation Schema

The patient validation schema is defined in `lib/validations/patient.ts` using Zod.

**Validation Rules:**
- **Mobile Number**: Required, must be in format +91XXXXXXXXXX (10 digits)
- **Title**: Required, must be one of: Mr., Mrs., Ms., Dr., Master, Miss
- **First Name**: Required, max 100 characters
- **Last Name**: Optional, max 100 characters
- **Sex**: Required, must be: Male, Female, or Other
- **Age Years**: Required, must be 0-150
- **Age Months**: Optional, must be 0-11
- **Age Days**: Optional, must be 0-30
- **Referred By**: Optional, max 200 characters

## Integration

The PatientRegistrationModal is integrated with the dashboard layout and opens when the "New" button in the Header is clicked.

See `app/(dashboard)/layout.tsx` for the integration implementation.

### TestSelectionDropdown

A multi-select dropdown component for assigning lab tests to patients.

**Features:**
- Multi-select functionality with checkboxes
- Three test options: CBC (Complete Blood Count), BG (Blood Glucose), VDRL (Venereal Disease Research Laboratory)
- Shows selected count when closed (e.g., "2 tests selected")
- Displays test descriptions for clarity
- Consistent styling with existing components
- Accessible with proper ARIA labels

**Props:**
- `patientId: string` - Patient ID for tracking which patient's tests are being selected
- `selectedTests: Set<TestType>` - Set of currently selected test types
- `onChange: (tests: Set<TestType>) => void` - Callback when test selection changes

**Usage:**
```tsx
import { TestSelectionDropdown } from '@/components/patients/TestSelectionDropdown'
import { useState } from 'react'
import { TestType } from '@/types'

function MyComponent() {
  const [selectedTests, setSelectedTests] = useState<Set<TestType>>(new Set())
  
  return (
    <TestSelectionDropdown
      patientId="patient-123"
      selectedTests={selectedTests}
      onChange={setSelectedTests}
    />
  )
}
```

### PatientAssignmentTable

A table component for displaying patients with selection checkboxes and test assignment dropdowns.

**Features:**
- Checkbox column for patient selection
- Patient information columns (Name, Mobile, Sex, Age, Referred By)
- Test selection dropdown column for assigning tests
- Highlight selected rows with blue background
- Mobile-responsive card view fallback
- Consistent styling with existing dashboard components
- Accessible with proper ARIA labels

**Props:**
- `patients: Patient[]` - Array of patients to display
- `selectedPatients: Set<string>` - Set of selected patient IDs
- `testAssignments: Map<string, Set<TestType>>` - Map of patient IDs to their selected test types
- `onPatientSelect: (patientId: string, selected: boolean) => void` - Callback when a patient is selected or deselected
- `onTestAssignmentChange: (patientId: string, tests: Set<TestType>) => void` - Callback when test assignments change for a patient

**Usage:**
```tsx
import { PatientAssignmentTable } from '@/components/patients/PatientAssignmentTable'
import { useState } from 'react'
import { Patient, TestType } from '@/types'

function MyComponent() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set())
  const [testAssignments, setTestAssignments] = useState<Map<string, Set<TestType>>>(new Map())
  
  const handlePatientSelect = (patientId: string, selected: boolean) => {
    const newSelected = new Set(selectedPatients)
    if (selected) {
      newSelected.add(patientId)
    } else {
      newSelected.delete(patientId)
    }
    setSelectedPatients(newSelected)
  }
  
  const handleTestAssignmentChange = (patientId: string, tests: Set<TestType>) => {
    const newAssignments = new Map(testAssignments)
    newAssignments.set(patientId, tests)
    setTestAssignments(newAssignments)
  }
  
  return (
    <PatientAssignmentTable
      patients={patients}
      selectedPatients={selectedPatients}
      testAssignments={testAssignments}
      onPatientSelect={handlePatientSelect}
      onTestAssignmentChange={handleTestAssignmentChange}
    />
  )
}
```

## Future Enhancements

- API integration for saving patient data (Task 6.1)
- Patient list refresh after registration (Task 6.3)
- Form reset after successful submission
- Duplicate patient detection
- Auto-formatting for mobile number input
