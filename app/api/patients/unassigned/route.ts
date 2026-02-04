/**
 * Unassigned Patients API Route
 * 
 * Handles API requests for fetching patients who have not been assigned to any lab tests.
 * 
 * Endpoints:
 * - GET /api/patients/unassigned - Fetch unassigned patients with pagination
 * 
 * Authentication:
 * All endpoints require authentication via Supabase Auth.
 * 
 * Error Handling:
 * - 400: Validation errors or bad request
 * - 401: Unauthorized (not authenticated)
 * - 500: Server errors
 * 
 * Requirements: 1.1, 5.4
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/patients/unassigned
 * 
 * Fetches a paginated list of patients who have not been assigned to any lab tests.
 * Uses LEFT JOIN to exclude patients with existing test_assignments records.
 * 
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 50, max: 100)
 * 
 * Response:
 * - 200: Unassigned patients fetched successfully
 * - 401: Unauthorized
 * - 500: Server error
 */
export async function GET(request: NextRequest) {
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
          message: 'You must be logged in to view patients',
        },
        { status: 401 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)))
    const offset = (page - 1) * limit

    // Fetch patients who don't have any test assignments
    // First, get the list of patient IDs that have test assignments
    const { data: assignedPatientIds, error: assignedError } = await supabase
      .from('test_assignments')
      .select('patient_id')

    if (assignedError) {
      console.error('Database error fetching assigned patients:', assignedError)
      console.error('Error details:', JSON.stringify(assignedError, null, 2))
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Failed to fetch unassigned patients. Please try again.',
        },
        { status: 500 }
      )
    }

    // Extract unique patient IDs (handle null/empty case)
    const assignedIds = assignedPatientIds && assignedPatientIds.length > 0
      ? [...new Set(assignedPatientIds.map(a => a.patient_id))]
      : []

    // Build query for unassigned patients
    let query = supabase
      .from('patients')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Exclude assigned patients if any exist
    if (assignedIds.length > 0) {
      query = query.not('id', 'in', `(${assignedIds.join(',')})`)
    }

    // Apply pagination
    const { data: patients, error: dbError, count } = await query
      .range(offset, offset + limit - 1)

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Failed to fetch unassigned patients. Please try again.',
        },
        { status: 500 }
      )
    }

    // Convert snake_case to camelCase for response
    const responseData = patients.map((patient) => ({
      id: patient.id,
      mobileNumber: patient.mobile_number,
      title: patient.title,
      firstName: patient.first_name,
      lastName: patient.last_name,
      sex: patient.sex,
      ageYears: patient.age_years,
      ageMonths: patient.age_months,
      ageDays: patient.age_days,
      referredBy: patient.referred_by,
      createdAt: patient.created_at,
      createdBy: patient.created_by,
      updatedAt: patient.updated_at,
    }))

    const totalCount = count || 0

    return NextResponse.json(
      {
        success: true,
        data: responseData,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: offset + limit < totalCount,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error in GET /api/patients/unassigned:', error)

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
