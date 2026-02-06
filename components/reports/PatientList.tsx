/**
 * PatientList Component
 * 
 * Displays a list of patients with assigned tests in the Reports section.
 * Each patient card shows:
 * - Patient name, ID, age, gender, and contact information
 * - Badge with count of pending/in-progress tests
 * - Visual highlighting of selected patient
 * - Click handling to select patient
 * 
 * This component is used in the Reports page to show all patients who have
 * test assignments and allow the lab technician to select a patient to view
 * their test assignments.
 * 
 * Requirements: 1.2, 1.4
 * 
 * Usage:
 * ```tsx
 * <PatientList
 *   patients={patients}
 *   selectedPatientId={selectedId}
 *   onPatientSelect={handlePatientSelect}
 * />
 * ```
 */

'use client'

import { PatientListProps, PatientWithTests } from '@/types/reports'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Phone, Calendar, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Calculate the count of pending and in-progress tests for a patient
 */
function getPendingTestCount(patient: PatientWithTests): number {
  return patient.testAssignments.filter(
    (assignment) => 
      assignment.reportStatus === 'pending' || 
      assignment.reportStatus === 'in-progress'
  ).length
}

/**
 * Format age for display
 * Converts numeric age to readable format with years
 */
function formatAge(age: number): string {
  if (age === 0) {
    return 'Newborn'
  } else if (age === 1) {
    return '1 year'
  } else {
    return `${age} years`
  }
}

/**
 * Format gender for display
 * Capitalizes first letter
 */
function formatGender(gender: string): string {
  return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
}

/**
 * PatientList Component
 * 
 * Renders a list of patient cards with selection handling
 */
export function PatientList({
  patients,
  selectedPatientId,
  onPatientSelect
}: PatientListProps) {
  // Empty state
  if (patients.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-gray-400 mb-4">
            <User className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No patients with assigned tests
          </h3>
          <p className="text-sm text-gray-500 text-center max-w-sm">
            Patients will appear here once they have been assigned lab tests
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {patients.map((patient) => (
        <PatientCard
          key={patient.id}
          patient={patient}
          isSelected={patient.id === selectedPatientId}
          onSelect={() => onPatientSelect(patient.id)}
        />
      ))}
    </div>
  )
}

/**
 * PatientCard Component
 * 
 * Individual card for a single patient
 */
interface PatientCardProps {
  patient: PatientWithTests
  isSelected: boolean
  onSelect: () => void
}

function PatientCard({
  patient,
  isSelected,
  onSelect
}: PatientCardProps) {
  const pendingTestCount = getPendingTestCount(patient)

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        isSelected && 'ring-2 ring-primary shadow-md bg-primary/5'
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left side: Patient info */}
          <div className="flex-1 min-w-0">
            {/* Patient name and avatar */}
            <div className="flex items-center gap-3 mb-3">
              <div className={cn(
                'flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center',
                isSelected ? 'bg-primary/20' : 'bg-blue-100'
              )}>
                <User className={cn(
                  'h-5 w-5',
                  isSelected ? 'text-primary' : 'text-blue-600'
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  'text-base font-semibold truncate',
                  isSelected ? 'text-primary' : 'text-gray-900'
                )}>
                  {patient.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Hash className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{patient.patientId}</span>
                </div>
              </div>
            </div>

            {/* Patient details grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {/* Age */}
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">{formatAge(patient.age)}</span>
              </div>

              {/* Gender */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">Gender:</span>
                <span className="text-gray-600">{formatGender(patient.gender)}</span>
              </div>

              {/* Contact */}
              <div className="flex items-center gap-2 col-span-2">
                <Phone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">{patient.contact}</span>
              </div>
            </div>
          </div>

          {/* Right side: Test count badge */}
          <div className="flex-shrink-0">
            {pendingTestCount > 0 ? (
              <Badge variant="warning" className="text-xs">
                {pendingTestCount} {pendingTestCount === 1 ? 'test' : 'tests'}
              </Badge>
            ) : (
              <Badge variant="success" className="text-xs">
                All complete
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
