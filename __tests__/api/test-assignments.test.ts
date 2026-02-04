/**
 * Test Assignments API Route Tests
 * 
 * Tests for POST /api/test-assignments endpoint
 * 
 * Requirements tested:
 * - 4.4: Validation that each selected patient has at least one test
 * - 4.6: Test assignment records are created in database
 * - 5.2: Test assignments stored with all required fields
 * - 5.5: Multiple test assignments per patient supported
 * 
 * To run these tests:
 * 1. Install testing framework: npm install --save-dev jest @types/jest
 * 2. Install test utilities: npm install --save-dev @jest/globals
 * 3. Configure Jest for Next.js
 * 4. Run: npm test
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/test-assignments/route'

// Mock Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

describe('POST /api/test-assignments', () => {
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

      const request = new NextRequest('http://localhost:3000/api/test-assignments', {
        method: 'POST',
        body: JSON.stringify({
          assignments: [
            { patientId: 'patient-1', tests: ['CBC'] }
          ]
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Unauthorized')
    })

    it('should proceed when user is authenticated', async () => {
      // Mock successful authentication
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      // Mock patient check
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockResolvedValue({
            data: [{ id: 'patient-1' }],
            error: null,
          }),
        }),
      })

      const request = new NextRequest('http://localhost:3000/api/test-assignments', {
        method: 'POST',
        body: JSON.stringify({
          assignments: [
            { patientId: 'patient-1', tests: ['CBC'] }
          ]
        }),
      })

      // This will fail at database insert, but that's ok - we're testing auth
      await POST(request)

      expect(mockSupabase.auth.getUser).toHaveBeenCalled()
    })
  })

  describe('Validation - Requirement 4.4', () => {
    beforeEach(() => {
      // Mock successful authentication for validation tests
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('should return 400 when assignments array is empty', async () => {
      const request = new NextRequest('http://localhost:3000/api/test-assignments', {
        method: 'POST',
        body: JSON.stringify({
          assignments: []
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Validation failed')
    })

    it('should return 400 when patient has no tests assigned', async () => {
      const request = new NextRequest('http://localhost:3000/api/test-assignments', {
        method: 'POST',
        body: JSON.stringify({
          assignments: [
            { patientId: 'patient-1', tests: [] }
          ]
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Validation failed')
      expect(data.errors).toBeDefined()
      expect(data.errors.some((e: any) => 
        e.message.includes('At least one test must be assigned')
      )).toBe(true)
    })

    it('should return 400 when patientId is not a valid UUID', async () => {
      const request = new NextRequest('http://localhost:3000/api/test-assignments', {
        method: 'POST',
        body: JSON.stringify({
          assignments: [
            { patientId: 'invalid-uuid', tests: ['CBC'] }
          ]
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Validation failed')
    })

    it('should return 400 when test type is invalid', async () => {
      const request = new NextRequest('http://localhost:3000/api/test-assignments', {
        method: 'POST',
        body: JSON.stringify({
          assignments: [
            { patientId: '123e4567-e89b-12d3-a456-426614174000', tests: ['INVALID'] }
          ]
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Validation failed')
    })

    it('should accept valid test types: CBC, BG, VDRL', async () => {
      // Mock patient check
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockResolvedValue({
            data: [{ id: 'patient-1' }],
            error: null,
          }),
        }),
      })

      const request = new NextRequest('http://localhost:3000/api/test-assignments', {
        method: 'POST',
        body: JSON.stringify({
          assignments: [
            { patientId: '123e4567-e89b-12d3-a456-426614174000', tests: ['CBC', 'BG', 'VDRL'] }
          ]
        }),
      })

      // This will fail at insert, but validation should pass
      await POST(request)

      // If we got past validation, the patient check should have been called
      expect(mockSupabase.from).toHaveBeenCalledWith('patients')
    })
  })

  describe('Patient Verification', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('should return 400 when patient ID does not exist', async () => {
      // Mock patient check - patient not found
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockResolvedValue({
            data: [], // No patients found
            error: null,
          }),
        }),
      })

      const request = new NextRequest('http://localhost:3000/api/test-assignments', {
        method: 'POST',
        body: JSON.stringify({
          assignments: [
            { patientId: '123e4567-e89b-12d3-a456-426614174000', tests: ['CBC'] }
          ]
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid patient IDs')
    })

    it('should return 500 when database error occurs during patient check', async () => {
      // Mock database error
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database connection failed' },
          }),
        }),
      })

      const request = new NextRequest('http://localhost:3000/api/test-assignments', {
        method: 'POST',
        body: JSON.stringify({
          assignments: [
            { patientId: '123e4567-e89b-12d3-a456-426614174000', tests: ['CBC'] }
          ]
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Database error')
    })
  })

  describe('Test Assignment Creation - Requirements 4.6, 5.2, 5.5', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('should create test assignment records successfully', async () => {
      const patientId = '123e4567-e89b-12d3-a456-426614174000'
      const now = new Date().toISOString()

      // Mock patient check
      let callCount = 0
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'patients') {
          return {
            select: jest.fn().mockReturnValue({
              in: jest.fn().mockResolvedValue({
                data: [{ id: patientId }],
                error: null,
              }),
            }),
          }
        } else if (table === 'test_assignments') {
          return {
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue({
                data: [
                  {
                    id: 'assignment-1',
                    patient_id: patientId,
                    test_type: 'CBC',
                    status: 'pending',
                    assigned_at: now,
                    assigned_by: mockUser.id,
                    created_at: now,
                  }
                ],
                error: null,
              }),
            }),
          }
        }
      })

      const request = new NextRequest('http://localhost:3000/api/test-assignments', {
        method: 'POST',
        body: JSON.stringify({
          assignments: [
            { patientId, tests: ['CBC'] }
          ]
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.created).toBe(1)
      expect(data.data.assignments).toHaveLength(1)
      expect(data.data.assignments[0].testType).toBe('CBC')
      expect(data.data.assignments[0].patientId).toBe(patientId)
    })

    it('should create multiple test assignments for one patient - Requirement 5.5', async () => {
      const patientId = '123e4567-e89b-12d3-a456-426614174000'
      const now = new Date().toISOString()

      // Mock patient check and insert
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'patients') {
          return {
            select: jest.fn().mockReturnValue({
              in: jest.fn().mockResolvedValue({
                data: [{ id: patientId }],
                error: null,
              }),
            }),
          }
        } else if (table === 'test_assignments') {
          return {
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue({
                data: [
                  {
                    id: 'assignment-1',
                    patient_id: patientId,
                    test_type: 'CBC',
                    status: 'pending',
                    assigned_at: now,
                    assigned_by: mockUser.id,
                    created_at: now,
                  },
                  {
                    id: 'assignment-2',
                    patient_id: patientId,
                    test_type: 'BG',
                    status: 'pending',
                    assigned_at: now,
                    assigned_by: mockUser.id,
                    created_at: now,
                  },
                  {
                    id: 'assignment-3',
                    patient_id: patientId,
                    test_type: 'VDRL',
                    status: 'pending',
                    assigned_at: now,
                    assigned_by: mockUser.id,
                    created_at: now,
                  }
                ],
                error: null,
              }),
            }),
          }
        }
      })

      const request = new NextRequest('http://localhost:3000/api/test-assignments', {
        method: 'POST',
        body: JSON.stringify({
          assignments: [
            { patientId, tests: ['CBC', 'BG', 'VDRL'] }
          ]
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.created).toBe(3)
      expect(data.data.assignments).toHaveLength(3)
      
      const testTypes = data.data.assignments.map((a: any) => a.testType)
      expect(testTypes).toContain('CBC')
      expect(testTypes).toContain('BG')
      expect(testTypes).toContain('VDRL')
    })

    it('should create assignments for multiple patients', async () => {
      const patient1Id = '123e4567-e89b-12d3-a456-426614174000'
      const patient2Id = '223e4567-e89b-12d3-a456-426614174000'
      const now = new Date().toISOString()

      // Mock patient check and insert
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'patients') {
          return {
            select: jest.fn().mockReturnValue({
              in: jest.fn().mockResolvedValue({
                data: [{ id: patient1Id }, { id: patient2Id }],
                error: null,
              }),
            }),
          }
        } else if (table === 'test_assignments') {
          return {
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue({
                data: [
                  {
                    id: 'assignment-1',
                    patient_id: patient1Id,
                    test_type: 'CBC',
                    status: 'pending',
                    assigned_at: now,
                    assigned_by: mockUser.id,
                    created_at: now,
                  },
                  {
                    id: 'assignment-2',
                    patient_id: patient2Id,
                    test_type: 'BG',
                    status: 'pending',
                    assigned_at: now,
                    assigned_by: mockUser.id,
                    created_at: now,
                  }
                ],
                error: null,
              }),
            }),
          }
        }
      })

      const request = new NextRequest('http://localhost:3000/api/test-assignments', {
        method: 'POST',
        body: JSON.stringify({
          assignments: [
            { patientId: patient1Id, tests: ['CBC'] },
            { patientId: patient2Id, tests: ['BG'] }
          ]
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.created).toBe(2)
      expect(data.message).toContain('2 patients')
    })

    it('should include all required fields in created assignments - Requirement 5.2', async () => {
      const patientId = '123e4567-e89b-12d3-a456-426614174000'
      const now = new Date().toISOString()

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'patients') {
          return {
            select: jest.fn().mockReturnValue({
              in: jest.fn().mockResolvedValue({
                data: [{ id: patientId }],
                error: null,
              }),
            }),
          }
        } else if (table === 'test_assignments') {
          return {
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue({
                data: [
                  {
                    id: 'assignment-1',
                    patient_id: patientId,
                    test_type: 'CBC',
                    status: 'pending',
                    assigned_at: now,
                    assigned_by: mockUser.id,
                    created_at: now,
                    updated_at: now,
                  }
                ],
                error: null,
              }),
            }),
          }
        }
      })

      const request = new NextRequest('http://localhost:3000/api/test-assignments', {
        method: 'POST',
        body: JSON.stringify({
          assignments: [
            { patientId, tests: ['CBC'] }
          ]
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      const assignment = data.data.assignments[0]
      
      // Verify all required fields are present
      expect(assignment.id).toBeDefined()
      expect(assignment.patientId).toBe(patientId)
      expect(assignment.testType).toBe('CBC')
      expect(assignment.status).toBe('pending')
      expect(assignment.assignedAt).toBeDefined()
      expect(assignment.assignedBy).toBe(mockUser.id)
      expect(assignment.createdAt).toBeDefined()
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('should return 400 for duplicate test assignment (unique constraint)', async () => {
      const patientId = '123e4567-e89b-12d3-a456-426614174000'

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'patients') {
          return {
            select: jest.fn().mockReturnValue({
              in: jest.fn().mockResolvedValue({
                data: [{ id: patientId }],
                error: null,
              }),
            }),
          }
        } else if (table === 'test_assignments') {
          return {
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue({
                data: null,
                error: { code: '23505', message: 'Unique constraint violation' },
              }),
            }),
          }
        }
      })

      const request = new NextRequest('http://localhost:3000/api/test-assignments', {
        method: 'POST',
        body: JSON.stringify({
          assignments: [
            { patientId, tests: ['CBC'] }
          ]
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Duplicate assignment')
    })

    it('should return 400 for foreign key constraint violation', async () => {
      const patientId = '123e4567-e89b-12d3-a456-426614174000'

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'patients') {
          return {
            select: jest.fn().mockReturnValue({
              in: jest.fn().mockResolvedValue({
                data: [{ id: patientId }],
                error: null,
              }),
            }),
          }
        } else if (table === 'test_assignments') {
          return {
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue({
                data: null,
                error: { code: '23503', message: 'Foreign key constraint violation' },
              }),
            }),
          }
        }
      })

      const request = new NextRequest('http://localhost:3000/api/test-assignments', {
        method: 'POST',
        body: JSON.stringify({
          assignments: [
            { patientId, tests: ['CBC'] }
          ]
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid reference')
    })

    it('should return 400 for invalid JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/test-assignments', {
        method: 'POST',
        body: 'invalid json',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid JSON')
    })

    it('should return 500 for unexpected database errors', async () => {
      const patientId = '123e4567-e89b-12d3-a456-426614174000'

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'patients') {
          return {
            select: jest.fn().mockReturnValue({
              in: jest.fn().mockResolvedValue({
                data: [{ id: patientId }],
                error: null,
              }),
            }),
          }
        } else if (table === 'test_assignments') {
          return {
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Unexpected database error' },
              }),
            }),
          }
        }
      })

      const request = new NextRequest('http://localhost:3000/api/test-assignments', {
        method: 'POST',
        body: JSON.stringify({
          assignments: [
            { patientId, tests: ['CBC'] }
          ]
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Database error')
    })
  })
})
