/**
 * Patient Assignment Table Component
 * 
 * Displays patients in a table format with selection checkboxes and test assignment dropdowns.
 * This component is used in the Patient Route page for assigning lab tests to patients.
 * 
 * Features:
 * - Checkbox column for patient selection
 * - Patient information columns (Name, Mobile, Sex, Age, Referred By)
 * - Test selection dropdown column (replaces "Registered" date)
 * - Highlight selected rows with background color
 * - Mobile-responsive card view fallback
 * - Consistent styling with existing dashboard components
 * 
 * Usage:
 * ```tsx
 * <PatientAssignmentTable
 *   patients={patients}
 *   selectedPatients={selectedPatients}
 *   testAssignments={testAssignments}
 *   onPatientSelect={(patientId, selected) => handleSelect(patientId, selected)}
 *   onTestAssignmentChange={(patientId, tests) => handleTestChange(patientId, tests)}
 * />
 * ```
 */

'use client'

import { Patient, TestType } from '@/types'
import { TestSelectionDropdown } from './TestSelectionDropdown'
import { Checkbox } from '@/components/ui/checkbox'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Props for PatientAssignmentTable component
 */
export interface PatientAssignmentTableProps {
  /**
   * Array of patients to display
   */
  patients: Patient[]
  /**
   * Set of selected patient IDs
   */
  selectedPatients: Set<string>
  /**
   * Map of patient IDs to their selected test types
   */
  testAssignments: Map<string, Set<TestType>>
  /**
   * Callback when a patient is selected or deselected
   */
  onPatientSelect: (patientId: string, selected: boolean) => void
  /**
   * Callback when test assignments change for a patient
   */
  onTestAssignmentChange: (patientId: string, tests: Set<TestType>) => void
}

/**
 * PatientAssignmentTable Component
 * 
 * Displays patients in a table format with selection and test assignment controls.
 * Adapts to mobile screens with a card-based layout.
 */
export function PatientAssignmentTable({
  patients,
  selectedPatients,
  testAssignments,
  onPatientSelect,
  onTestAssignmentChange,
}: PatientAssignmentTableProps) {
  /**
   * Handle checkbox change for patient selection
   */
  const handleCheckboxChange = (patientId: string, checked: boolean) => {
    onPatientSelect(patientId, checked)
  }

  /**
   * Get selected tests for a patient (or empty set if none)
   */
  const getSelectedTests = (patientId: string): Set<TestType> => {
    return testAssignments.get(patientId) || new Set<TestType>()
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left w-12">
                  <span className="sr-only">Select</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sex
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referred By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tests
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => {
                const isSelected = selectedPatients.has(patient.id)
                return (
                  <tr
                    key={patient.id}
                    className={cn(
                      'transition-colors',
                      isSelected && 'bg-blue-50 hover:bg-blue-100',
                      !isSelected && 'hover:bg-gray-50'
                    )}
                  >
                    {/* Selection Checkbox */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="p-2 -m-2 inline-block">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(patient.id, checked === true)
                          }
                          aria-label={`Select ${patient.firstName} ${patient.lastName}`}
                          className="h-4 w-4"
                        />
                      </div>
                    </td>

                    {/* Patient Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {patient.title} {patient.firstName} {patient.lastName}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Mobile Number */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.mobileNumber}</div>
                    </td>

                    {/* Sex */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.sex}</div>
                    </td>

                    {/* Age */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatAge(patient.ageYears, patient.ageMonths, patient.ageDays)}
                      </div>
                    </td>

                    {/* Referred By */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {patient.referredBy || '-'}
                      </div>
                    </td>

                    {/* Test Selection Dropdown */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-48">
                        <TestSelectionDropdown
                          patientId={patient.id}
                          selectedTests={getSelectedTests(patient.id)}
                          onChange={(tests) => onTestAssignmentChange(patient.id, tests)}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {patients.map((patient) => {
          const isSelected = selectedPatients.has(patient.id)
          return (
            <div
              key={patient.id}
              className={cn(
                'bg-white rounded-lg shadow-sm border p-4 transition-colors',
                isSelected && 'border-blue-500 bg-blue-50',
                !isSelected && 'border-gray-200'
              )}
            >
              {/* Header with Checkbox and Name */}
              <div className="flex items-start space-x-3 mb-3">
                {/* Larger touch target for mobile checkbox */}
                <div className="pt-1 p-2 -m-2">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(patient.id, checked === true)
                    }
                    aria-label={`Select ${patient.firstName} ${patient.lastName}`}
                    className="h-5 w-5"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {patient.title} {patient.firstName} {patient.lastName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Details */}
              <div className="space-y-2 mb-3 pl-9">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Mobile:</span>
                  <span className="text-gray-900 font-medium">{patient.mobileNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sex:</span>
                  <span className="text-gray-900">{patient.sex}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Age:</span>
                  <span className="text-gray-900">
                    {formatAge(patient.ageYears, patient.ageMonths, patient.ageDays)}
                  </span>
                </div>
                {patient.referredBy && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Referred By:</span>
                    <span className="text-gray-900">{patient.referredBy}</span>
                  </div>
                )}
              </div>

              {/* Test Selection */}
              <div className="pl-9">
                <div className="text-xs text-gray-500 mb-2 font-medium">Select Tests:</div>
                <div className="touch-manipulation">
                  <TestSelectionDropdown
                    patientId={patient.id}
                    selectedTests={getSelectedTests(patient.id)}
                    onChange={(tests) => onTestAssignmentChange(patient.id, tests)}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Helper function to format age
 */
function formatAge(years: number, months?: number, days?: number): string {
  const parts: string[] = []
  
  if (years > 0) {
    parts.push(`${years}Y`)
  }
  if (months && months > 0) {
    parts.push(`${months}M`)
  }
  if (days && days > 0) {
    parts.push(`${days}D`)
  }
  
  return parts.length > 0 ? parts.join(' ') : '0Y'
}
