/**
 * Form Validation Functions for Patient Test Report Management System
 * 
 * This module provides form-level validation functions that validate all fields
 * in a report form based on their field definitions. It uses the individual
 * field validators to check each field and aggregates the results.
 * 
 * The main function validateReportForm checks:
 * - Required fields are not empty
 * - Numeric fields contain valid numbers
 * - Data types match field definitions
 * 
 * @module lib/validation/form-validator
 */

import { ReportField, ValidationResult, ValidationError } from '@/types/reports'
import {
  validateNumericField,
  validateRequiredField,
  getFieldValidationMessage
} from './field-validators'

/**
 * Validates all fields in a report form based on field definitions
 * 
 * This function performs comprehensive validation of all form data:
 * 1. Checks that all required fields have values
 * 2. Validates that numeric fields contain valid numbers
 * 3. Ensures data types match field definitions
 * 
 * The function returns a ValidationResult with:
 * - isValid: true if all validations pass, false otherwise
 * - errors: array of ValidationError objects for any failed validations
 * 
 * Note: Out-of-range values are NOT considered validation errors.
 * They are displayed with visual indicators but do not prevent saving.
 * 
 * @param fields - Array of report field definitions
 * @param data - Object containing field values (fieldName -> value)
 * @returns ValidationResult with isValid flag and errors array
 * 
 * @example
 * const fields = [
 *   { fieldName: 'hb', fieldType: 'number', isRequired: true, ... },
 *   { fieldName: 'blood_group', fieldType: 'dropdown', isRequired: true, ... }
 * ]
 * const data = { hb: '15.5', blood_group: 'A' }
 * const result = validateReportForm(fields, data)
 * // result = { isValid: true, errors: [] }
 * 
 * @example
 * const data = { hb: 'invalid', blood_group: '' }
 * const result = validateReportForm(fields, data)
 * // result = {
 * //   isValid: false,
 * //   errors: [
 * //     { fieldName: 'hb', message: 'Hb must be a valid number' },
 * //     { fieldName: 'blood_group', message: 'Blood Group is required' }
 * //   ]
 * // }
 * 
 * Requirements: 5.2, 5.4
 */
export function validateReportForm(
  fields: ReportField[],
  data: Record<string, any>
): ValidationResult {
  const errors: ValidationError[] = []

  // Validate each field based on its definition
  for (const field of fields) {
    const value = data[field.fieldName]

    // Check required fields
    if (field.isRequired && !validateRequiredField(value)) {
      errors.push({
        fieldName: field.fieldName,
        message: getFieldValidationMessage(field, 'required')
      })
      // Skip further validation for this field if it's empty and required
      continue
    }

    // Skip validation for optional empty fields
    if (!field.isRequired && (value === null || value === undefined || value === '')) {
      continue
    }

    // Check numeric fields
    if (field.fieldType === 'number' && value !== null && value !== undefined && value !== '') {
      if (!validateNumericField(value)) {
        errors.push({
          fieldName: field.fieldName,
          message: getFieldValidationMessage(field, 'numeric')
        })
      }
    }

    // Check dropdown fields have valid options
    if (field.fieldType === 'dropdown' && field.dropdownOptions && value) {
      if (!field.dropdownOptions.includes(value)) {
        errors.push({
          fieldName: field.fieldName,
          message: `${field.fieldLabel} must be one of: ${field.dropdownOptions.join(', ')}`
        })
      }
    }

    // Additional data type validation
    if (field.fieldType === 'text' || field.fieldType === 'textarea') {
      // Text fields should be strings (if they have a value)
      if (value !== null && value !== undefined && typeof value !== 'string') {
        errors.push({
          fieldName: field.fieldName,
          message: `${field.fieldLabel} must be text`
        })
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates a single field in a report form
 * 
 * This is a convenience function for validating individual fields,
 * useful for real-time validation as users type.
 * 
 * @param field - The report field definition
 * @param value - The field value to validate
 * @returns ValidationError if validation fails, null if validation passes
 * 
 * @example
 * const field = { fieldName: 'hb', fieldType: 'number', isRequired: true, ... }
 * const error = validateReportField(field, 'invalid')
 * // error = { fieldName: 'hb', message: 'Hb must be a valid number' }
 * 
 * @example
 * const error = validateReportField(field, '15.5')
 * // error = null (validation passed)
 */
export function validateReportField(
  field: ReportField,
  value: any
): ValidationError | null {
  // Check required fields
  if (field.isRequired && !validateRequiredField(value)) {
    return {
      fieldName: field.fieldName,
      message: getFieldValidationMessage(field, 'required')
    }
  }

  // Skip validation for optional empty fields
  if (!field.isRequired && (value === null || value === undefined || value === '')) {
    return null
  }

  // Check numeric fields
  if (field.fieldType === 'number' && value !== null && value !== undefined && value !== '') {
    if (!validateNumericField(value)) {
      return {
        fieldName: field.fieldName,
        message: getFieldValidationMessage(field, 'numeric')
      }
    }
  }

  // Check dropdown fields have valid options
  if (field.fieldType === 'dropdown' && field.dropdownOptions && value) {
    if (!field.dropdownOptions.includes(value)) {
      return {
        fieldName: field.fieldName,
        message: `${field.fieldLabel} must be one of: ${field.dropdownOptions.join(', ')}`
      }
    }
  }

  // Additional data type validation
  if (field.fieldType === 'text' || field.fieldType === 'textarea') {
    // Text fields should be strings (if they have a value)
    if (value !== null && value !== undefined && typeof value !== 'string') {
      return {
        fieldName: field.fieldName,
        message: `${field.fieldLabel} must be text`
      }
    }
  }

  return null
}

/**
 * Converts validation errors array to a map for easier lookup
 * 
 * This utility function transforms an array of ValidationError objects
 * into a Record<string, string> map for easier field-level error display.
 * 
 * @param errors - Array of validation errors
 * @returns Map of fieldName to error message
 * 
 * @example
 * const errors = [
 *   { fieldName: 'hb', message: 'Hb is required' },
 *   { fieldName: 'blood_group', message: 'Blood Group is required' }
 * ]
 * const errorMap = validationErrorsToMap(errors)
 * // errorMap = { hb: 'Hb is required', blood_group: 'Blood Group is required' }
 */
export function validationErrorsToMap(
  errors: ValidationError[]
): Record<string, string> {
  const errorMap: Record<string, string> = {}
  
  for (const error of errors) {
    errorMap[error.fieldName] = error.message
  }
  
  return errorMap
}

/**
 * Checks if a form has any validation errors
 * 
 * Convenience function to quickly check if there are any errors
 * without needing to check the errors array length.
 * 
 * @param result - The validation result to check
 * @returns true if there are errors, false otherwise
 */
export function hasValidationErrors(result: ValidationResult): boolean {
  return !result.isValid || result.errors.length > 0
}
