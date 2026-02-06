/**
 * Report Instances API Route
 * 
 * Handles API requests for creating and updating report instances.
 * 
 * Endpoints:
 * - POST /api/reports/instances - Create or update a report instance
 * 
 * Authentication:
 * All endpoints require authentication via Supabase Auth.
 * 
 * Error Handling:
 * - 400: Invalid request body or validation errors
 * - 401: Unauthorized (not authenticated)
 * - 404: Test assignment or report type not found
 * - 500: Server errors
 * 
 * Requirements: 5.3, 11.2, 11.3, 11.5
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { 
  SaveReportRequest,
  SaveReportResponse,
  ReportInstance,
  ReportInstanceDbRecord,
  ReportFieldDbRecord
} from '@/types'

/**
 * Calculate report status based on field completeness
 * 
 * @param values - The values object containing field data
 * @param requiredFields - Array of required field names
 * @returns 'pending' if no values, 'completed' if all required fields filled, 'in-progress' otherwise
 */
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
    // Check if value exists and is not empty string
    return value !== undefined && value !== null && value !== ''
  })

  if (allRequiredFieldsFilled) {
    return 'completed'
  }

  return 'in-progress'
}

/**
 * POST /api/reports/instances
 * 
 * Creates or updates a report instance with field values.
 * Implements upsert logic: creates new instance if none exists, updates existing instance.
 * Calculates report status based on field completeness.
 * Transforms values object into EAV records for report_values table.
 * 
 * Request Body:
 * {
 *   testAssignmentId: string,
 *   reportTypeId: string,
 *   values: {
 *     [fieldName: string]: any
 *   }
 * }
 * 
 * Response:
 * {
 *   reportInstance: {
 *     id: string,
 *     testAssignmentId: string,
 *     reportTypeId: string,
 *     status: 'pending' | 'in-progress' | 'completed',
 *     createdBy: string,
 *     createdAt: string,
 *     updatedAt: string,
 *     completedAt: string | null
 *   },
 *   status: 'created' | 'updated'
 * }
 * 
 * Status Codes:
 * - 200: Report instance created or updated successfully
 * - 400: Invalid request body
 * - 401: Unauthorized
 * - 404: Test assignment or report type not found
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be logged in to save report data',
        },
        { status: 401 }
      )
    }

    // Parse request body
    let requestBody: SaveReportRequest
    try {
      requestBody = await request.json()
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          message: 'Request body must be valid JSON',
        },
        { status: 400 }
      )
    }

    const { testAssignmentId, reportTypeId, values } = requestBody

    // Validate required fields
    if (!testAssignmentId || !reportTypeId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'testAssignmentId and reportTypeId are required',
        },
        { status: 400 }
      )
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(testAssignmentId) || !uuidRegex.test(reportTypeId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid ID format',
          message: 'testAssignmentId and reportTypeId must be valid UUIDs',
        },
        { status: 400 }
      )
    }

    // Verify test assignment exists
    const { data: testAssignment, error: testAssignmentError } = await supabase
      .from('test_assignments')
      .select('id')
      .eq('id', testAssignmentId)
      .single()

    if (testAssignmentError || !testAssignment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Test assignment not found',
          message: `No test assignment found with ID: ${testAssignmentId}`,
        },
        { status: 404 }
      )
    }

    // Verify report type exists and fetch field definitions
    const { data: reportFields, error: reportFieldsError } = await supabase
      .from('report_fields')
      .select('*')
      .eq('report_type_id', reportTypeId)
      .order('field_order', { ascending: true })

    if (reportFieldsError || !reportFields || reportFields.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Report type not found',
          message: `No report type found with ID: ${reportTypeId}`,
        },
        { status: 404 }
      )
    }

    // Extract required field names
    const requiredFieldNames = reportFields
      .filter((field: ReportFieldDbRecord) => field.is_required)
      .map((field: ReportFieldDbRecord) => field.field_name)

    // Calculate report status based on field completeness
    const reportStatus = calculateReportStatus(values || {}, requiredFieldNames)

    // Check if report instance already exists for this test assignment
    const { data: existingInstance, error: existingInstanceError } = await supabase
      .from('report_instances')
      .select('*')
      .eq('test_assignment_id', testAssignmentId)
      .maybeSingle()

    if (existingInstanceError) {
      console.error('Database error checking existing report instance:', existingInstanceError)
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Failed to check for existing report instance. Please try again.',
        },
        { status: 500 }
      )
    }

    let reportInstanceId: string
    let operationStatus: 'created' | 'updated'

    // Upsert logic: create or update report instance
    if (existingInstance) {
      // Update existing report instance
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

      if (updateError) {
        console.error('Database error updating report instance:', updateError)
        return NextResponse.json(
          {
            success: false,
            error: 'Database error',
            message: 'Failed to update report instance. Please try again.',
          },
          { status: 500 }
        )
      }

      reportInstanceId = existingInstance.id
      operationStatus = 'updated'
    } else {
      // Create new report instance
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

      if (insertError || !newInstance) {
        console.error('Database error creating report instance:', insertError)
        return NextResponse.json(
          {
            success: false,
            error: 'Database error',
            message: 'Failed to create report instance. Please try again.',
          },
          { status: 500 }
        )
      }

      reportInstanceId = newInstance.id
      operationStatus = 'created'
    }

    // Transform values object into EAV records for report_values table
    // Create a map of field names to field IDs
    const fieldNameToIdMap = new Map<string, string>()
    const fieldNameToTypeMap = new Map<string, string>()
    
    reportFields.forEach((field: ReportFieldDbRecord) => {
      fieldNameToIdMap.set(field.field_name, field.id)
      fieldNameToTypeMap.set(field.field_name, field.field_type)
    })

    // Prepare report values for upsert
    const reportValuesToUpsert: any[] = []

    if (values && Object.keys(values).length > 0) {
      for (const [fieldName, value] of Object.entries(values)) {
        const fieldId = fieldNameToIdMap.get(fieldName)
        const fieldType = fieldNameToTypeMap.get(fieldName)

        // Skip if field doesn't exist in report type definition
        if (!fieldId || !fieldType) {
          continue
        }

        // Skip if value is null, undefined, or empty string
        if (value === null || value === undefined || value === '') {
          continue
        }

        // Prepare value record based on field type
        const valueRecord: any = {
          report_instance_id: reportInstanceId,
          report_field_id: fieldId,
          value_text: null,
          value_number: null
        }

        // Store value in appropriate column based on field type
        if (fieldType === 'number') {
          valueRecord.value_number = parseFloat(value)
        } else {
          // text, dropdown, textarea all use value_text
          valueRecord.value_text = String(value)
        }

        reportValuesToUpsert.push(valueRecord)
      }
    }

    // Delete existing values for this report instance before inserting new ones
    // This ensures we don't have stale data if fields were cleared
    const { error: deleteError } = await supabase
      .from('report_values')
      .delete()
      .eq('report_instance_id', reportInstanceId)

    if (deleteError) {
      console.error('Database error deleting old report values:', deleteError)
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Failed to delete old report values. Please try again.',
        },
        { status: 500 }
      )
    }

    // Insert new report values if any
    if (reportValuesToUpsert.length > 0) {
      const { error: insertValuesError } = await supabase
        .from('report_values')
        .insert(reportValuesToUpsert)

      if (insertValuesError) {
        console.error('Database error inserting report values:', insertValuesError)
        return NextResponse.json(
          {
            success: false,
            error: 'Database error',
            message: 'Failed to save report values. Please try again.',
          },
          { status: 500 }
        )
      }
    }

    // Fetch the final report instance to return
    const { data: finalInstance, error: finalInstanceError } = await supabase
      .from('report_instances')
      .select('*')
      .eq('id', reportInstanceId)
      .single()

    if (finalInstanceError || !finalInstance) {
      console.error('Database error fetching final report instance:', finalInstanceError)
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Failed to fetch updated report instance. Please try again.',
        },
        { status: 500 }
      )
    }

    // Transform report instance from snake_case to camelCase
    const reportInstance: ReportInstance = {
      id: finalInstance.id,
      testAssignmentId: finalInstance.test_assignment_id,
      reportTypeId: finalInstance.report_type_id,
      status: finalInstance.status as 'pending' | 'in-progress' | 'completed',
      createdBy: finalInstance.created_by,
      createdAt: finalInstance.created_at,
      updatedAt: finalInstance.updated_at,
      completedAt: finalInstance.completed_at
    }

    const response: SaveReportResponse = {
      reportInstance,
      status: operationStatus
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Unexpected error in POST /api/reports/instances:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    )
  }
}
