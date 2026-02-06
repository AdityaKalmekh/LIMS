/**
 * Report Instances API Route
 * 
 * Handles API requests for fetching report instance data for a specific test assignment.
 * 
 * Endpoints:
 * - GET /api/reports/instances/[testAssignmentId] - Fetch report instance and values
 * 
 * Authentication:
 * All endpoints require authentication via Supabase Auth.
 * 
 * Error Handling:
 * - 400: Invalid test assignment ID format
 * - 401: Unauthorized (not authenticated)
 * - 404: Test assignment not found
 * - 500: Server errors
 * 
 * Requirements: 3.3, 14.2, 14.3
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { 
  ReportInstance,
  ReportInstanceDataResponse,
  ReportInstanceDbRecord,
  ReportValueDbRecord,
  ReportFieldDbRecord
} from '@/types'

/**
 * GET /api/reports/instances/[testAssignmentId]
 * 
 * Fetches existing report instance and values for a test assignment.
 * Joins report_values with report_fields to transform EAV data into a key-value object.
 * Returns null for reportInstance if no report has been created yet.
 * 
 * Path Parameters:
 * - testAssignmentId: UUID of the test assignment
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
 *   } | null,
 *   values: {
 *     [fieldName: string]: any
 *   }
 * }
 * 
 * Status Codes:
 * - 200: Report instance data fetched successfully (or null if not exists)
 * - 400: Invalid test assignment ID format
 * - 401: Unauthorized
 * - 404: Test assignment not found
 * - 500: Server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ testAssignmentId: string }> }
) {
  try {
    // Await params to get the testAssignmentId
    const { testAssignmentId } = await params

    // Create Supabase client
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be logged in to view report instances',
        },
        { status: 401 }
      )
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(testAssignmentId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid test assignment ID',
          message: 'Test assignment ID must be a valid UUID',
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

    // Fetch report instance for this test assignment
    const { data: reportInstanceData, error: reportInstanceError } = await supabase
      .from('report_instances')
      .select('*')
      .eq('test_assignment_id', testAssignmentId)
      .maybeSingle()

    // Handle database errors (but not "not found" - that's expected)
    if (reportInstanceError) {
      console.error('Database error fetching report instance:', reportInstanceError)
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Failed to fetch report instance. Please try again.',
        },
        { status: 500 }
      )
    }

    // If no report instance exists yet, return null with empty values
    if (!reportInstanceData) {
      const response: ReportInstanceDataResponse = {
        reportInstance: null,
        values: {}
      }
      return NextResponse.json(response, { status: 200 })
    }

    // Transform report instance from snake_case to camelCase
    const reportInstance: ReportInstance = {
      id: reportInstanceData.id,
      testAssignmentId: reportInstanceData.test_assignment_id,
      reportTypeId: reportInstanceData.report_type_id,
      status: reportInstanceData.status as 'pending' | 'in-progress' | 'completed',
      createdBy: reportInstanceData.created_by,
      createdAt: reportInstanceData.created_at,
      updatedAt: reportInstanceData.updated_at,
      completedAt: reportInstanceData.completed_at
    }

    // Fetch all report values for this report instance, joined with field definitions
    const { data: reportValuesData, error: reportValuesError } = await supabase
      .from('report_values')
      .select(`
        id,
        report_instance_id,
        report_field_id,
        value_text,
        value_number,
        created_at,
        updated_at,
        report_fields!inner (
          field_name,
          field_type
        )
      `)
      .eq('report_instance_id', reportInstance.id)

    if (reportValuesError) {
      console.error('Database error fetching report values:', reportValuesError)
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Failed to fetch report values. Please try again.',
        },
        { status: 500 }
      )
    }

    // Transform EAV data into key-value object
    const values: Record<string, any> = {}
    
    if (reportValuesData && reportValuesData.length > 0) {
      reportValuesData.forEach((valueRecord: any) => {
        const fieldName = valueRecord.report_fields.field_name
        const fieldType = valueRecord.report_fields.field_type
        
        // Use the appropriate value column based on field type
        if (fieldType === 'number') {
          values[fieldName] = valueRecord.value_number
        } else {
          // text, dropdown, textarea all use value_text
          values[fieldName] = valueRecord.value_text
        }
      })
    }

    const response: ReportInstanceDataResponse = {
      reportInstance,
      values
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Unexpected error in GET /api/reports/instances/[testAssignmentId]:', error)

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
