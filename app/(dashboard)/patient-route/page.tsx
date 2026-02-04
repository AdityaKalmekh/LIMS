/**
 * Patient Route Page
 * 
 * Main page for assigning lab tests to registered patients.
 * This page allows administrators to:
 * - View all unassigned patients
 * - Select multiple patients
 * - Assign lab tests (CBC, BG, VDRL) to each patient
 * - Submit assignments to transition patients into the reports workflow
 * 
 * Features:
 * - Fetches unassigned patients on mount
 * - Manages selection state for patients and test assignments
 * - Validates that selected patients have at least one test assigned
 * - Displays loading, error, and empty states
 * - Shows success/error messages after submission
 * - Refreshes patient list after successful submission
 * 
 * Requirements: 1.1, 1.3, 1.4, 3.2, 3.6, 4.1, 4.2, 4.3
 */

'use client'

import { useState, useEffect } from 'react'
import { PatientAssignmentTable } from '@/components/patients/PatientAssignmentTable'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, CheckCircle2, Users } from 'lucide-react'
import { typography, spacing } from '@/lib/typography'
import { cn } from '@/lib/utils'
import type { 
  Patient, 
  TestType, 
  UnassignedPatientsResponse,
  CreateTestAssignmentsRequest,
  CreateTestAssignmentsResponse
} from '@/types'

/**
 * Patient Route Page Component
 */
export default function PatientRoutePage() {
  // State management
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set())
  const [testAssignments, setTestAssignments] = useState<Map<string, Set<TestType>>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  /**
   * Fetch unassigned patients on mount
   */
  useEffect(() => {
    fetchUnassignedPatients()
  }, [])

  /**
   * Fetch unassigned patients from API
   */
  const fetchUnassignedPatients = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/patients/unassigned')
      const data: UnassignedPatientsResponse = await response.json()

      if (!response.ok || !data.success) {
        const errorMessage = !data.success ? data.error : 'Failed to fetch patients'
        throw new Error(errorMessage)
      }

      setPatients(data.data || [])
    } catch (err) {
      console.error('Error fetching unassigned patients:', err)
      setError(err instanceof Error ? err.message : 'Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle patient selection toggle
   */
  const handlePatientSelect = (patientId: string, selected: boolean) => {
    setSelectedPatients(prev => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(patientId)
      } else {
        newSet.delete(patientId)
      }
      return newSet
    })

    // Clear validation error when selection changes
    if (validationError) {
      setValidationError(null)
    }
  }

  /**
   * Handle test assignment change for a patient
   */
  const handleTestAssignmentChange = (patientId: string, tests: Set<TestType>) => {
    setTestAssignments(prev => {
      const newMap = new Map(prev)
      if (tests.size > 0) {
        newMap.set(patientId, tests)
      } else {
        newMap.delete(patientId)
      }
      return newMap
    })

    // Clear validation error when test assignments change
    if (validationError) {
      setValidationError(null)
    }
  }

  /**
   * Validate submission before sending to API
   * Returns true if valid, false otherwise
   */
  const validateSubmission = (): boolean => {
    // Check if any patients are selected
    if (selectedPatients.size === 0) {
      setValidationError('Please select at least one patient')
      return false
    }

    // Check if all selected patients have at least one test assigned
    const patientsWithoutTests: string[] = []
    selectedPatients.forEach(patientId => {
      const tests = testAssignments.get(patientId)
      if (!tests || tests.size === 0) {
        const patient = patients.find(p => p.id === patientId)
        if (patient) {
          patientsWithoutTests.push(`${patient.firstName} ${patient.lastName}`)
        }
      }
    })

    if (patientsWithoutTests.length > 0) {
      setValidationError(
        `Please assign at least one test to: ${patientsWithoutTests.join(', ')}`
      )
      return false
    }

    return true
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    // Clear previous messages
    setSuccessMessage(null)
    setValidationError(null)
    setError(null)

    // Validate submission
    if (!validateSubmission()) {
      return
    }

    try {
      setSubmitting(true)

      // Prepare request data
      const requestData: CreateTestAssignmentsRequest = {
        assignments: Array.from(selectedPatients).map(patientId => ({
          patientId,
          tests: Array.from(testAssignments.get(patientId) || [])
        }))
      }

      // Submit to API
      const response = await fetch('/api/test-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const data: CreateTestAssignmentsResponse = await response.json()

      if (!response.ok || !data.success) {
        const errorMessage = !data.success ? data.error : 'Failed to create test assignments'
        throw new Error(errorMessage)
      }

      // Show success message
      const patientCount = selectedPatients.size
      setSuccessMessage(
        `Successfully assigned tests to ${patientCount} patient${patientCount > 1 ? 's' : ''}`
      )

      // Clear selection state
      setSelectedPatients(new Set())
      setTestAssignments(new Map())

      // Refresh patient list to remove submitted patients
      await fetchUnassignedPatients()
    } catch (err) {
      console.error('Error submitting test assignments:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit test assignments')
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className={spacing.sectionSpacing}>
        <div className="border-b border-gray-200 pb-5">
          <h1 className={typography.h1}>Patient Route</h1>
          <p className={cn('mt-2', typography.muted)}>
            Assign lab tests to registered patients
          </p>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className={typography.muted}>Loading patients...</p>
          </div>
        </div>
      </div>
    )
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <div className={spacing.sectionSpacing}>
        <div className="border-b border-gray-200 pb-5">
          <h1 className={typography.h1}>Patient Route</h1>
          <p className={cn('mt-2', typography.muted)}>
            Assign lab tests to registered patients
          </p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>

        <Button onClick={fetchUnassignedPatients} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  /**
   * Render empty state
   */
  if (patients.length === 0) {
    return (
      <div className={spacing.sectionSpacing}>
        <div className="border-b border-gray-200 pb-5">
          <h1 className={typography.h1}>Patient Route</h1>
          <p className={cn('mt-2', typography.muted)}>
            Assign lab tests to registered patients
          </p>
        </div>

        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className={typography.h3}>No unassigned patients</h3>
          <p className={cn('mt-2', typography.muted)}>
            All registered patients have been assigned to lab tests.
          </p>
        </div>
      </div>
    )
  }

  /**
   * Render main content
   */
  return (
    <div className={spacing.sectionSpacing}>
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className={typography.h1}>Patient Route</h1>
        <p className={cn('mt-2', typography.muted)}>
          Assign lab tests to registered patients
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Validation Error */}
      {validationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {validationError}
          </AlertDescription>
        </Alert>
      )}

      {/* Submission Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Patient Assignment Table */}
      <PatientAssignmentTable
        patients={patients}
        selectedPatients={selectedPatients}
        testAssignments={testAssignments}
        onPatientSelect={handlePatientSelect}
        onTestAssignmentChange={handleTestAssignmentChange}
      />

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <Button
          onClick={handleSubmit}
          disabled={selectedPatients.size === 0 || submitting}
          size="lg"
          className="min-w-[200px]"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Assignments
              {selectedPatients.size > 0 && (
                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {selectedPatients.size}
                </span>
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
