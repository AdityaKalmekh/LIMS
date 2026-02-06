/**
 * Reports Page Component
 * 
 * Main page for the Patient Test Report Management System.
 * This page allows lab technicians to:
 * - View patients with assigned tests
 * - Select a patient to view their test assignments
 * - Select a test to expand its report form
 * - Navigate between reports using arrow keys
 * - Enter and save test results
 * 
 * Features:
 * - Fetches patients with test assignments on mount
 * - Manages selection state for patients and test assignments
 * - Handles keyboard navigation (left/right arrow keys)
 * - Displays loading, error, and empty states
 * - Orchestrates child components (PatientList, TestAssignmentList, ReportFormContainer)
 * 
 * Requirements: 1.1, 3.1, 3.2, 4.1, 4.2, 4.3, 4.4, 4.5
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { PatientList } from '@/components/reports/PatientList'
import { TestAssignmentList } from '@/components/reports/TestAssignmentList'
import { ReportFormContainer } from '@/components/reports/ReportFormContainer'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AlertCircle, FileText } from 'lucide-react'
import { typography, spacing } from '@/lib/typography'
import { cn } from '@/lib/utils'
import type { 
  PatientWithTests, 
  TestAssignmentWithStatus,
  ReportData,
  PatientsWithTestsResponse
} from '@/types/reports'

/**
 * Reports Page Component
 */
export default function ReportsPage() {
  // State management
  const [patients, setPatients] = useState<PatientWithTests[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [selectedTestAssignmentId, setSelectedTestAssignmentId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Get selected patient data
   */
  const selectedPatient = patients.find(p => p.id === selectedPatientId)

  /**
   * Get test assignments for selected patient
   */
  const testAssignments = selectedPatient?.testAssignments || []

  /**
   * Get selected test assignment data
   */
  const selectedTestAssignment = testAssignments.find(
    ta => ta.id === selectedTestAssignmentId
  )

  /**
   * Load patients with test assignments on mount
   */
  useEffect(() => {
    loadPatientsWithTests()
  }, [])

  /**
   * Fetch patients with test assignments from API
   */
  const loadPatientsWithTests = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/reports/patients')

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to load patients')
      }

      const data: PatientsWithTestsResponse = await response.json()
      setPatients(data.patients || [])

      // Auto-select first patient if available
      if (data.patients && data.patients.length > 0) {
        setSelectedPatientId(data.patients[0].id)
      }
    } catch (err) {
      console.error('Error loading patients:', err)
      setError(err instanceof Error ? err.message : 'Failed to load patients')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle patient selection
   * Updates selected patient and clears test assignment selection
   */
  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId)
    setSelectedTestAssignmentId(null) // Clear test selection when patient changes
  }

  /**
   * Handle test assignment selection
   * Expands the report form for the selected test
   * Collapses any previously expanded form
   */
  const handleTestSelect = (testAssignmentId: string) => {
    // If clicking the same test, collapse it
    if (selectedTestAssignmentId === testAssignmentId) {
      setSelectedTestAssignmentId(null)
    } else {
      // Expand the new test (automatically collapses previous)
      setSelectedTestAssignmentId(testAssignmentId)
    }
  }

  /**
   * Handle keyboard navigation
   * Left arrow: previous test
   * Right arrow: next test
   */
  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    // Only handle arrow keys when a test is selected
    if (!selectedTestAssignmentId || testAssignments.length === 0) {
      return
    }

    // Find current test index
    const currentIndex = testAssignments.findIndex(
      ta => ta.id === selectedTestAssignmentId
    )

    if (currentIndex === -1) {
      return
    }

    // Handle left arrow (previous test)
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      if (currentIndex > 0) {
        setSelectedTestAssignmentId(testAssignments[currentIndex - 1].id)
      }
      // If already at first test, do nothing (stay on first)
    }

    // Handle right arrow (next test)
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      if (currentIndex < testAssignments.length - 1) {
        setSelectedTestAssignmentId(testAssignments[currentIndex + 1].id)
      }
      // If already at last test, do nothing (stay on last)
    }
  }, [selectedTestAssignmentId, testAssignments])

  /**
   * Add keyboard event listener
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardNavigation)
    return () => {
      window.removeEventListener('keydown', handleKeyboardNavigation)
    }
  }, [handleKeyboardNavigation])

  /**
   * Handle navigation from report form (next/prev buttons)
   */
  const handleNavigate = (direction: 'next' | 'prev') => {
    if (!selectedTestAssignmentId || testAssignments.length === 0) {
      return
    }

    const currentIndex = testAssignments.findIndex(
      ta => ta.id === selectedTestAssignmentId
    )

    if (currentIndex === -1) {
      return
    }

    if (direction === 'prev' && currentIndex > 0) {
      setSelectedTestAssignmentId(testAssignments[currentIndex - 1].id)
    } else if (direction === 'next' && currentIndex < testAssignments.length - 1) {
      setSelectedTestAssignmentId(testAssignments[currentIndex + 1].id)
    }
  }

  /**
   * Handle report save
   * Saves report data and refreshes patient list to update status
   */
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
      throw error // Re-throw to let ReportFormContainer handle the error
    }
  }

  /**
   * Render loading state
   */
  if (isLoading) {
    return (
      <div className={spacing.sectionSpacing}>
        <div className="border-b border-gray-200 pb-5">
          <h1 className={typography.h1}>Reports</h1>
          <p className={cn('mt-2', typography.muted)}>
            View and enter patient test results
          </p>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className={cn('mt-4', typography.muted)}>Loading patients...</p>
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
          <h1 className={typography.h1}>Reports</h1>
          <p className={cn('mt-2', typography.muted)}>
            View and enter patient test results
          </p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
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
          <h1 className={typography.h1}>Reports</h1>
          <p className={cn('mt-2', typography.muted)}>
            View and enter patient test results
          </p>
        </div>

        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className={typography.h3}>No patients with test assignments</h3>
          <p className={cn('mt-2', typography.muted)}>
            Patients will appear here once they have been assigned lab tests.
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
        <h1 className={typography.h1}>Reports</h1>
        <p className={cn('mt-2', typography.muted)}>
          View and enter patient test results
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient List */}
        <div className="lg:col-span-3">
          <div className="sticky top-4">
            <h2 className={cn('mb-4', typography.h3)}>Patients</h2>
            <PatientList
              patients={patients}
              selectedPatientId={selectedPatientId}
              onPatientSelect={handlePatientSelect}
            />
          </div>
        </div>

        {/* Middle Column: Test Assignment List */}
        <div className="lg:col-span-3">
          <div className="sticky top-4">
            <h2 className={cn('mb-4', typography.h3)}>Test Assignments</h2>
            {selectedPatient ? (
              <TestAssignmentList
                testAssignments={testAssignments}
                selectedTestId={selectedTestAssignmentId}
                onTestSelect={handleTestSelect}
              />
            ) : (
              <Alert>
                <AlertDescription>
                  Select a patient to view their test assignments
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Right Column: Report Form */}
        <div className="lg:col-span-6">
          <h2 className={cn('mb-4', typography.h3)}>Report Form</h2>
          {selectedTestAssignment ? (
            <ReportFormContainer
              testAssignmentId={selectedTestAssignment.id}
              reportTypeCode={selectedTestAssignment.reportTypeCode}
              onSave={handleSave}
              onNavigate={handleNavigate}
            />
          ) : (
            <Alert>
              <AlertDescription>
                Select a test assignment to view and enter report data
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Keyboard Navigation Hint */}
      {selectedTestAssignmentId && testAssignments.length > 1 && (
        <div className="mt-6 text-center">
          <p className={cn('text-xs', typography.muted)}>
            Use ← → arrow keys to navigate between reports
          </p>
        </div>
      )}
    </div>
  )
}
