/**
 * Patients API Route
 * 
 * Handles API requests for patient management operations.
 * 
 * Endpoints:
 * - POST /api/patients - Create a new patient
 * - GET /api/patients - Fetch patients with pagination
 * 
 * Authentication:
 * All endpoints require authentication via Supabase Auth.
 * The authenticated user's ID is automatically added as created_by.
 * 
 * Error Handling:
 * - 400: Validation errors or bad request
 * - 401: Unauthorized (not authenticated)
 * - 500: Server errors
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { patientSchema } from '@/lib/validations/patient'
import { z } from 'zod'

/**
 * POST /api/patients
 * 
 * Creates a new patient record in the database.
 * 
 * Request Body:
 * - mobileNumber: string (format: +91XXXXXXXXXX)
 * - title: string (Mr., Mrs., Ms., Dr., Master, Miss)
 * - firstName: string (required)
 * - lastName: string (optional)
 * - sex: string (Male, Female, Other)
 * - ageYears: number (required)
 * - ageMonths: number (optional, 0-11)
 * - ageDays: number (optional, 0-30)
 * - referredBy: string (optional)
 * 
 * Response:
 * - 201: Patient created successfully
 * - 400: Validation error
 * - 401: Unauthorized
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
          message: 'You must be logged in to create patients' 
        },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()

    // Validate request data using Zod schema
    const validationResult = patientSchema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))

      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Please check your input and try again',
          errors,
        },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Prepare data for database insertion
    // Convert camelCase to snake_case for database columns
    const patientData = {
      mobile_number: validatedData.mobileNumber,
      title: validatedData.title,
      first_name: validatedData.firstName,
      last_name: validatedData.lastName || null,
      sex: validatedData.sex,
      age_years: validatedData.ageYears,
      age_months: validatedData.ageMonths || 0,
      age_days: validatedData.ageDays || 0,
      referred_by: validatedData.referredBy || null,
      created_by: user.id,
    }

    // Insert patient into database
    const { data: patient, error: dbError } = await supabase
      .from('patients')
      .insert(patientData)
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      
      // Check for specific database errors
      if (dbError.code === '23505') {
        // Unique constraint violation
        return NextResponse.json(
          {
            success: false,
            error: 'Duplicate entry',
            message: 'A patient with this information already exists',
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Failed to create patient. Please try again.',
        },
        { status: 500 }
      )
    }

    // Convert snake_case back to camelCase for response
    const responseData = {
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
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Patient registered successfully',
        data: responseData,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error in POST /api/patients:', error)

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON',
          message: 'Request body must be valid JSON',
        },
        { status: 400 }
      )
    }

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

/**
 * GET /api/patients
 * 
 * Fetches a paginated list of patients.
 * 
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 10, max: 100)
 * 
 * Response:
 * - 200: Patients fetched successfully
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
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const offset = (page - 1) * limit

    // Fetch patients with pagination
    const { data: patients, error: dbError, count } = await supabase
      .from('patients')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Failed to fetch patients. Please try again.',
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

    return NextResponse.json(
      {
        success: true,
        data: responseData,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
          hasMore: offset + limit < (count || 0),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error in GET /api/patients:', error)

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
