/**
 * Report Instances POST API Route Tests
 * 
 * Tests for POST /api/reports/instances endpoint
 * 
 * Requirements tested:
 * - 5.3: Persist report data to database when save button is clicked
 * - 11.2: Create new record if no report instance exists
 * - 11.3: Update existing record if report instance already exists
 * - 11.5: Update report status accordingly after save
 * 
 * To run these tests:
 * 1. Ensure Jest is configured for Next.js
 * 2. Run: npm test report-instances-post
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/reports/instances/route'

// Mock Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

describe('POST /api/reports/instances', () => {
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

      const request = new NextRequest('http://localhost:3000/api/reports/instances', {
        method: 'POST',
        body: JSON.stringify({
          testAssignmentId: '123e4567-e89b-12d3-a456-426614174000',
          reportTypeId: '223e4567-e89b-12d3-a456-426614174000',
          values: { blood_group: 'A' }
        }),
      })

      const response = await POST(request)
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

    it('should return 400 when request body is invalid JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/reports/instances', {
        method: 'POST',
        body: 'invalid json',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid request body')
    })

    it('should return 400 when testAssignmentId is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/reports/instances', {
        method: 'POST',
        body: JSON.stringify({
          reportTypeId: '223e4567-e89b-12d3-a456-426614174000',
          values: {}
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Missing required fields')
    })

    it('should return 400 when reportTypeId is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/reports/instances', {
        method: 'POST',
        body: JSON.stringify({
          testAssignmentId: '123e4567-e89b-12d3-a456-426614174000',
          values: {}
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Missing required fields')
    })

    it('should return 400 when testAssignmentId is not a valid UUID', async () => {
      const request = new NextRequest('http://localhost:3000/api/reports/instances', {
        method: 'POST',
        body: JSON.stringify({
          testAssignmentId: 'invalid-uuid',
          reportTypeId: '223e4567-e89b-12d3-a456-426614174000',
          values: {}
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid ID format')
    })

    it('should return 404 when test assignment does not exist', async () => {
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

      const request = new NextRequest('http://localhost:3000/api/reports/instances', {
        method: 'POST',
        body: JSON.stringify({
          testAssignmentId: '123e4567-e89b-12d3-a456-426614174000',
          reportTypeId: '223e4567-e89b-12d3-a456-426614174000',
          values: {}
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Test assignment not found')
    })
  })

  describe('Create New Report Instance - Requirement 11.2', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('should create new report instance when none exists', async () => {
      const testAssignmentId = '123e4567-e89b-12d3-a456-426614174000'
      const reportTypeId = '223e4567-e89b-12d3-a456-426614174000'
      const reportInstanceId = '323e4567-e89b-12d3-a456-426614174000'
      const now = new Date().toISOString()

      const mockReportFields = [
        {
          id: 'field-1',
          report_type_id: reportTypeId,
          field_name: 'blood_group',
          field_type: 'dropdown',
          is_required: true,
        },
        {
          id: 'field-2',
          report_type_id: reportTypeId,
          field_name: 'rh_factor',
          field_type: 'dropdown',
          is_required: true,
        }
      ]

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
        } else if (table === 'report_fields') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({
                  data: mockReportFields,
                  error: null,
                }),
              }),
            }),
          }
        } else if (table === 'report_instances') {
          const selectMock = jest.fn()
          const insertMock = jest.fn()
          
          return {
            select: selectMock.mockReturnValue({
              eq: jest.fn().mockReturnValue({
                maybeSingle: jest.fn().mockResolvedValue({
                  data: null, // No existing instance
                  error: null,
                }),
                single: jest.fn().mockResolvedValue({
                  data: {
                    id: reportInstanceId,
                    test_assignment_id: testAssignmentId,
                    report_type_id: reportTypeId,
                    status: 'completed',
                    created_by: mockUser.id,
                    created_at: now,
                    updated_at: now,
                    completed_at: now,
                  },
                  error: null,
                }),
              }),
            }),
            insert: insertMock.mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: {
                    id: reportInstanceId,
                    test_assignment_id: testAssignmentId,
                    report_type_id: reportTypeId,
                    status: 'completed',
                    created_by: mockUser.id,
                    created_at: now,
                    updated_at: now,
                    completed_at: now,
                  },
                  error: null,
                }),
              }),
            }),
          }
        } else if (table === 'report_values') {
          return {
            delete: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
            insert: jest.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }
        }
      })

      const request = new NextRequest('http://localhost:3000/api/reports/instances', {
        method: 'POST',
        body: JSON.stringify({
          testAssignmentId,
          reportTypeId,
          values: {
            blood_group: 'A',
            rh_factor: 'POSITIVE'
          }
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.reportInstance).toBeDefined()
      expect(data.reportInstance.id).toBe(reportInstanceId)
      expect(data.reportInstance.status).toBe('completed')
      expect(data.status).toBe('created')
    })
  })

  describe('Update Existing Report Instance - Requirement 11.3', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('should update existing report instance when one exists', async () => {
      const testAssignmentId = '123e4567-e89b-12d3-a456-426614174000'
      const reportTypeId = '223e4567-e89b-12d3-a456-426614174000'
      const reportInstanceId = '323e4567-e89b-12d3-a456-426614174000'
      const now = new Date().toISOString()

      const mockReportFields = [
        {
          id: 'field-1',
          report_type_id: reportTypeId,
          field_name: 'blood_group',
          field_type: 'dropdown',
          is_required: true,
        },
        {
          id: 'field-2',
          report_type_id: reportTypeId,
          field_name: 'rh_factor',
          field_type: 'dropdown',
          is_required: true,
        }
      ]

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
        } else if (table === 'report_fields') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({
                  data: mockReportFields,
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
                single: jest.fn().mockResolvedValue({
                  data: {
                    id: reportInstanceId,
                    test_assignment_id: testAssignmentId,
                    report_type_id: reportTypeId,
                    status: 'completed',
                    created_by: mockUser.id,
                    created_at: now,
                    updated_at: now,
                    completed_at: now,
                  },
                  error: null,
                }),
              }),
            }),
            update: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
          }
        } else if (table === 'report_values') {
          return {
            delete: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
            insert: jest.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }
        }
      })

      const request = new NextRequest('http://localhost:3000/api/reports/instances', {
        method: 'POST',
        body: JSON.stringify({
          testAssignmentId,
          reportTypeId,
          values: {
            blood_group: 'B',
            rh_factor: 'NEGATIVE'
          }
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.reportInstance).toBeDefined()
      expect(data.reportInstance.id).toBe(reportInstanceId)
      expect(data.status).toBe('updated')
    })
  })

  describe('Status Calculation - Requirement 11.5', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('should set status to "pending" when no values provided', async () => {
      const testAssignmentId = '123e4567-e89b-12d3-a456-426614174000'
      const reportTypeId = '223e4567-e89b-12d3-a456-426614174000'
      const reportInstanceId = '323e4567-e89b-12d3-a456-426614174000'
      const now = new Date().toISOString()

      const mockReportFields = [
        {
          id: 'field-1',
          report_type_id: reportTypeId,
          field_name: 'blood_group',
          field_type: 'dropdown',
          is_required: true,
        }
      ]

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
        } else if (table === 'report_fields') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({
                  data: mockReportFields,
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
                single: jest.fn().mockResolvedValue({
                  data: {
                    id: reportInstanceId,
                    test_assignment_id: testAssignmentId,
                    report_type_id: reportTypeId,
                    status: 'pending',
                    created_by: mockUser.id,
                    created_at: now,
                    updated_at: now,
                    completed_at: null,
                  },
                  error: null,
                }),
              }),
            }),
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: {
                    id: reportInstanceId,
                    test_assignment_id: testAssignmentId,
                    report_type_id: reportTypeId,
                    status: 'pending',
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
            delete: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
          }
        }
      })

      const request = new NextRequest('http://localhost:3000/api/reports/instances', {
        method: 'POST',
        body: JSON.stringify({
          testAssignmentId,
          reportTypeId,
          values: {}
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.reportInstance.status).toBe('pending')
      expect(data.reportInstance.completedAt).toBeNull()
    })

    it('should set status to "in-progress" when some required fields filled', async () => {
      const testAssignmentId = '123e4567-e89b-12d3-a456-426614174000'
      const reportTypeId = '223e4567-e89b-12d3-a456-426614174000'
      const reportInstanceId = '323e4567-e89b-12d3-a456-426614174000'
      const now = new Date().toISOString()

      const mockReportFields = [
        {
          id: 'field-1',
          report_type_id: reportTypeId,
          field_name: 'blood_group',
          field_type: 'dropdown',
          is_required: true,
        },
        {
          id: 'field-2',
          report_type_id: reportTypeId,
          field_name: 'rh_factor',
          field_type: 'dropdown',
          is_required: true,
        }
      ]

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
        } else if (table === 'report_fields') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({
                  data: mockReportFields,
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
                single: jest.fn().mockResolvedValue({
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
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
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
            delete: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
            insert: jest.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }
        }
      })

      const request = new NextRequest('http://localhost:3000/api/reports/instances', {
        method: 'POST',
        body: JSON.stringify({
          testAssignmentId,
          reportTypeId,
          values: {
            blood_group: 'A'
            // rh_factor is missing
          }
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.reportInstance.status).toBe('in-progress')
      expect(data.reportInstance.completedAt).toBeNull()
    })

    it('should set status to "completed" when all required fields filled', async () => {
      const testAssignmentId = '123e4567-e89b-12d3-a456-426614174000'
      const reportTypeId = '223e4567-e89b-12d3-a456-426614174000'
      const reportInstanceId = '323e4567-e89b-12d3-a456-426614174000'
      const now = new Date().toISOString()

      const mockReportFields = [
        {
          id: 'field-1',
          report_type_id: reportTypeId,
          field_name: 'blood_group',
          field_type: 'dropdown',
          is_required: true,
        },
        {
          id: 'field-2',
          report_type_id: reportTypeId,
          field_name: 'rh_factor',
          field_type: 'dropdown',
          is_required: true,
        }
      ]

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
        } else if (table === 'report_fields') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({
                  data: mockReportFields,
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
                single: jest.fn().mockResolvedValue({
                  data: {
                    id: reportInstanceId,
                    test_assignment_id: testAssignmentId,
                    report_type_id: reportTypeId,
                    status: 'completed',
                    created_by: mockUser.id,
                    created_at: now,
                    updated_at: now,
                    completed_at: now,
                  },
                  error: null,
                }),
              }),
            }),
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: {
                    id: reportInstanceId,
                    test_assignment_id: testAssignmentId,
                    report_type_id: reportTypeId,
                    status: 'completed',
                    created_by: mockUser.id,
                    created_at: now,
                    updated_at: now,
                    completed_at: now,
                  },
                  error: null,
                }),
              }),
            }),
          }
        } else if (table === 'report_values') {
          return {
            delete: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
            insert: jest.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }
        }
      })

      const request = new NextRequest('http://localhost:3000/api/reports/instances', {
        method: 'POST',
        body: JSON.stringify({
          testAssignmentId,
          reportTypeId,
          values: {
            blood_group: 'A',
            rh_factor: 'POSITIVE'
          }
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.reportInstance.status).toBe('completed')
      expect(data.reportInstance.completedAt).toBeDefined()
    })
  })
})
