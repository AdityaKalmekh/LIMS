/**
 * Field Validation Functions for Patient Test Report Management System
 * 
 * This module provides individual field validation functions for report forms.
 * These functions validate specific aspects of field values:
 * - Numeric validation: ensures values are valid numbers
 * - Required field validation: ensures values are not empty
 * - Range indicator validation: checks if values fall outside normal ranges
 * 
 * These validators are used by the form validation logic to provide
 * real-time feedback to users as they enter report data.
 * 
 * @module lib/validation/field-validators
 */

import { ReportField } from '@/types/reports'

/**
 * Validates if a value is numeric
 * 
 * Checks if the provided value can be parsed as a valid number.
 * Handles various input types including strings, numbers, null, and undefined.
 * 
 * @param value - The value to validate (can be string, number, null, or undefined)
 * @returns true if the value is numeric, false otherwise
 * 
 * @example
 * validateNumericField("123") // returns true
 * validateNumericField("123.45") // returns true
 * validateNumericField("abc") // returns false
 * validateNumericField("") // returns false
 * validateNumericField(null) // returns false
 * 
 * Requirements: 8.1
 */
export function validateNumericField(value: any): boolean {
  // Handle null, undefined, or empty string
  if (value === null || value === undefined || value === '') {
    return false
  }

  // If it's already a number, check if it's valid (not NaN or Infinity)
  if (typeof value === 'number') {
    return !isNaN(value) && isFinite(value)
  }

  // If it's a string, try to parse it
  if (typeof value === 'string') {
    // Trim whitespace
    const trimmed = value.trim()
    
    // Empty string after trim is not numeric
    if (trimmed === '') {
      return false
    }

    // Try to parse as number
    const parsed = Number(trimmed)
    return !isNaN(parsed) && isFinite(parsed)
  }

  // Any other type is not numeric
  return false
}

/**
 * Validates if a required field has a value
 * 
 * Checks if the provided value is not empty. A value is considered empty if it is:
 * - null
 * - undefined
 * - empty string
 * - string containing only whitespace
 * 
 * @param value - The value to validate (can be any type)
 * @returns true if the value is not empty, false otherwise
 * 
 * @example
 * validateRequiredField("test") // returns true
 * validateRequiredField("  ") // returns false
 * validateRequiredField("") // returns false
 * validateRequiredField(null) // returns false
 * validateRequiredField(0) // returns true (zero is a valid value)
 * validateRequiredField(false) // returns true (boolean false is a valid value)
 * 
 * Requirements: 8.4
 */
export function validateRequiredField(value: any): boolean {
  // Handle null or undefined
  if (value === null || value === undefined) {
    return false
  }

  // Handle strings - check if empty or only whitespace
  if (typeof value === 'string') {
    return value.trim().length > 0
  }

  // For numbers, booleans, and other types, they are valid if not null/undefined
  // This allows 0, false, etc. to be valid values
  return true
}

/**
 * Validates if a numeric value is outside the normal range
 * 
 * Checks if the provided value falls outside the defined normal range for a field.
 * Returns true if the value is outside the range (indicating a potential abnormal result).
 * Returns false if the value is within the range or if validation cannot be performed.
 * 
 * @param value - The numeric value to check
 * @param field - The report field definition containing normal range information
 * @returns true if value is outside normal range, false if within range or cannot validate
 * 
 * @example
 * const field = { normalRangeMin: 10, normalRangeMax: 20, ... }
 * validateRangeIndicator(15, field) // returns false (within range)
 * validateRangeIndicator(5, field) // returns true (below range)
 * validateRangeIndicator(25, field) // returns true (above range)
 * validateRangeIndicator("abc", field) // returns false (not numeric)
 * 
 * Requirements: 8.2
 */
export function validateRangeIndicator(
  value: any,
  field: ReportField
): boolean {
  // If the field doesn't have a normal range defined, cannot validate
  if (field.normalRangeMin === null || field.normalRangeMax === null) {
    return false
  }

  // If the value is not numeric, cannot validate range
  if (!validateNumericField(value)) {
    return false
  }

  // Convert value to number for comparison
  const numericValue = typeof value === 'number' ? value : Number(value)

  // Check if value is outside the normal range
  return numericValue < field.normalRangeMin || numericValue > field.normalRangeMax
}

/**
 * Gets a validation error message for a field
 * 
 * Helper function that generates appropriate error messages based on
 * the field definition and validation failure type.
 * 
 * @param field - The report field definition
 * @param validationType - The type of validation that failed
 * @returns A user-friendly error message
 */
export function getFieldValidationMessage(
  field: ReportField,
  validationType: 'required' | 'numeric' | 'range'
): string {
  switch (validationType) {
    case 'required':
      return `${field.fieldLabel} is required`
    
    case 'numeric':
      return `${field.fieldLabel} must be a valid number`
    
    case 'range':
      if (field.normalRangeText) {
        return `${field.fieldLabel} is outside normal range (${field.normalRangeText})`
      }
      return `${field.fieldLabel} is outside normal range`
    
    default:
      return `${field.fieldLabel} is invalid`
  }
}
