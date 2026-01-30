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

## Future Enhancements

- API integration for saving patient data (Task 6.1)
- Patient list refresh after registration (Task 6.3)
- Form reset after successful submission
- Duplicate patient detection
- Auto-formatting for mobile number input
