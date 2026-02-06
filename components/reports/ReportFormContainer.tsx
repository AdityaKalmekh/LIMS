/**
 * Report Form Container Component
 * 
 * Manages the lifecycle and operations of report forms including:
 * - Loading report type definitions and field specifications
 * - Loading existing report data
 * - Handling field changes and validation
 * - Saving report data to the database
 * - Displaying save status feedback
 * 
 * This container component orchestrates the report form experience by:
 * 1. Fetching report type definition and fields on mount
 * 2. Loading any existing saved data for the report
 * 3. Dynamically rendering the appropriate form component
 * 4. Managing form state and validation
 * 5. Persisting data with proper error handling
 * 6. Providing real-time feedback on save operations
 * 
 * Requirements: 3.3, 5.2, 5.3, 5.4, 5.5, 5.6, 13.1, 13.2, 13.3, 13.4, 13.5, 14.2, 14.3, 14.4
 * 
 * Usage:
 * ```tsx
 * <ReportFormContainer
 *   testAssignmentId="uuid"
 *   reportTypeCode="BLOOD_GROUP"
 *   onSave={handleSave}
 *   onNavigate={handleNavigate}
 * />
 * ```
 */

'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  ReportType,
  ReportField,
  ReportData,
  ReportFormState,
  ReportTypeDefinitionResponse,
  ReportInstanceDataResponse,
  SaveReportResponse
} from '@/types/reports'
import { validateReportForm, validationErrorsToMap } from '@/lib/validation/form-validator'
import { getReportFormComponent } from './forms/registry'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

interface ReportFormContainerProps {
  testAssignmentId: string
  reportTypeCode: string
  onSave: (data: ReportData) => Promise<void>
  onNavigate: (direction: 'next' | 'prev') => void
}

/**
 * ReportFormContainer Component
 * 
 * Main container component that manages report form state and operations.
 * Handles loading, validation, saving, and user feedback.
 */
export function ReportFormContainer({
  testAssignmentId,
  reportTypeCode,
  onSave,
  onNavigate
}: ReportFormContainerProps) {
  // Form state
  const [state, setState] = useState<ReportFormState>({
    reportType: null,
    reportFields: [],
    reportData: {},
    validationErrors: {},
    isSaving: false,
    saveStatus: 'idle'
  })

  // Loading states
  const [isLoadingDefinition, setIsLoadingDefinition] = useState(true)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Report instance ID (for updates)
  const [reportInstanceId, setReportInstanceId] = useState<string | null>(null)

  /**
   * Load report type definition and field specifications
   * Fetches the report type and its fields from the API
   */
  const loadReportDefinition = async () => {
    try {
      setIsLoadingDefinition(true)
      setLoadError(null)

      const response = await fetch(`/api/reports/types/${reportTypeCode}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to load report definition')
      }

      const data: ReportTypeDefinitionResponse = await response.json()

      setState(prev => ({
        ...prev,
        reportType: data.reportType,
        reportFields: data.fields,
        // Initialize data with default values
        reportData: data.fields.reduce((acc, field) => {
          if (field.defaultValue) {
            acc[field.fieldName] = field.defaultValue
          }
          return acc
        }, {} as Record<string, any>)
      }))
    } catch (error) {
      console.error('Error loading report definition:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load report definition'
      setLoadError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoadingDefinition(false)
    }
  }

  /**
   * Load existing report data if it exists
   * Fetches saved report values and populates the form
   */
  const loadExistingData = async () => {
    try {
      setIsLoadingData(true)

      const response = await fetch(`/api/reports/instances/${testAssignmentId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to load report data')
      }

      const data: ReportInstanceDataResponse = await response.json()

      // If report instance exists, update state with saved values
      if (data.reportInstance) {
        setReportInstanceId(data.reportInstance.id)
        
        setState(prev => ({
          ...prev,
          reportData: {
            ...prev.reportData, // Keep default values
            ...data.values // Override with saved values
          }
        }))
      }
    } catch (error) {
      console.error('Error loading report data:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load report data'
      // Don't show error toast for loading data - just log it
      // The form will still be usable with default/empty values
      console.warn('Could not load existing report data:', errorMessage)
    } finally {
      setIsLoadingData(false)
    }
  }

  /**
   * Handle field value changes
   * Updates the field value and performs validation
   */
  const handleFieldChange = (fieldName: string, value: any) => {
    setState(prev => {
      // Update the field value
      const newData = {
        ...prev.reportData,
        [fieldName]: value
      }

      // Validate the form with the new data
      const validationResult = validateReportForm(prev.reportFields, newData)
      const newErrors = validationErrorsToMap(validationResult.errors)

      return {
        ...prev,
        reportData: newData,
        validationErrors: newErrors,
        saveStatus: 'idle' // Reset save status when data changes
      }
    })
  }

  /**
   * Validate the entire form
   * Returns true if all validations pass, false otherwise
   */
  const validateForm = (): boolean => {
    const validationResult = validateReportForm(state.reportFields, state.reportData)
    const errors = validationErrorsToMap(validationResult.errors)

    setState(prev => ({
      ...prev,
      validationErrors: errors
    }))

    return validationResult.isValid
  }

  /**
   * Handle save operation
   * Validates the form, persists data to the database, and updates status
   */
  const handleSave = async () => {
    try {
      // Validate form before saving
      const isValid = validateForm()

      if (!isValid) {
        toast.error('Please fix validation errors before saving')
        return
      }

      // Set saving state
      setState(prev => ({
        ...prev,
        isSaving: true,
        saveStatus: 'saving'
      }))

      // Prepare save request
      const saveData: ReportData = {
        reportInstanceId,
        testAssignmentId,
        reportTypeId: state.reportType!.id,
        values: state.reportData
      }

      // Call the onSave callback (which will call the API)
      await onSave(saveData)

      // Update save status to success
      setState(prev => ({
        ...prev,
        isSaving: false,
        saveStatus: 'success'
      }))

      // Show success message
      toast.success('Report saved successfully')

      // Clear success message after 3 seconds
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          saveStatus: 'idle'
        }))
      }, 3000)
    } catch (error) {
      console.error('Error saving report:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save report'

      // Update save status to error
      setState(prev => ({
        ...prev,
        isSaving: false,
        saveStatus: 'error'
      }))

      // Show error message
      toast.error(errorMessage)

      // Note: We preserve entered data on save failure (already in state)
    }
  }

  // Load report definition on mount or when reportTypeCode changes
  useEffect(() => {
    loadReportDefinition()
  }, [reportTypeCode])

  // Load existing data after definition is loaded
  useEffect(() => {
    if (!isLoadingDefinition && state.reportType) {
      loadExistingData()
    }
  }, [isLoadingDefinition, state.reportType, testAssignmentId])

  // Show loading spinner while loading definition
  if (isLoadingDefinition) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground">Loading report form...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show error if loading failed
  if (loadError || !state.reportType) {
    return (
      <Card>
        <CardContent className="py-8">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {loadError || 'Failed to load report form. Please try again.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // Get the appropriate form component for this report type
  const FormComponent = getReportFormComponent(reportTypeCode)

  // Determine if save button should be disabled
  const isSaveDisabled = state.isSaving || Object.keys(state.validationErrors).length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{state.reportType.name}</CardTitle>
        {state.reportType.description && (
          <p className="text-sm text-muted-foreground">{state.reportType.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Loading indicator for existing data */}
        {isLoadingData && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>Loading saved data...</AlertDescription>
          </Alert>
        )}

        {/* Render the form component */}
        <FormComponent
          fields={state.reportFields}
          data={state.reportData}
          errors={state.validationErrors}
          onChange={handleFieldChange}
        />

        {/* Save status messages */}
        {state.saveStatus === 'success' && (
          <Alert className="border-green-500 bg-green-50 text-green-900">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>Report saved successfully!</AlertDescription>
          </Alert>
        )}

        {state.saveStatus === 'error' && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to save report. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onNavigate('prev')}
              disabled={state.isSaving}
            >
              Previous Report
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate('next')}
              disabled={state.isSaving}
            >
              Next Report
            </Button>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaveDisabled}
            className="min-w-[120px]"
          >
            {state.isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Report'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
