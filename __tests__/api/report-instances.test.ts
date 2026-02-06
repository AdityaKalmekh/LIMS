/**
 * Report Instances API Route Tests
 * 
 * Tests for GET /api/reports/instances/[testAssignmentId] endpoint
 * 
 * Requirements tested:
 * - 3.3: Load previously saved data when report form is expanded
 * - 14.2: Populate form fields with saved values when existing data is found
 * - 14.3: Display empty fields with defaults when no existing data is found
 * 
 * To run these tests:
 * 1. Ensure Jest is configured for Next.js
 * 2. Run: npm test report-instances
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/reports/instances/[testAssignmentId]/route'

// Mock Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

describe('GET /api/reports/instances/[testAssignmentId]', () => {
  let mockSupabase: any
  let mockUser: any

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()

    // Setup mock user
    mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
    }

    // Setup mock Supabase client
    mockSupabase = {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn(),
    }

    const { createClient } = require('@/lib/supabase/server')
    createClient.mockResolvedValue(mockSupabase)
  })

  describe('Authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      // Mock authentication failure
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Not authenticated'),
      })

      const request = new NextRequest('http://localhost:3000/api/reports/instances/123e4567-e89b-12d3-a456-426614174000', {
        method: 'GET',
      })

      const response = await GET(request, {
        params: Promise.resolve({ testAssignmentId: '123e4567-e89b-12d3-a456-426614174000' })
      })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('Validation', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('should return 400 when testAssignmentId is not a valid UUID', async () => {
      const request = new NextRequest('http://localhost:3000/api/reports/instances/invalid-uuid', {
        method: 'GET',
      })

      const response = await GET(request, {
        params: Promise.resolve({ testAssignmentId: 'invalid-uuid' })
      })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid test assignment ID')
    })

    it('should return 404 when test assignment does not exist', async () => {
      const testAssignmentId = '123e4567-e89b-12d3-a456-426614174000'

      // Mock test assignment not found
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116' },
            }),
          }),
        }),
      })

      const request = new NextRequest(`http://localhost:3000/api/reports/instances/${testAssignmentId}`, {
        method: 'GET',
      })

      const response = await GET(request, {
        params: Promise.resolve({ testAssignmentId })
      })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Test assignment not found')
    })
  })

  describe('Report Instance Retrieval - Requirement 14.3', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('should return null reportInstance and empty values when no report exists', async () => {
      const testAssignmentId = '123e4567-e89b-12d3-a456-426614174000'

      let callCount = 0
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'test_assignments') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { id: testAssignmentId },
                  error: null,
                }),
              }),
            }),
          }
        } else if (table === 'report_instances') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                maybeSingle: jest.fn().mockResolvedValue({
                  data: null,
                  error: null,
                }),
              }),
            }),
          }
        }
      })

      const request = new NextRequest(`http://localhost:3000/api/reports/instances/${testAssignmentId}`, {
        method: 'GET',
      })

      const response = await GET(request, {
        params: Promise.resolve({ testAssignmentId })
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.reportInstance).toBeNull()
      expect(data.values).toEqual({})
    })
  })

  describe('Report Instance with Values - Requirements 3.3, 14.2', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('should return report instance and transform EAV values to key-value object', async () => {
      const testAssignmentId = '123e4567-e89b-12d3-a456-426614174000'
      const reportInstanceId = '223e4567-e89b-12d3-a456-426614174000'
      const reportTypeId = '323e4567-e89b-12d3-a456-426614174000'
      const now = new Date().toISOString()

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'test_assignments') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { id: testAssignmentId },
                  error: null,
                }),
              }),
            }),
          }
        } else if (table === 'report_instances') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                maybeSingle: jest.fn().mockResolvedValue({
                  data: {
                    id: reportInstanceId,
                    test_assignment_id: testAssignmentId,
                    report_type_id: reportTypeId,
                    status: 'in-progress',
                    created_by: mockUser.id,
                    created_at: now,
                    updated_at: now,
                    completed_at: null,
                  },
                  error: null,
                }),
              }),
            }),
          }
        } else if (table === 'report_values') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: [
                  {
                    id: 'value-1',
                    report_instance_id: reportInstanceId,
                    report_field_id: 'field-1',
                    value_text: 'A',
                    value_number: null,
                    created_at: now,
                    updated_at: now,
                    report_fields: {
                      field_name: 'blood_group',
                      field_type: 'dropdown',
                    },
                  },
                  {
                    id: 'value-2',
                    report_instance_id: reportInstanceId,
                    report_field_id: 'field-2',
                    value_text: 'POSITIVE',
                    value_number: null,
                    created_at: now,
                    updated_at: now,
                    report_fields: {
                      field_name: 'rh_factor',
                      field_type: 'dropdown',
                    },
                  },
                ],
                error: null,
              }),
            }),
          }
        }
      })

      const request = new NextRequest(`http://localhost:3000/api/reports/instances/${testAssignmentId}`, {
        method: 'GET',
      })

      const response = await GET(request, {
        params: Promise.resolve({ testAssignmentId })
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.reportInstance).toBeDefined()
      expect(data.reportInstance.id).toBe(reportInstanceId)
      expect(data.reportInstance.testAssignmentId).toBe(testAssignmentId)
      expect(data.reportInstance.status).toBe('in-progress')
      expect(data.values).toEqual({
        blood_group: 'A',
        rh_factor: 'POSITIVE',
      })
    })

    it('should correctly handle numeric field values', async () => {
      const testAssignmentId = '123e4567-e89b-12d3-a456-426614174000'
      const reportInstanceId = '223e4567-e89b-12d3-a456-426614174000'
      const reportTypeId = '323e4567-e89b-12d3-a456-426614174000'
      const now = new Date().toISOString()

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'test_assignments') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { id: testAssignmentId },
                  error: null,
                }),
              }),
            }),
          }
        } else if (table === 'report_instances') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                maybeSingle: jest.fn().mockResolvedValue({
                  data: {
                    id: reportInstanceId,
                    test_assignment_id: testAssignmentId,
                    report_type_id: reportTypeId,
                    status: 'in-progress',
                    created_by: mockUser.id,
                    created_at: now,
                    updated_at: now,
                    completed_at: null,
                  },
                  error: null,
                }),
              }),
            }),
          }
        } else if (table === 'report_values') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: [
                  {
                    id: 'value-1',
                    report_instance_id: reportInstanceId,
                    report_field_id: 'field-1',
                    value_text: null,
                    value_number: 15.5,
                    created_at: now,
                    updated_at: now,
                    report_fields: {
                      field_name: 'hb',
                      field_type: 'number',
                    },
                  },
                  {
                    id: 'value-2',
                    report_instance_id: reportInstanceId,
                    report_field_id: 'field-2',
                    value_text: null,
                    value_number: 8500,
                    created_at: now,
                    updated_at: now,
                    report_fields: {
                      field_name: 'total_leukocyte_count',
                      field_type: 'number',
                    },
                  },
                ],
                error: null,
              }),
            }),
          }
        }
      })

      const request = new NextRequest(`http://localhost:3000/api/reports/instances/${testAssignmentId}`, {
        method: 'GET',
      })

      const response = await GET(request, {
        params: Promise.resolve({ testAssignmentId })
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.values).toEqual({
        hb: 15.5,
        total_leukocyte_count: 8500,
      })
    })

    it('should handle mixed text and numeric field values', async () => {
      const testAssignmentId = '123e4567-e89b-12d3-a456-426614174000'
      const reportInstanceId = '223e4567-e89b-12d3-a456-426614174000'
      const reportTypeId = '323e4567-e89b-12d3-a456-426614174000'
      const now = new Date().toISOString()

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'test_assignments') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { id: testAssignmentId },
                  error: null,
                }),
              }),
            }),
          }
        } else if (table === 'report_instances') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                maybeSingle: jest.fn().mockResolvedValue({
                  data: {
                    id: reportInstanceId,
                    test_assignment_id: testAssignmentId,
                    report_type_id: reportTypeId,
                    status: 'in-progress',
                    created_by: mockUser.id,
                    created_at: now,
                    updated_at: now,
                    completed_at: null,
                  },
                  error: null,
                }),
              }),
            }),
          }
        } else if (table === 'report_values') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: [
                  {
                    id: 'value-1',
                    report_instance_id: reportInstanceId,
                    report_field_id: 'field-1',
                    value_text: null,
                    value_number: 15.5,
                    created_at: now,
                    updated_at: now,
                    report_fields: {
                      field_name: 'hb',
                      field_type: 'number',
                    },
                  },
                  {
                    id: 'value-2',
                    report_instance_id: reportInstanceId,
                    report_field_id: 'field-2',
                    value_text: 'Adequate',
                    value_number: null,
                    created_at: now,
                    updated_at: now,
                    report_fields: {
                      field_name: 'platelet_on_smear',
                      field_type: 'dropdown',
                    },
                  },
                ],
                error: null,
              }),
            }),
          }
        }
      })

      const request = new NextRequest(`http://localhost:3000/api/reports/instances/${testAssignmentId}`, {
        method: 'GET',
      })

      const response = await GET(request, {
        params: Promise.resolve({ testAssignmentId })
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.values).toEqual({
        hb: 15.5,
        platelet_on_smear: 'Adequate',
      })
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('should return 500 when database error occurs fetching report instance', async () => {
      const testAssignmentId = '123e4567-e89b-12d3-a456-426614174000'

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'test_assignments') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { id: testAssignmentId },
                  error: null,
                }),
              }),
            }),
          }
        } else if (table === 'report_instances') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                maybeSingle: jest.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Database connection failed' },
                }),
              }),
            }),
          }
        }
      })

      const request = new NextRequest(`http://localhost:3000/api/reports/instances/${testAssignmentId}`, {
        method: 'GET',
      })

      const response = await GET(request, {
        params: Promise.resolve({ testAssignmentId })
      })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Database error')
    })

    it('should return 500 when database error occurs fetching report values', async () => {
      const testAssignmentId = '123e4567-e89b-12d3-a456-426614174000'
      const reportInstanceId = '223e4567-e89b-12d3-a456-426614174000'
      const now = new Date().toISOString()

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'test_assignments') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { id: testAssignmentId },
                  error: null,
                }),
              }),
            }),
          }
        } else if (table === 'report_instances') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                maybeSingle: jest.fn().mockResolvedValue({
                  data: {
                    id: reportInstanceId,
                    test_assignment_id: testAssignmentId,
                    report_type_id: '323e4567-e89b-12d3-a456-426614174000',
                    status: 'in-progress',
                    created_by: mockUser.id,
                    created_at: now,
                    updated_at: now,
                    completed_at: null,
                  },
                  error: null,
                }),
              }),
            }),
          }
        } else if (table === 'report_values') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database connection failed' },
              }),
            }),
          }
        }
      })

      const request = new NextRequest(`http://localhost:3000/api/reports/instances/${testAssignmentId}`, {
        method: 'GET',
      })

      const response = await GET(request, {
        params: Promise.resolve({ testAssignmentId })
      })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Database error')
    })
  })
})
