/**
 * Reports Patients API Route
 * 
 * Handles API requests for fetching patients with test assignments for the reports section.
 * 
 * Endpoints:
 * - GET /api/reports/patients - Fetch patients who have test assignments
 * 
 * Authentication:
 * All endpoints require authentication via Supabase Auth.
 * 
 * Error Handling:
 * - 401: Unauthorized (not authenticated)
 * - 500: Server errors
 * 
 * Requirements: 1.1, 1.2, 2.4
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { PatientWithTests, TestAssignmentWithStatus, PatientsWithTestsResponse } from '@/types'

/**
 * GET /api/reports/patients
 * 
 * Fetches patients who have assigned tests with their test assignment summaries.
 * Joins patients table with test_assignments and report_instances to get report status.
 * 
 * Response:
 * {
 *   patients: [
 *     {
 *       id: string,
 *       name: string,
 *       patientId: string,
 *       age: number,
 *       gender: string,
 *       contact: string,
 *       testAssignments: [
 *         {
 *           id: string,
 *           testName: string,
 *           assignedDate: string,
 *           reportStatus: 'pending' | 'in-progress' | 'completed',
 *           reportTypeCode: string
 *         }
 *       ]
 *     }
 *   ]
 * }
 * 
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
          message: 'You must be logged in to view patients with test assignments',
        },
        { status: 401 }
      )
    }

    // Fetch patients who have test assignments
    // Join with test_assignments to get all assignments for each patient
    const { data: patientsData, error: patientsError } = await supabase
      .from('patients')
      .select(`
        id,
        mobile_number,
        title,
        first_name,
        last_name,
        sex,
        age_years,
        age_months,
        age_days,
        created_at,
        test_assignments!inner (
          id,
          test_type,
          assigned_at,
          status
        )
      `)
      .order('created_at', { ascending: false })

    if (patientsError) {
      console.error('Database error fetching patients:', patientsError)
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Failed to fetch patients with test assignments. Please try again.',
        },
        { status: 500 }
      )
    }

    // If no patients with test assignments, return empty array
    if (!patientsData || patientsData.length === 0) {
      return NextResponse.json(
        {
          patients: []
        },
        { status: 200 }
      )
    }

    // Extract all test assignment IDs for fetching report instances
    const testAssignmentIds = patientsData.flatMap(
      patient => patient.test_assignments.map((ta: any) => ta.id)
    )

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

    // Transform data to PatientWithTests format
    const patients: PatientWithTests[] = patientsData.map(patient => {
      // Calculate total age in years (including months and days as decimal)
      const totalAge = patient.age_years + 
        (patient.age_months || 0) / 12 + 
        (patient.age_days || 0) / 365

      // Format full name
      const fullName = patient.last_name 
        ? `${patient.title} ${patient.first_name} ${patient.last_name}`
        : `${patient.title} ${patient.first_name}`

      // Transform test assignments
      const testAssignments: TestAssignmentWithStatus[] = patient.test_assignments.map((ta: any) => ({
        id: ta.id,
        testName: testTypeToNameMap[ta.test_type] || ta.test_type,
        assignedDate: ta.assigned_at,
        reportStatus: reportStatusMap.get(ta.id) || 'pending',
        reportTypeCode: testTypeToReportTypeMap[ta.test_type] || ta.test_type
      }))

      return {
        id: patient.id,
        name: fullName,
        patientId: patient.id, // Using UUID as patient ID
        age: Math.round(totalAge), // Round to nearest year for display
        gender: patient.sex,
        contact: patient.mobile_number,
        testAssignments
      }
    })

    const response: PatientsWithTestsResponse = {
      patients
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Unexpected error in GET /api/reports/patients:', error)

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
