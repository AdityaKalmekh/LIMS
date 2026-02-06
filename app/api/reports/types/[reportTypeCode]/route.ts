/**
 * Report Types API Route
 * 
 * Handles API requests for fetching report type definitions with their field specifications.
 * 
 * Endpoints:
 * - GET /api/reports/types/[reportTypeCode] - Fetch report type definition by code
 * 
 * Authentication:
 * All endpoints require authentication via Supabase Auth.
 * 
 * Error Handling:
 * - 401: Unauthorized (not authenticated)
 * - 404: Report type not found
 * - 500: Server errors
 * 
 * Requirements: 10.4
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { 
  ReportType, 
  ReportField, 
  ReportTypeDefinitionResponse,
  ReportTypeDbRecord,
  ReportFieldDbRecord
} from '@/types'

/**
 * GET /api/reports/types/[reportTypeCode]
 * 
 * Fetches a report type definition by its code along with all associated report fields.
 * Fields are returned ordered by field_order for proper form rendering.
 * 
 * Path Parameters:
 * - reportTypeCode: The unique code identifier for the report type (e.g., 'BLOOD_GROUP', 'CBC')
 * 
 * Response:
 * {
 *   reportType: {
 *     id: string,
 *     code: string,
 *     name: string,
 *     description: string | null,
 *     isActive: boolean,
 *     createdAt: string,
 *     updatedAt: string
 *   },
 *   fields: [
 *     {
 *       id: string,
 *       reportTypeId: string,
 *       fieldName: string,
 *       fieldLabel: string,
 *       fieldType: 'text' | 'number' | 'dropdown' | 'textarea',
 *       fieldOrder: number,
 *       isRequired: boolean,
 *       unit: string | null,
 *       normalRangeMin: number | null,
 *       normalRangeMax: number | null,
 *       normalRangeText: string | null,
 *       dropdownOptions: string[] | null,
 *       defaultValue: string | null,
 *       validationRules: Record<string, any> | null,
 *       createdAt: string
 *     }
 *   ]
 * }
 * 
 * Status Codes:
 * - 200: Report type definition fetched successfully
 * - 401: Unauthorized
 * - 404: Report type not found
 * - 500: Server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reportTypeCode: string }> }
) {
  try {
    // Await params to get the reportTypeCode
    const { reportTypeCode } = await params

    // Create Supabase client
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be logged in to view report type definitions',
        },
        { status: 401 }
      )
    }

    // Fetch report type by code
    const { data: reportTypeData, error: reportTypeError } = await supabase
      .from('report_types')
      .select('*')
      .eq('code', reportTypeCode)
      .eq('is_active', true)
      .single()

    if (reportTypeError) {
      // Check if it's a "not found" error
      if (reportTypeError.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            error: 'Not found',
            message: `Report type with code '${reportTypeCode}' not found or is not active`,
          },
          { status: 404 }
        )
      }

      console.error('Database error fetching report type:', reportTypeError)
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Failed to fetch report type definition. Please try again.',
        },
        { status: 500 }
      )
    }

    // Transform report type from snake_case to camelCase
    const reportType: ReportType = {
      id: reportTypeData.id,
      code: reportTypeData.code,
      name: reportTypeData.name,
      description: reportTypeData.description,
      isActive: reportTypeData.is_active,
      createdAt: reportTypeData.created_at,
      updatedAt: reportTypeData.updated_at
    }

    // Fetch all report fields for this report type, ordered by field_order
    const { data: fieldsData, error: fieldsError } = await supabase
      .from('report_fields')
      .select('*')
      .eq('report_type_id', reportType.id)
      .order('field_order', { ascending: true })

    if (fieldsError) {
      console.error('Database error fetching report fields:', fieldsError)
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Failed to fetch report field definitions. Please try again.',
        },
        { status: 500 }
      )
    }

    // Transform fields from snake_case to camelCase
    const fields: ReportField[] = (fieldsData || []).map((field: ReportFieldDbRecord) => ({
      id: field.id,
      reportTypeId: field.report_type_id,
      fieldName: field.field_name,
      fieldLabel: field.field_label,
      fieldType: field.field_type as 'text' | 'number' | 'dropdown' | 'textarea',
      fieldOrder: field.field_order,
      isRequired: field.is_required,
      unit: field.unit,
      normalRangeMin: field.normal_range_min,
      normalRangeMax: field.normal_range_max,
      normalRangeText: field.normal_range_text,
      dropdownOptions: field.dropdown_options,
      defaultValue: field.default_value,
      validationRules: field.validation_rules,
      createdAt: field.created_at
    }))

    const response: ReportTypeDefinitionResponse = {
      reportType,
      fields
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Unexpected error in GET /api/reports/types/[reportTypeCode]:', error)

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
