# PatientList Component Documentation

## Overview

The `PatientList` component displays a list of patients with assigned tests in the Reports section. It provides a clear, organized view of patient information with visual indicators for test status.

## Features

- **Patient Information Display**: Shows name, ID, age, gender, and contact information
- **Test Count Badge**: Displays count of pending/in-progress tests with color-coded badges
- **Selection Highlighting**: Visually highlights the selected patient
- **Empty State**: Shows helpful message when no patients have assigned tests
- **Responsive Design**: Adapts to different screen sizes
- **Accessible**: Includes proper ARIA labels and keyboard navigation support

## Requirements

Implements requirements:
- **1.2**: Display patient information (name, ID, age, gender, contact)
- **1.4**: Display appropriate empty state message when no patients have assigned tests

## Usage

```tsx
import { PatientList } from '@/components/reports/PatientList'
import { PatientWithTests } from '@/types/reports'

function ReportsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [patients, setPatients] = useState<PatientWithTests[]>([])

  return (
    <PatientList
      patients={patients}
      selectedPatientId={selectedPatientId}
      onPatientSelect={setSelectedPatientId}
    />
  )
}
```

## Props

### `PatientListProps`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `patients` | `PatientWithTests[]` | Yes | Array of patients with their test assignments |
| `selectedPatientId` | `string \| null` | Yes | ID of the currently selected patient |
| `onPatientSelect` | `(patientId: string) => void` | Yes | Callback function when a patient is selected |

## Data Structure

### `PatientWithTests`

```typescript
interface PatientWithTests {
  id: string                              // Unique patient identifier
  name: string                            // Full patient name
  patientId: string                       // Patient ID (e.g., "P001")
  age: number                             // Patient age in years
  gender: string                          // Patient gender
  contact: string                         // Contact phone number
  testAssignments: TestAssignmentWithStatus[]  // Array of test assignments
}
```

### `TestAssignmentWithStatus`

```typescript
interface TestAssignmentWithStatus {
  id: string                              // Unique assignment identifier
  testName: string                        // Name of the test
  assignedDate: string                    // ISO date string
  reportStatus: 'pending' | 'in-progress' | 'completed'
  reportTypeCode: string                  // Report type code (e.g., "BLOOD_GROUP")
}
```

## Visual States

### Normal State
- White background
- Gray border
- Hover effect with shadow

### Selected State
- Primary color ring (2px)
- Light primary background tint
- Enhanced shadow
- Primary color text for name

### Empty State
- Centered layout
- User icon
- Helpful message
- Gray color scheme

## Badge Variants

The component uses different badge colors based on test status:

| Status | Badge Color | Meaning |
|--------|-------------|---------|
| Pending/In-Progress | Yellow (warning) | Tests need attention |
| All Complete | Green (success) | All tests completed |

## Styling

The component uses:
- **shadcn/ui Card**: For patient card container
- **shadcn/ui Badge**: For test count indicators
- **lucide-react icons**: User, Phone, Calendar, Hash
- **Tailwind CSS**: For responsive design and styling
- **cn utility**: For conditional class names

## Accessibility

- Clickable cards with proper cursor indication
- Semantic HTML structure
- Icon labels for screen readers
- Keyboard navigation support
- High contrast colors for readability

## Helper Functions

### `getPendingTestCount(patient: PatientWithTests): number`
Calculates the number of pending and in-progress tests for a patient.

### `formatAge(age: number): string`
Formats age for display (e.g., "35 years", "1 year", "Newborn").

### `formatGender(gender: string): string`
Capitalizes gender for consistent display.

## Example Data

```typescript
const examplePatients: PatientWithTests[] = [
  {
    id: '1',
    name: 'John Doe',
    patientId: 'P001',
    age: 35,
    gender: 'Male',
    contact: '+1234567890',
    testAssignments: [
      {
        id: 't1',
        testName: 'Blood Group',
        assignedDate: '2024-01-15',
        reportStatus: 'pending',
        reportTypeCode: 'BLOOD_GROUP'
      },
      {
        id: 't2',
        testName: 'CBC',
        assignedDate: '2024-01-15',
        reportStatus: 'in-progress',
        reportTypeCode: 'CBC'
      }
    ]
  }
]
```

## Integration

The PatientList component is designed to work with:
- **Reports Page** (`app/(dashboard)/reports/page.tsx`): Main container
- **TestAssignmentList**: Shows tests for selected patient
- **ReportFormContainer**: Displays report form for selected test

## Testing

Unit tests are located in `__tests__/components/PatientList.test.tsx` and cover:
- Patient information display
- Test count calculation
- Empty state handling
- Selection handling
- Data validation

## Performance Considerations

- Uses React key prop for efficient list rendering
- Minimal re-renders with proper prop comparison
- Optimized click handlers
- Efficient badge calculation

## Future Enhancements

Potential improvements:
- Search/filter functionality
- Sorting options (by name, pending tests, etc.)
- Pagination for large patient lists
- Patient photo/avatar support
- Quick actions menu
