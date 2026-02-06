/**
 * TypeScript Type Definitions for Patient Test Report Management System
 * 
 * This file contains all type definitions for the report management system including:
 * - Core domain models (ReportType, ReportField, ReportInstance, ReportValue)
 * - Composite models for UI (PatientWithTests, TestAssignmentWithStatus, ReportData)
 * - Validation types (ValidationError, ValidationResult)
 * 
 * These types align with the database schema and provide type safety throughout
 * the report management feature.
 * 
 * @module types/reports
 */

// ============================================================================
// Core Domain Types
// ============================================================================

/**
 * Report type definition - defines the structure of a specific kind of medical test
 * Maps to the report_types database table
 */
export interface ReportType {
  id: string
  code: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Report field definition - defines a single field within a report type
 * Maps to the report_fields database table
 */
export interface ReportField {
  id: string
  reportTypeId: string
  fieldName: string
  fieldLabel: string
  fieldType: 'text' | 'number' | 'dropdown' | 'textarea'
  fieldOrder: number
  isRequired: boolean
  unit: string | null
  normalRangeMin: number | null
  normalRangeMax: number | null
  normalRangeText: string | null
  dropdownOptions: string[] | null
  defaultValue: string | null
  validationRules: Record<string, any> | null
  createdAt: string
}

/**
 * Report instance - a specific occurrence of a report type for a patient
 * Maps to the report_instances database table
 */
export interface ReportInstance {
  id: string
  testAssignmentId: string
  reportTypeId: string
  status: 'pending' | 'in-progress' | 'completed'
  createdBy: string
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

/**
 * Report value - stores a single field value for a report instance (EAV pattern)
 * Maps to the report_values database table
 */
export interface ReportValue {
  id: string
  reportInstanceId: string
  reportFieldId: string
  valueText: string | null
  valueNumber: number | null
  createdAt: string
  updatedAt: string
}

// ============================================================================
// Database Record Types (snake_case)
// ============================================================================

/**
 * Report type database record (snake_case as stored in Supabase)
 */
export interface ReportTypeDbRecord {
  id: string
  code: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Report field database record (snake_case as stored in Supabase)
 */
export interface ReportFieldDbRecord {
  id: string
  report_type_id: string
  field_name: string
  field_label: string
  field_type: string
  field_order: number
  is_required: boolean
  unit: string | null
  normal_range_min: number | null
  normal_range_max: number | null
  normal_range_text: string | null
  dropdown_options: string[] | null
  default_value: string | null
  validation_rules: Record<string, any> | null
  created_at: string
}

/**
 * Report instance database record (snake_case as stored in Supabase)
 */
export interface ReportInstanceDbRecord {
  id: string
  test_assignment_id: string
  report_type_id: string
  status: string
  created_by: string
  created_at: string
  updated_at: string
  completed_at: string | null
}

/**
 * Report value database record (snake_case as stored in Supabase)
 */
export interface ReportValueDbRecord {
  id: string
  report_instance_id: string
  report_field_id: string
  value_text: string | null
  value_number: number | null
  created_at: string
  updated_at: string
}

// ============================================================================
// Composite Types for UI
// ============================================================================

/**
 * Patient with test assignments - used in the patient list view
 * Combines patient data with their assigned tests
 */
export interface PatientWithTests {
  id: string
  name: string
  patientId: string
  age: number
  gender: string
  contact: string
  testAssignments: TestAssignmentWithStatus[]
}

/**
 * Test assignment with report status - used in the test assignment list
 * Combines test assignment data with the current report status
 */
export interface TestAssignmentWithStatus {
  id: string
  testName: string
  assignedDate: string
  reportStatus: 'pending' | 'in-progress' | 'completed'
  reportTypeCode: string
}

/**
 * Report data - used for saving and loading report form data
 * Contains the report instance ID (if exists) and field values
 */
export interface ReportData {
  reportInstanceId: string | null
  testAssignmentId: string
  reportTypeId: string
  values: Record<string, any> // fieldName -> value
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Validation error for a specific field
 */
export interface ValidationError {
  fieldName: string
  message: string
}

/**
 * Validation result containing validity status and any errors
 */
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// ============================================================================
// Form Component Props Types
// ============================================================================

/**
 * Props for report form components (Blood Group, CBC, Generic)
 */
export interface ReportFormProps {
  fields: ReportField[]
  data: Record<string, any>
  errors: Record<string, string>
  onChange: (fieldName: string, value: any) => void
}

/**
 * Props for the report form container component
 */
export interface ReportFormContainerProps {
  testAssignmentId: string
  reportTypeCode: string
  onSave: (data: ReportData) => Promise<void>
  onNavigate: (direction: 'next' | 'prev') => void
}

/**
 * State for the report form container
 */
export interface ReportFormState {
  reportType: ReportType | null
  reportFields: ReportField[]
  reportData: Record<string, any>
  validationErrors: Record<string, string>
  isSaving: boolean
  saveStatus: 'idle' | 'saving' | 'success' | 'error'
}

/**
 * Props for the patient list component
 */
export interface PatientListProps {
  patients: PatientWithTests[]
  selectedPatientId: string | null
  onPatientSelect: (patientId: string) => void
}

/**
 * Props for the test assignment list component
 */
export interface TestAssignmentListProps {
  testAssignments: TestAssignmentWithStatus[]
  selectedTestId: string | null
  onTestSelect: (testAssignmentId: string) => void
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Request body for creating or updating a report instance
 */
export interface SaveReportRequest {
  testAssignmentId: string
  reportTypeId: string
  values: Record<string, any>
}

/**
 * Response data for saving a report
 */
export interface SaveReportResponse {
  reportInstance: ReportInstance
  status: 'created' | 'updated'
}

/**
 * Response data for fetching report type definition
 */
export interface ReportTypeDefinitionResponse {
  reportType: ReportType
  fields: ReportField[]
}

/**
 * Response data for fetching report instance data
 */
export interface ReportInstanceDataResponse {
  reportInstance: ReportInstance | null
  values: Record<string, any> // fieldName -> value
}

/**
 * Response data for fetching patients with tests
 */
export interface PatientsWithTestsResponse {
  patients: PatientWithTests[]
}

/**
 * Response data for fetching test assignments for a patient
 */
export interface TestAssignmentsResponse {
  testAssignments: TestAssignmentWithStatus[]
}

// ============================================================================
// Report Form Registry Types
// ============================================================================

/**
 * Report form component type
 */
export type ReportFormComponent = React.ComponentType<ReportFormProps>

/**
 * Report form registry mapping report type codes to form components
 */
export interface ReportFormRegistry {
  [reportTypeCode: string]: ReportFormComponent
}

// ============================================================================
// Page State Types
// ============================================================================

/**
 * State for the main reports page component
 */
export interface ReportsPageState {
  selectedPatientId: string | null
  selectedTestAssignmentId: string | null
  patients: PatientWithTests[]
  isLoading: boolean
  error: string | null
}

// ============================================================================
// Utility Types for Reports
// ============================================================================

/**
 * Report status type
 */
export type ReportStatus = 'pending' | 'in-progress' | 'completed'

/**
 * Field type options
 */
export type FieldType = 'text' | 'number' | 'dropdown' | 'textarea'

/**
 * Save status type
 */
export type SaveStatus = 'idle' | 'saving' | 'success' | 'error'

/**
 * Navigation direction type
 */
export type NavigationDirection = 'next' | 'prev'
