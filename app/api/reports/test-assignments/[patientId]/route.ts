/**
 * Test Assignments by Patient API Route
 * 
 * Handles API requests for fetching test assignments for a specific patient
 * with their report status for the reports section.
 * 
 * Endpoints:
 * - GET /api/reports/test-assignments/[patientId] - Fetch test assignments for specific patient
 * 
 * Authentication:
 * All endpoints require authentication via Supabase Auth.
 * 
 * Error Handling:
 * - 400: Invalid patient ID format
 * - 401: Unauthorized (not authenticated)
 * - 404: Patient not found
 * - 500: Server errors
 * 
 * Requirements: 2.1, 2.2, 2.3
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { TestAssignmentWithStatus, TestAssignmentsResponse } from '@/types'

/**
 * GET /api/reports/test-assignments/[patientId]
 * 
 * Fetches test assignments for a specific patient with report status.
 * Joins test_assignments table with report_instances to get current report status.
 * 
 * Path Parameters:
 * - patientId: UUID of the patient
 * 
 * Response:
 * {
 *   testAssignments: [
 *     {
 *       id: string,
 *       testName: string,
 *       assignedDate: string,
 *       reportStatus: 'pending' | 'in-progress' | 'completed',
 *       reportTypeCode: string
 *     }
 *   ]
 * }
 * 
 * - 200: Test assignments fetched successfully
 * - 400: Invalid patient ID format
 * - 401: Unauthorized
 * - 404: Patient not found
 * - 500: Server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
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
          message: 'You must be logged in to view test assignments',
        },
        { status: 401 }
      )
    }

    // Get patientId from params
    const { patientId } = await params

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(patientId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid patient ID',
          message: 'Patient ID must be a valid UUID',
        },
        { status: 400 }
      )
    }

    // Verify patient exists
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('id', patientId)
      .single()

    if (patientError || !patient) {
      return NextResponse.json(
        {
          success: false,
          error: 'Patient not found',
          message: `No patient found with ID: ${patientId}`,
        },
        { status: 404 }
      )
    }

    // Fetch test assignments for the patient
    const { data: testAssignments, error: assignmentsError } = await supabase
      .from('test_assignments')
      .select('id, test_type, assigned_at, status')
      .eq('patient_id', patientId)
      .order('assigned_at', { ascending: false })

    if (assignmentsError) {
      console.error('Database error fetching test assignments:', assignmentsError)
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Failed to fetch test assignments. Please try again.',
        },
        { status: 500 }
      )
    }

    // If no test assignments, return empty array
    if (!testAssignments || testAssignments.length === 0) {
      return NextResponse.json(
        {
          testAssignments: []
        },
        { status: 200 }
      )
    }

    // Extract test assignment IDs for fetching report instances
    const testAssignmentIds = testAssignments.map(ta => ta.id)

    // Fetch report instances for all test assignments
    const { data: reportInstances, error: reportError } = await supabase
      .from('report_instances')
      .select('test_assignment_id, status')
      .in('test_assignment_id', testAssignmentIds)

    if (reportError) {
      console.error('Database error fetching report instances:', reportError)
      // Continue without report status - default to 'pending'
    }

    // Create a map of test_assignment_id to report status
    const reportStatusMap = new Map<string, 'pending' | 'in-progress' | 'completed'>()
    if (reportInstances) {
      reportInstances.forEach(ri => {
        reportStatusMap.set(ri.test_assignment_id, ri.status as 'pending' | 'in-progress' | 'completed')
      })
    }

    // Map test type codes to report type codes
    const testTypeToReportTypeMap: Record<string, string> = {
      'CBC': 'CBC',
      'BG': 'BLOOD_GROUP',
      'VDRL': 'VDRL'
    }

    // Map test type codes to display names
    const testTypeToNameMap: Record<string, string> = {
      'CBC': 'Complete Blood Count',
      'BG': 'Blood Group',
      'VDRL': 'VDRL Test'
    }

    // Transform data to TestAssignmentWithStatus format
    const transformedAssignments: TestAssignmentWithStatus[] = testAssignments.map(ta => ({
      id: ta.id,
      testName: testTypeToNameMap[ta.test_type] || ta.test_type,
      assignedDate: ta.assigned_at,
      reportStatus: reportStatusMap.get(ta.id) || 'pending',
      reportTypeCode: testTypeToReportTypeMap[ta.test_type] || ta.test_type
    }))

    const response: TestAssignmentsResponse = {
      testAssignments: transformedAssignments
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Unexpected error in GET /api/reports/test-assignments/[patientId]:', error)

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
