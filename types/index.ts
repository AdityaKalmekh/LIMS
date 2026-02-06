/**
 * TypeScript Type Definitions for LIMS Application
 * 
 * This file serves as the central type definition hub for the entire LIMS application.
 * All TypeScript interfaces and types are organized here for consistency and reusability.
 * 
 * Organization:
 * 1. Patient Types - Core patient data structures and related types
 * 2. Test Assignment Types - Test assignment data structures
 * 3. Report Types - Report management system types (re-exported from reports.ts)
 * 4. Form Types - Form-related interfaces for validation and state management
 * 5. API Response Types - Standardized API response structures
 * 6. Supabase Database Types - Database schema types and query responses
 * 7. User Types - User and authentication related types
 * 8. UI Component Types - Props and state types for UI components
 * 9. Utility Types - Generic utility types for type transformations
 * 
 * Usage:
 * Import types from this file in your components, pages, and utilities:
 * ```typescript
 * import { Patient, ApiResponse, PatientFormData } from '@/types'
 * ```
 * 
 * Naming Conventions:
 * - Interfaces: PascalCase (e.g., PatientFormData)
 * - Type aliases: PascalCase (e.g., ViewMode)
 * - Enums: PascalCase (e.g., PatientTitle)
 * 
 * @module types
 */

// ============================================================================
// Patient Types
// ============================================================================

// Import and re-export patient types from validation schema
import type { PatientFormData as _PatientFormData, Patient as _Patient } from '@/lib/validations/patient'

export type PatientFormData = _PatientFormData
export type Patient = _Patient

/**
 * Patient title options
 */
export type PatientTitle = 'Mr.' | 'Mrs.' | 'Ms.' | 'Dr.' | 'Master' | 'Miss'

/**
 * Patient sex options
 */
export type PatientSex = 'Male' | 'Female' | 'Other'

/**
 * Patient database record (snake_case as stored in Supabase)
 */
export interface PatientDbRecord {
  id: string
  mobile_number: string
  title: string
  first_name: string
  last_name: string | null
  sex: string
  age_years: number
  age_months: number
  age_days: number
  referred_by: string | null
  created_at: string
  created_by: string
  updated_at: string | null
}

// ============================================================================
// Test Assignment Types
// ============================================================================

/**
 * Lab test type options
 */
export type TestType = 'CBC' | 'BG' | 'VDRL'

/**
 * Test assignment status options
 */
export type TestAssignmentStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

/**
 * Test assignment (camelCase for application use)
 */
export interface TestAssignment {
  id: string
  patientId: string
  testType: TestType
  status: TestAssignmentStatus
  assignedAt: string
  assignedBy: string
  completedAt?: string
  notes?: string
  createdAt: string
  updatedAt?: string
}

/**
 * Test assignment database record (snake_case as stored in Supabase)
 */
export interface TestAssignmentDbRecord {
  id: string
  patient_id: string
  test_type: string
  status: string
  assigned_at: string
  assigned_by: string
  completed_at?: string
  notes?: string
  created_at: string
  updated_at?: string
}

/**
 * Form data for creating test assignments
 */
export interface TestAssignmentFormData {
  patientId: string
  tests: TestType[]
}

/**
 * Request body for creating test assignments
 */
export interface CreateTestAssignmentsRequest {
  assignments: TestAssignmentFormData[]
}

/**
 * Response data for successful test assignment creation
 */
export interface CreateTestAssignmentsData {
  created: number
  assignments: TestAssignment[]
}

/**
 * API response for creating test assignments
 */
export type CreateTestAssignmentsResponse = ApiResponse<CreateTestAssignmentsData>

/**
 * Query parameters for fetching unassigned patients
 */
export interface UnassignedPatientsQuery {
  page?: number
  limit?: number
}

/**
 * API response for fetching unassigned patients
 */
export type UnassignedPatientsResponse = PaginatedResponse<Patient>

// ============================================================================
// Report Types
// ============================================================================

// Re-export all report types from the reports module
export * from './reports'

// ============================================================================
// Form Types
// ============================================================================

/**
 * Generic form state interface
 */
export interface FormState {
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
}

/**
 * Form field error
 */
export interface FormFieldError {
  field: string
  message: string
}

/**
 * Form validation result
 */
export interface FormValidationResult {
  success: boolean
  errors?: FormFieldError[]
}

/**
 * Patient registration form props
 */
export interface PatientRegistrationFormProps {
  onSuccess: (patient: Patient) => void
  onCancel: () => void
}

/**
 * Login form data
 */
export interface LoginFormData {
  email: string
  password: string
}

/**
 * Signup form data
 */
export interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Generic API success response
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true
  data?: T
  message?: string
}

/**
 * Generic API response wrapper (can be success or error)
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

/**
 * API error response with validation errors
 */
export interface ApiErrorResponse {
  success: false
  error: string
  message: string
  errors?: FormFieldError[]
}

/**
 * API success response for patient creation
 */
export interface PatientCreateResponse {
  success: true
  message: string
  data: Patient
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

/**
 * Paginated API response (success case)
 */
export interface PaginatedResponseSuccess<T> {
  success: true
  data: T[]
  pagination: PaginationMeta
}

/**
 * Paginated API response (can be success or error)
 */
export type PaginatedResponse<T> = PaginatedResponseSuccess<T> | ApiErrorResponse

/**
 * Patient list API response
 */
export interface PatientListResponse extends PaginatedResponseSuccess<Patient> {}

// ============================================================================
// Supabase Database Types
// ============================================================================

/**
 * Supabase auth user type
 */
export interface SupabaseUser {
  id: string
  email: string
  created_at: string
  updated_at: string
  email_confirmed_at?: string
  last_sign_in_at?: string
}

/**
 * Supabase auth session type
 */
export interface SupabaseSession {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
  user: SupabaseUser
}

/**
 * Supabase auth response
 */
export interface SupabaseAuthResponse {
  data: {
    user: SupabaseUser | null
    session: SupabaseSession | null
  }
  error: SupabaseError | null
}

/**
 * Supabase error type
 */
export interface SupabaseError {
  message: string
  status?: number
  code?: string
}

/**
 * Supabase query response
 */
export interface SupabaseQueryResponse<T> {
  data: T | null
  error: SupabaseError | null
  count?: number | null
  status: number
  statusText: string
}

/**
 * Database table names
 */
export type DatabaseTable = 'patients'

/**
 * Database insert payload for patients table
 */
export interface PatientInsertPayload {
  mobile_number: string
  title: string
  first_name: string
  last_name: string | null
  sex: string
  age_years: number
  age_months: number
  age_days: number
  referred_by: string | null
  created_by: string
}

/**
 * Database update payload for patients table
 */
export interface PatientUpdatePayload {
  mobile_number?: string
  title?: string
  first_name?: string
  last_name?: string | null
  sex?: string
  age_years?: number
  age_months?: number
  age_days?: number
  referred_by?: string | null
  updated_at?: string
}

// ============================================================================
// User Types
// ============================================================================

/**
 * Application user (admin)
 */
export interface User {
  id: string
  email: string
  createdAt: string
}

/**
 * User profile
 */
export interface UserProfile {
  id: string
  email: string
  createdAt: string
  lastSignInAt?: string
}

// ============================================================================
// UI Component Types
// ============================================================================

/**
 * View mode for patient list
 */
export type ViewMode = 'list' | 'grid'

/**
 * Sidebar props
 */
export interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Header props
 */
export interface HeaderProps {
  onMenuClick: () => void
  onNewPatient: () => void
}

/**
 * Patient list props
 */
export interface PatientListProps {
  patients: Patient[]
  viewMode: ViewMode
  isLoading?: boolean
}

/**
 * Toast notification type
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning'

/**
 * Toast notification
 */
export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * Make specific properties required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Omit multiple properties
 */
export type OmitMultiple<T, K extends keyof T> = Omit<T, K>

/**
 * Extract non-nullable type
 */
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>
}
