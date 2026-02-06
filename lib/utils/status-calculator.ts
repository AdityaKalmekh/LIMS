/**
 * Report Status Calculator for Patient Test Report Management System
 * 
 * This module provides functionality to calculate the status of a report instance
 * based on the completeness of its required fields.
 * 
 * Status determination rules:
 * - "pending": No values have been saved for the report
 * - "in-progress": Some but not all required fields have been filled
 * - "completed": All required fields have been filled and saved
 * 
 * @module lib/utils/status-calculator
 */

import { ReportField, ReportStatus } from '@/types/reports'

/**
 * Calculates the status of a report instance based on field completeness
 * 
 * Determines the appropriate status for a report by analyzing which required
 * fields have been filled. The status helps lab technicians track their progress
 * and prioritize their work.
 * 
 * @param fields - Array of report field definitions for the report type
 * @param values - Object mapping field names to their current values
 * @returns The calculated report status: "pending", "in-progress", or "completed"
 * 
 * @example
 * const fields = [
 *   { fieldName: 'blood_group', isRequired: true, ... },
 *   { fieldName: 'rh_factor', isRequired: true, ... }
 * ]
 * 
 * // No values saved
 * calculateReportStatus(fields, {}) // returns "pending"
 * 
 * // Some required fields filled
 * calculateReportStatus(fields, { blood_group: 'A' }) // returns "in-progress"
 * 
 * // All required fields filled
 * calculateReportStatus(fields, { blood_group: 'A', rh_factor: 'POSITIVE' }) // returns "completed"
 * 
 * Requirements: 9.1, 9.2, 9.3
 */
export function calculateReportStatus(
  fields: ReportField[],
  values: Record<string, any>
): ReportStatus {
  // Get all required fields
  const requiredFields = fields.filter(field => field.isRequired)

  // If there are no required fields, consider the report completed if any value exists
  if (requiredFields.length === 0) {
    const hasAnyValue = Object.keys(values).length > 0
    return hasAnyValue ? 'completed' : 'pending'
  }

  // Check if any values have been saved at all
  const hasAnyValue = Object.keys(values).some(key => {
    const value = values[key]
    return value !== null && value !== undefined && value !== ''
  })

  // If no values saved, status is pending
  if (!hasAnyValue) {
    return 'pending'
  }

  // Count how many required fields are filled
  let filledRequiredFields = 0

  for (const field of requiredFields) {
    const value = values[field.fieldName]
    
    // Check if the field has a valid value
    const isFilled = value !== null && 
                     value !== undefined && 
                     value !== '' &&
                     (typeof value !== 'string' || value.trim() !== '')
    
    if (isFilled) {
      filledRequiredFields++
    }
  }

  // If all required fields are filled, status is completed
  if (filledRequiredFields === requiredFields.length) {
    return 'completed'
  }

  // If some but not all required fields are filled, status is in-progress
  return 'in-progress'
}

/**
 * Checks if a specific field value is considered filled
 * 
 * Helper function to determine if a field has a valid value.
 * A value is considered filled if it is not null, undefined, empty string,
 * or whitespace-only string.
 * 
 * @param value - The field value to check
 * @returns true if the field is filled, false otherwise
 */
export function isFieldFilled(value: any): boolean {
  if (value === null || value === undefined) {
    return false
  }

  if (typeof value === 'string') {
    return value.trim().length > 0
  }

  // For numbers, booleans, and other types, they are considered filled
  // This allows 0, false, etc. to be valid values
  return true
}

/**
 * Gets a summary of report completion
 * 
 * Provides detailed information about how many required fields are filled
 * and the total number of required fields. Useful for displaying progress
 * indicators in the UI.
 * 
 * @param fields - Array of report field definitions for the report type
 * @param values - Object mapping field names to their current values
 * @returns Object containing filled count, total count, and completion percentage
 * 
 * @example
 * const fields = [
 *   { fieldName: 'field1', isRequired: true, ... },
 *   { fieldName: 'field2', isRequired: true, ... },
 *   { fieldName: 'field3', isRequired: false, ... }
 * ]
 * 
 * getReportCompletionSummary(fields, { field1: 'value' })
 * // returns { filledCount: 1, totalRequired: 2, percentComplete: 50 }
 */
export function getReportCompletionSummary(
  fields: ReportField[],
  values: Record<string, any>
): {
  filledCount: number
  totalRequired: number
  percentComplete: number
} {
  const requiredFields = fields.filter(field => field.isRequired)
  const totalRequired = requiredFields.length

  if (totalRequired === 0) {
    return {
      filledCount: 0,
      totalRequired: 0,
      percentComplete: 100
    }
  }

  const filledCount = requiredFields.filter(field => {
    return isFieldFilled(values[field.fieldName])
  }).length

  const percentComplete = Math.round((filledCount / totalRequired) * 100)

  return {
    filledCount,
    totalRequired,
    percentComplete
  }
}
