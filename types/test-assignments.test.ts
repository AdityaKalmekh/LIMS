/**
 * Type validation tests for test assignment types
 * 
 * These tests verify that the TypeScript types are correctly defined
 * and can be used without compilation errors.
 */

import type {
  TestType,
  TestAssignmentStatus,
  TestAssignment,
  TestAssignmentDbRecord,
  TestAssignmentFormData,
  CreateTestAssignmentsRequest,
  CreateTestAssignmentsResponse,
  UnassignedPatientsQuery,
  UnassignedPatientsResponse,
} from './index'

// Type validation tests - these will fail at compile time if types are incorrect

// Test TestType
const validTestTypes: TestType[] = ['CBC', 'BG', 'VDRL']
// @ts-expect-error - Invalid test type should cause error
const invalidTestType: TestType = 'INVALID'

// Test TestAssignmentStatus
const validStatuses: TestAssignmentStatus[] = ['pending', 'in_progress', 'completed', 'cancelled']
// @ts-expect-error - Invalid status should cause error
const invalidStatus: TestAssignmentStatus = 'INVALID'

// Test TestAssignment interface
const testAssignment: TestAssignment = {
  id: '123',
  patientId: '456',
  testType: 'CBC',
  status: 'pending',
  assignedAt: '2024-01-01T00:00:00Z',
  assignedBy: '789',
  createdAt: '2024-01-01T00:00:00Z',
}

// Test optional fields
const testAssignmentWithOptionals: TestAssignment = {
  id: '123',
  patientId: '456',
  testType: 'BG',
  status: 'completed',
  assignedAt: '2024-01-01T00:00:00Z',
  assignedBy: '789',
  completedAt: '2024-01-02T00:00:00Z',
  notes: 'Test notes',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
}

// Test TestAssignmentDbRecord interface (snake_case)
const dbRecord: TestAssignmentDbRecord = {
  id: '123',
  patient_id: '456',
  test_type: 'VDRL',
  status: 'in_progress',
  assigned_at: '2024-01-01T00:00:00Z',
  assigned_by: '789',
  created_at: '2024-01-01T00:00:00Z',
}

// Test TestAssignmentFormData interface
const formData: TestAssignmentFormData = {
  patientId: '456',
  tests: ['CBC', 'BG'],
}

// Test CreateTestAssignmentsRequest interface
const createRequest: CreateTestAssignmentsRequest = {
  assignments: [
    { patientId: '456', tests: ['CBC'] },
    { patientId: '789', tests: ['BG', 'VDRL'] },
  ],
}

// Test UnassignedPatientsQuery interface
const query: UnassignedPatientsQuery = {
  page: 1,
  limit: 50,
}

const queryWithDefaults: UnassignedPatientsQuery = {}

// Test CreateTestAssignmentsResponse interface
const successResponse: CreateTestAssignmentsResponse = {
  success: true,
  data: {
    created: 2,
    assignments: [testAssignment],
  },
}

const errorResponse: CreateTestAssignmentsResponse = {
  success: false,
  error: 'Error message',
}

// Export to prevent unused variable warnings
export {
  validTestTypes,
  validStatuses,
  testAssignment,
  testAssignmentWithOptionals,
  dbRecord,
  formData,
  createRequest,
  query,
  queryWithDefaults,
  successResponse,
  errorResponse,
}
