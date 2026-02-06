# Status Update Implementation Documentation

## Task 15.1: Add status update logic to save operation

**Requirements:** 9.5, 11.5

### Overview

This document verifies that the status update logic is fully implemented across the entire save operation flow, from calculating the status to updating the UI.

## Implementation Verification

### ✅ 1. Status Calculation Logic

**Location:** `app/api/reports/instances/route.ts` (lines 38-56)

The `calculateReportStatus()` function implements the status determination logic:

```typescript
function calculateReportStatus(
  values: Record<string, any>,
  requiredFields: string[]
): 'pending' | 'in-progress' | 'completed' {
  // If no values provided, status is pending
  const valueKeys = Object.keys(values)
  if (valueKeys.length === 0) {
    return 'pending'
  }

  // Check if all required fields are filled
  const allRequiredFieldsFilled = requiredFields.every(fieldName => {
    const value = values[fieldName]
    return value !== undefined && value !== null && value !== ''
  })

  if (allRequiredFieldsFilled) {
    return 'completed'
  }

  return 'in-progress'
}
```

**Status Rules:**
- **Pending:** No values saved
- **In-Progress:** Some but not all required fields filled
- **Completed:** All required fields filled

### ✅ 2. Status Calculation After Save

**Location:** `app/api/reports/instances/route.ts` (lines 158-164)

After receiving save request, the API:
1. Fetches report field definitions
2. Extracts required field names
3. Calculates status based on submitted values

```typescript
// Extract required field names
const requiredFieldNames = reportFields
  .filter((field: ReportFieldDbRecord) => field.is_required)
  .map((field: ReportFieldDbRecord) => field.field_name)

// Calculate report status based on field completeness
const reportStatus = calculateReportStatus(values || {}, requiredFieldNames)
```

### ✅ 3. Database Update with New Status

**Location:** `app/api/reports/instances/route.ts` (lines 231-248, 267-276)

The API updates the `report_instances` table with the calculated status:

**For Existing Instances (Update):**
```typescript
const updateData: any = {
  status: reportStatus,
  updated_at: new Date().toISOString()
}

// Set completed_at timestamp if status is completed
if (reportStatus === 'completed') {
  updateData.completed_at = new Date().toISOString()
} else {
  // Clear completed_at if status is no longer completed
  updateData.completed_at = null
}

const { error: updateError } = await supabase
  .from('report_instances')
  .update(updateData)
  .eq('id', existingInstance.id)
```

**For New Instances (Create):**
```typescript
const insertData: any = {
  test_assignment_id: testAssignmentId,
  report_type_id: reportTypeId,
  status: reportStatus,
  created_by: user.id
}

// Set completed_at timestamp if status is completed
if (reportStatus === 'completed') {
  insertData.completed_at = new Date().toISOString()
}

const { data: newInstance, error: insertError } = await supabase
  .from('report_instances')
  .insert(insertData)
  .select()
  .single()
```

**Key Features:**
- Status is always recalculated on save
- `completed_at` timestamp is set when status becomes completed
- `completed_at` is cleared when status changes from completed to in-progress/pending
- `updated_at` timestamp is always updated

### ✅ 4. UI Update After Save

**Location:** `app/(dashboard)/reports/page.tsx` (lines 205-231)

The Reports page `handleSave()` function triggers UI refresh after successful save:

```typescript
const handleSave = async (data: ReportData) => {
  try {
    const response = await fetch('/api/reports/instances', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testAssignmentId: data.testAssignmentId,
        reportTypeId: data.reportTypeId,
        values: data.values
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to save report')
    }

    // Refresh patient list to update report status
    await loadPatientsWithTests()

    // Re-select the same patient and test after refresh
    setSelectedPatientId(selectedPatientId)
    setSelectedTestAssignmentId(selectedTestAssignmentId)
  } catch (error) {
    console.error('Error saving report:', error)
    throw error
  }
}
```

**Refresh Flow:**
1. Save report data via POST /api/reports/instances
2. Call `loadPatientsWithTests()` to fetch updated data
3. Maintain selected patient and test assignment IDs
4. UI automatically re-renders with new status

### ✅ 5. Updated Status Badge Display

**Location:** `components/reports/TestAssignmentList.tsx` (lines 38-48, 134-145)

The TestAssignmentList component displays status badges with distinct colors:

```typescript
function getStatusBadgeVariant(status: 'pending' | 'in-progress' | 'completed') {
  switch (status) {
    case 'pending':
      return 'secondary'  // Gray
    case 'in-progress':
      return 'warning'    // Yellow
    case 'completed':
      return 'success'    // Green
    default:
      return 'secondary'
  }
}
```

**Badge Display:**
```typescript
<Badge variant={getStatusBadgeVariant(assignment.reportStatus)}>
  {formatStatusText(assignment.reportStatus)}
</Badge>
```

**Visual Indicators:**
- **Pending:** Gray badge with "Pending" text
- **In Progress:** Yellow badge with "In Progress" text
- **Completed:** Green badge with "Completed" text

### ✅ 6. Status Retrieval in Patient List API

**Location:** `app/api/reports/patients/route.ts` (lines 107-120, 145-149)

The GET /api/reports/patients endpoint fetches updated status from database:

```typescript
// Fetch report instances for all test assignments
const { data: reportInstances, error: reportError } = await supabase
  .from('report_instances')
  .select('test_assignment_id, status')
  .in('test_assignment_id', testAssignmentIds)

// Create a map of test_assignment_id to report status
const reportStatusMap = new Map<string, 'pending' | 'in-progress' | 'completed'>()
if (reportInstances) {
  reportInstances.forEach(ri => {
    reportStatusMap.set(ri.test_assignment_id, ri.status)
  })
}

// Transform test assignments with status
const testAssignments: TestAssignmentWithStatus[] = patient.test_assignments.map((ta: any) => ({
  id: ta.id,
  testName: testTypeToNameMap[ta.test_type] || ta.test_type,
  assignedDate: ta.assigned_at,
  reportStatus: reportStatusMap.get(ta.id) || 'pending',
  reportTypeCode: testTypeToReportTypeMap[ta.test_type] || ta.test_type
}))
```

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User enters data and clicks "Save Report"                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. ReportFormContainer.handleSave()                            │
│    - Validates form                                             │
│    - Calls onSave callback                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Reports Page.handleSave()                                    │
│    - Calls POST /api/reports/instances                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. POST /api/reports/instances                                  │
│    - Fetches report field definitions                           │
│    - Extracts required field names                              │
│    - Calculates status: calculateReportStatus(values, required) │
│    - Updates/Creates report_instances with new status           │
│    - Sets completed_at if status is completed                   │
│    - Saves report values to report_values table                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Reports Page.handleSave() (continued)                        │
│    - Calls loadPatientsWithTests() to refresh data              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. GET /api/reports/patients                                    │
│    - Fetches patients with test assignments                     │
│    - Joins with report_instances to get updated status          │
│    - Returns patients with updated status                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. UI Re-renders                                                │
│    - PatientList updates                                        │
│    - TestAssignmentList shows updated status badge              │
│    - Selected patient and test remain selected                  │
└─────────────────────────────────────────────────────────────────┘
```

## Requirements Validation

### ✅ Requirement 9.5: Status Display Update
> WHEN a report status changes, THE Report_System SHALL update the display immediately

**Implementation:**
- After save, `loadPatientsWithTests()` is called to fetch updated data
- React state update triggers re-render of all components
- TestAssignmentList displays updated status badge
- Status change is visible immediately after save completes

### ✅ Requirement 11.5: Status Update After Save
> WHEN a report is successfully saved, THE Report_System SHALL update the report status accordingly

**Implementation:**
- Status is recalculated on every save operation
- `calculateReportStatus()` determines status based on field completeness
- Database is updated with new status and timestamps
- Status is persisted to `report_instances.status` column

## Testing

### Unit Tests
- ✅ Status calculator has comprehensive unit tests in `__tests__/utils/status-calculator.test.ts`
- Tests cover all three status states (pending, in-progress, completed)
- Tests cover edge cases (empty values, null, whitespace, etc.)

### Integration Test
- ✅ Created integration test in `__tests__/integration/status-update-flow.test.ts`
- Verifies complete flow from save to UI update
- Tests status calculation, database update, and UI refresh logic

## Conclusion

**Task 15.1 is FULLY IMPLEMENTED and VERIFIED.**

All aspects of the status update logic are in place:
1. ✅ Status calculation after save
2. ✅ Database update with new status
3. ✅ UI refresh to fetch updated status
4. ✅ Status badge display with distinct colors
5. ✅ Proper handling of completed_at timestamps
6. ✅ Maintenance of selected state after refresh

The implementation satisfies both Requirements 9.5 and 11.5 completely.
