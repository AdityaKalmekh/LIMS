/**
 * Tests for Report Types API Endpoint
 * 
 * Tests the GET /api/reports/types/[reportTypeCode] endpoint
 * 
 * Test Coverage:
 * - Successful report type retrieval
 * - Fields ordered by field_order
 * - Report type not found (404)
 * - Inactive report types not returned
 * - Authentication required
 * - Data transformation (snake_case to camelCase)
 * 
 * Requirements: 10.4
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { createClient } from '@supabase/supabase-js'

// Test configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

describe('GET /api/reports/types/[reportTypeCode]', () => {
  let supabase: ReturnType<typeof createClient>
  let authToken: string | null = null

  beforeAll(async () => {
    // Initialize Supabase client
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Sign in with test credentials (you may need to adjust this)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: process.env.TEST_USER_EMAIL || 'test@example.com',
      password: process.env.TEST_USER_PASSWORD || 'testpassword123'
    })

    if (error) {
      console.warn('Authentication failed in tests:', error.message)
    } else if (data.session) {
      authToken = data.session.access_token
    }
  })

  afterAll(async () => {
    // Clean up: sign out
    if (supabase) {
      await supabase.auth.signOut()
    }
  })

  it('should return 401 when not authenticated', async () => {
    const response = await fetch(`${API_BASE_URL}/api/reports/types/BLOOD_GROUP`)

    expect(response.status).toBe(401)

    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.error).toBe('Unauthorized')
  })

  it('should successfully fetch Blood Group report type with fields', async () => {
    if (!authToken) {
      console.warn('Skipping test: No auth token available')
      return
    }

    const response = await fetch(`${API_BASE_URL}/api/reports/types/BLOOD_GROUP`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })

    expect(response.status).toBe(200)

    const data = await response.json()

    // Verify report type structure
    expect(data.reportType).toBeDefined()
    expect(data.reportType.code).toBe('BLOOD_GROUP')
    expect(data.reportType.name).toBe('Blood Group Test')
    expect(data.reportType.isActive).toBe(true)
    expect(data.reportType.id).toBeDefined()
    expect(data.reportType.createdAt).toBeDefined()
    expect(data.reportType.updatedAt).toBeDefined()

    // Verify fields array
    expect(Array.isArray(data.fields)).toBe(true)
    expect(data.fields.length).toBeGreaterThan(0)

    // Verify field structure (check first field)
    const firstField = data.fields[0]
    expect(firstField.id).toBeDefined()
    expect(firstField.reportTypeId).toBe(data.reportType.id)
    expect(firstField.fieldName).toBeDefined()
    expect(firstField.fieldLabel).toBeDefined()
    expect(firstField.fieldType).toBeDefined()
    expect(firstField.fieldOrder).toBeDefined()
    expect(typeof firstField.isRequired).toBe('boolean')
    expect(firstField.createdAt).toBeDefined()
  })

  it('should return fields ordered by field_order', async () => {
    if (!authToken) {
      console.warn('Skipping test: No auth token available')
      return
    }

    const response = await fetch(`${API_BASE_URL}/api/reports/types/CBC`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })

    expect(response.status).toBe(200)

    const data = await response.json()

    // Verify fields are ordered by field_order
    const fieldOrders = data.fields.map((field: any) => field.fieldOrder)
    const sortedFieldOrders = [...fieldOrders].sort((a, b) => a - b)

    expect(fieldOrders).toEqual(sortedFieldOrders)
  })

  it('should return 404 for non-existent report type', async () => {
    if (!authToken) {
      console.warn('Skipping test: No auth token available')
      return
    }

    const response = await fetch(`${API_BASE_URL}/api/reports/types/INVALID_CODE`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })

    expect(response.status).toBe(404)

    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.error).toBe('Not found')
    expect(data.message).toContain('INVALID_CODE')
  })

  it('should include dropdown options for dropdown fields', async () => {
    if (!authToken) {
      console.warn('Skipping test: No auth token available')
      return
    }

    const response = await fetch(`${API_BASE_URL}/api/reports/types/BLOOD_GROUP`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })

    expect(response.status).toBe(200)

    const data = await response.json()

    // Find a dropdown field
    const dropdownField = data.fields.find((field: any) => field.fieldType === 'dropdown')

    expect(dropdownField).toBeDefined()
    expect(Array.isArray(dropdownField.dropdownOptions)).toBe(true)
    expect(dropdownField.dropdownOptions.length).toBeGreaterThan(0)
  })

  it('should include normal range data for numeric fields', async () => {
    if (!authToken) {
      console.warn('Skipping test: No auth token available')
      return
    }

    const response = await fetch(`${API_BASE_URL}/api/reports/types/CBC`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })

    expect(response.status).toBe(200)

    const data = await response.json()

    // Find a numeric field with normal range
    const numericField = data.fields.find((field: any) => 
      field.fieldType === 'number' && field.normalRangeMin !== null
    )

    expect(numericField).toBeDefined()
    expect(numericField.unit).toBeDefined()
    expect(typeof numericField.normalRangeMin).toBe('number')
    expect(typeof numericField.normalRangeMax).toBe('number')
    expect(numericField.normalRangeText).toBeDefined()
  })

  it('should transform snake_case to camelCase', async () => {
    if (!authToken) {
      console.warn('Skipping test: No auth token available')
      return
    }

    const response = await fetch(`${API_BASE_URL}/api/reports/types/BLOOD_GROUP`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })

    expect(response.status).toBe(200)

    const data = await response.json()

    // Verify camelCase properties exist (not snake_case)
    expect(data.reportType.isActive).toBeDefined()
    expect(data.reportType.createdAt).toBeDefined()
    expect(data.reportType.updatedAt).toBeDefined()
    expect(data.reportType.is_active).toBeUndefined()
    expect(data.reportType.created_at).toBeUndefined()

    const field = data.fields[0]
    expect(field.reportTypeId).toBeDefined()
    expect(field.fieldName).toBeDefined()
    expect(field.fieldLabel).toBeDefined()
    expect(field.fieldType).toBeDefined()
    expect(field.fieldOrder).toBeDefined()
    expect(field.isRequired).toBeDefined()
    expect(field.normalRangeMin).toBeDefined()
    expect(field.normalRangeMax).toBeDefined()
    expect(field.normalRangeText).toBeDefined()
    expect(field.dropdownOptions).toBeDefined()
    expect(field.defaultValue).toBeDefined()
    expect(field.validationRules).toBeDefined()

    // Verify snake_case properties don't exist
    expect(field.report_type_id).toBeUndefined()
    expect(field.field_name).toBeUndefined()
    expect(field.is_required).toBeUndefined()
  })

  it('should only return active report types', async () => {
    if (!authToken) {
      console.warn('Skipping test: No auth token available')
      return
    }

    // First, create an inactive report type for testing
    const { data: inactiveType, error: createError } = await supabase
      .from('report_types')
      .insert({
        code: 'INACTIVE_TEST',
        name: 'Inactive Test Type',
        is_active: false
      })
      .select()
      .single()

    if (createError) {
      console.warn('Could not create inactive report type for testing:', createError)
      return
    }

    // Try to fetch the inactive report type
    const response = await fetch(`${API_BASE_URL}/api/reports/types/INACTIVE_TEST`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })

    expect(response.status).toBe(404)

    // Clean up: delete the test report type
    await supabase
      .from('report_types')
      .delete()
      .eq('code', 'INACTIVE_TEST')
  })
})
