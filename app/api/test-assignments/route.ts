/**
 * Test Assignments API Route
 * 
 * Handles API requests for creating test assignments linking patients to lab tests.
 * 
 * Endpoints:
 * - POST /api/test-assignments - Create test assignments for selected patients
 * 
 * Authentication:
 * All endpoints require authentication via Supabase Auth.
 * The authenticated user's ID is automatically added as assigned_by.
 * 
 * Error Handling:
 * - 400: Validation errors or bad request
 * - 401: Unauthorized (not authenticated)
 * - 500: Server errors
 * 
 * Requirements: 4.4, 4.6, 5.2, 5.5
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { 
  CreateTestAssignmentsRequest, 
  CreateTestAssignmentsResponse,
  TestType,
  TestAssignment
} from '@/types'

// Validation schema for test assignment request
const testAssignmentSchema = z.object({
  assignments: z.array(
    z.object({
      patientId: z.string().uuid('Invalid patient ID format'),
      tests: z.array(
        z.enum(['CBC', 'BG', 'VDRL'], {
          message: 'Test type must be CBC, BG, or VDRL'
        })
      ).min(1, 'At least one test must be assigned to each patient')
    })
  ).min(1, 'At least one patient assignment is required')
})

/**
 * POST /api/test-assignments
 * 
 * Creates test assignment records for selected patients.
 * Each patient can have multiple tests assigned, resulting in one record per patient-test combination.
 * Uses database transaction to ensure atomicity.
 * 
 * Request Body:
 * {
 *   assignments: [
 *     {
 *       patientId: string (UUID),
 *       tests: string[] (array of 'CBC' | 'BG' | 'VDRL')
 *     }
 *   ]
 * }
 * 
 * Response:
 * - 201: Test assignments created successfully
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
          message: 'You must be logged in to create test assignments' 
        },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()

    // Validate request data using Zod schema
    const validationResult = testAssignmentSchema.safeParse(body)

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

    const validatedData = validationResult.data as CreateTestAssignmentsRequest

    // Verify all patient IDs exist in the database
    const patientIds = validatedData.assignments.map(a => a.patientId)
    const { data: existingPatients, error: patientCheckError } = await supabase
      .from('patients')
      .select('id')
      .in('id', patientIds)

    if (patientCheckError) {
      console.error('Database error checking patients:', patientCheckError)
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Failed to verify patient records. Please try again.',
        },
        { status: 500 }
      )
    }

    const existingPatientIds = new Set(existingPatients.map(p => p.id))
    const invalidPatientIds = patientIds.filter(id => !existingPatientIds.has(id))

    if (invalidPatientIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid patient IDs',
          message: `The following patient IDs do not exist: ${invalidPatientIds.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Prepare test assignment records for insertion
    // Create one record per patient-test combination
    const assignmentRecords = validatedData.assignments.flatMap(assignment => 
      assignment.tests.map(testType => ({
        patient_id: assignment.patientId,
        test_type: testType,
        status: 'pending',
        assigned_by: user.id,
        assigned_at: new Date().toISOString(),
      }))
    )

    // Insert all test assignments in a single transaction
    // Supabase handles this as a transaction automatically
    const { data: createdAssignments, error: insertError } = await supabase
      .from('test_assignments')
      .insert(assignmentRecords)
      .select()

    if (insertError) {
      console.error('Database error creating test assignments:', insertError)
      
      // Check for specific database errors
      if (insertError.code === '23505') {
        // Unique constraint violation - duplicate patient-test combination
        return NextResponse.json(
          {
            success: false,
            error: 'Duplicate assignment',
            message: 'One or more patients already have these tests assigned',
          },
          { status: 400 }
        )
      }

      if (insertError.code === '23503') {
        // Foreign key constraint violation
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid reference',
            message: 'Invalid patient or user reference',
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Failed to create test assignments. Please try again.',
        },
        { status: 500 }
      )
    }

    // Convert snake_case to camelCase for response
    const responseData: TestAssignment[] = createdAssignments.map((assignment) => ({
      id: assignment.id,
      patientId: assignment.patient_id,
      testType: assignment.test_type as TestType,
      status: assignment.status as 'pending' | 'in_progress' | 'completed' | 'cancelled',
      assignedAt: assignment.assigned_at,
      assignedBy: assignment.assigned_by,
      completedAt: assignment.completed_at || undefined,
      notes: assignment.notes || undefined,
      createdAt: assignment.created_at,
      updatedAt: assignment.updated_at || undefined,
    }))

    const response: CreateTestAssignmentsResponse = {
      success: true,
      message: `Successfully assigned tests to ${validatedData.assignments.length} patient${validatedData.assignments.length > 1 ? 's' : ''}`,
      data: {
        created: createdAssignments.length,
        assignments: responseData,
      },
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/test-assignments:', error)

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
