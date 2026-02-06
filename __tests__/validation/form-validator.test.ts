/**
 * Unit Tests for Form Validation Functions
 * 
 * Tests the validateReportForm function and related utilities to ensure
 * proper validation of report form data based on field definitions.
 * 
 * Requirements: 5.2, 5.4
 */

import { describe, it, expect } from '@jest/globals'
import {
  validateReportForm,
  validateReportField,
  validationErrorsToMap,
  hasValidationErrors
} from '@/lib/validation/form-validator'
import { ReportField } from '@/types/reports'

describe('validateReportForm', () => {
  describe('Required Field Validation - Requirement 8.4, 5.4', () => {
    it('should return error when required field is empty', () => {
      const fields: ReportField[] = [
        {
          id: '1',
          reportTypeId: 'type1',
          fieldName: 'blood_group',
          fieldLabel: 'Blood Group',
          fieldType: 'dropdown',
          fieldOrder: 1,
          isRequired: true,
          unit: null,
          normalRangeMin: null,
          normalRangeMax: null,
          normalRangeText: null,
          dropdownOptions: ['A', 'B', 'AB', 'O'],
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const data = { blood_group: '' }
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].fieldName).toBe('blood_group')
      expect(result.errors[0].message).toBe('Blood Group is required')
    })

    it('should return error when required field is null', () => {
      const fields: ReportField[] = [
        {
          id: '1',
          reportTypeId: 'type1',
          fieldName: 'hb',
          fieldLabel: 'Haemoglobin',
          fieldType: 'number',
          fieldOrder: 1,
          isRequired: true,
          unit: 'gm/dl',
          normalRangeMin: 13.0,
          normalRangeMax: 17.0,
          normalRangeText: '13-17',
          dropdownOptions: null,
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const data = { hb: null }
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].fieldName).toBe('hb')
      expect(result.errors[0].message).toBe('Haemoglobin is required')
    })

    it('should return error when required field is undefined', () => {
      const fields: ReportField[] = [
        {
          id: '1',
          reportTypeId: 'type1',
          fieldName: 'rh_factor',
          fieldLabel: 'Rh Factor',
          fieldType: 'dropdown',
          fieldOrder: 1,
          isRequired: true,
          unit: null,
          normalRangeMin: null,
          normalRangeMax: null,
          normalRangeText: null,
          dropdownOptions: ['POSITIVE', 'NEGATIVE'],
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const data = {}
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].fieldName).toBe('rh_factor')
    })

    it('should return error when required field is only whitespace', () => {
      const fields: ReportField[] = [
        {
          id: '1',
          reportTypeId: 'type1',
          fieldName: 'notes',
          fieldLabel: 'Notes',
          fieldType: 'text',
          fieldOrder: 1,
          isRequired: true,
          unit: null,
          normalRangeMin: null,
          normalRangeMax: null,
          normalRangeText: null,
          dropdownOptions: null,
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const data = { notes: '   ' }
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].fieldName).toBe('notes')
    })

    it('should pass when required field has valid value', () => {
      const fields: ReportField[] = [
        {
          id: '1',
          reportTypeId: 'type1',
          fieldName: 'blood_group',
          fieldLabel: 'Blood Group',
          fieldType: 'dropdown',
          fieldOrder: 1,
          isRequired: true,
          unit: null,
          normalRangeMin: null,
          normalRangeMax: null,
          normalRangeText: null,
          dropdownOptions: ['A', 'B', 'AB', 'O'],
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const data = { blood_group: 'A' }
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should allow zero as valid value for required numeric field', () => {
      const fields: ReportField[] = [
        {
          id: '1',
          reportTypeId: 'type1',
          fieldName: 'count',
          fieldLabel: 'Count',
          fieldType: 'number',
          fieldOrder: 1,
          isRequired: true,
          unit: null,
          normalRangeMin: null,
          normalRangeMax: null,
          normalRangeText: null,
          dropdownOptions: null,
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const data = { count: 0 }
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('Numeric Field Validation - Requirement 8.1, 5.4', () => {
    it('should return error when numeric field contains non-numeric text', () => {
      const fields: ReportField[] = [
        {
          id: '1',
          reportTypeId: 'type1',
          fieldName: 'hb',
          fieldLabel: 'Haemoglobin',
          fieldType: 'number',
          fieldOrder: 1,
          isRequired: true,
          unit: 'gm/dl',
          normalRangeMin: 13.0,
          normalRangeMax: 17.0,
          normalRangeText: '13-17',
          dropdownOptions: null,
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const data = { hb: 'invalid' }
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].fieldName).toBe('hb')
      expect(result.errors[0].message).toBe('Haemoglobin must be a valid number')
    })

    it('should pass when numeric field contains valid number string', () => {
      const fields: ReportField[] = [
        {
          id: '1',
          reportTypeId: 'type1',
          fieldName: 'hb',
          fieldLabel: 'Haemoglobin',
          fieldType: 'number',
          fieldOrder: 1,
          isRequired: true,
          unit: 'gm/dl',
          normalRangeMin: 13.0,
          normalRangeMax: 17.0,
          normalRangeText: '13-17',
          dropdownOptions: null,
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const data = { hb: '15.5' }
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should pass when numeric field contains actual number', () => {
      const fields: ReportField[] = [
        {
          id: '1',
          reportTypeId: 'type1',
          fieldName: 'hb',
          fieldLabel: 'Haemoglobin',
          fieldType: 'number',
          fieldOrder: 1,
          isRequired: true,
          unit: 'gm/dl',
          normalRangeMin: 13.0,
          normalRangeMax: 17.0,
          normalRangeText: '13-17',
          dropdownOptions: null,
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const data = { hb: 15.5 }
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should skip numeric validation for optional empty fields', () => {
      const fields: ReportField[] = [
        {
          id: '1',
          reportTypeId: 'type1',
          fieldName: 'optional_count',
          fieldLabel: 'Optional Count',
          fieldType: 'number',
          fieldOrder: 1,
          isRequired: false,
          unit: null,
          normalRangeMin: null,
          normalRangeMax: null,
          normalRangeText: null,
          dropdownOptions: null,
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const data = { optional_count: '' }
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('Dropdown Field Validation', () => {
    it('should return error when dropdown value is not in options', () => {
      const fields: ReportField[] = [
        {
          id: '1',
          reportTypeId: 'type1',
          fieldName: 'blood_group',
          fieldLabel: 'Blood Group',
          fieldType: 'dropdown',
          fieldOrder: 1,
          isRequired: true,
          unit: null,
          normalRangeMin: null,
          normalRangeMax: null,
          normalRangeText: null,
          dropdownOptions: ['A', 'B', 'AB', 'O'],
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const data = { blood_group: 'Z' }
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].fieldName).toBe('blood_group')
      expect(result.errors[0].message).toContain('must be one of')
    })

    it('should pass when dropdown value is in options', () => {
      const fields: ReportField[] = [
        {
          id: '1',
          reportTypeId: 'type1',
          fieldName: 'blood_group',
          fieldLabel: 'Blood Group',
          fieldType: 'dropdown',
          fieldOrder: 1,
          isRequired: true,
          unit: null,
          normalRangeMin: null,
          normalRangeMax: null,
          normalRangeText: null,
          dropdownOptions: ['A', 'B', 'AB', 'O'],
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const data = { blood_group: 'AB' }
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('Text Field Validation', () => {
    it('should return error when text field contains non-string value', () => {
      const fields: ReportField[] = [
        {
          id: '1',
          reportTypeId: 'type1',
          fieldName: 'notes',
          fieldLabel: 'Notes',
          fieldType: 'text',
          fieldOrder: 1,
          isRequired: false,
          unit: null,
          normalRangeMin: null,
          normalRangeMax: null,
          normalRangeText: null,
          dropdownOptions: null,
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const data = { notes: 12345 }
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].fieldName).toBe('notes')
      expect(result.errors[0].message).toBe('Notes must be text')
    })

    it('should pass when text field contains string value', () => {
      const fields: ReportField[] = [
        {
          id: '1',
          reportTypeId: 'type1',
          fieldName: 'notes',
          fieldLabel: 'Notes',
          fieldType: 'text',
          fieldOrder: 1,
          isRequired: false,
          unit: null,
          normalRangeMin: null,
          normalRangeMax: null,
          normalRangeText: null,
          dropdownOptions: null,
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const data = { notes: 'Some notes here' }
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('Multiple Field Validation', () => {
    it('should return multiple errors when multiple fields are invalid', () => {
      const fields: ReportField[] = [
        {
          id: '1',
          reportTypeId: 'type1',
          fieldName: 'hb',
          fieldLabel: 'Haemoglobin',
          fieldType: 'number',
          fieldOrder: 1,
          isRequired: true,
          unit: 'gm/dl',
          normalRangeMin: 13.0,
          normalRangeMax: 17.0,
          normalRangeText: '13-17',
          dropdownOptions: null,
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        },
        {
          id: '2',
          reportTypeId: 'type1',
          fieldName: 'blood_group',
          fieldLabel: 'Blood Group',
          fieldType: 'dropdown',
          fieldOrder: 2,
          isRequired: true,
          unit: null,
          normalRangeMin: null,
          normalRangeMax: null,
          normalRangeText: null,
          dropdownOptions: ['A', 'B', 'AB', 'O'],
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const data = { hb: 'invalid', blood_group: '' }
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(2)
      expect(result.errors[0].fieldName).toBe('hb')
      expect(result.errors[1].fieldName).toBe('blood_group')
    })

    it('should pass when all fields are valid', () => {
      const fields: ReportField[] = [
        {
          id: '1',
          reportTypeId: 'type1',
          fieldName: 'hb',
          fieldLabel: 'Haemoglobin',
          fieldType: 'number',
          fieldOrder: 1,
          isRequired: true,
          unit: 'gm/dl',
          normalRangeMin: 13.0,
          normalRangeMax: 17.0,
          normalRangeText: '13-17',
          dropdownOptions: null,
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        },
        {
          id: '2',
          reportTypeId: 'type1',
          fieldName: 'blood_group',
          fieldLabel: 'Blood Group',
          fieldType: 'dropdown',
          fieldOrder: 2,
          isRequired: true,
          unit: null,
          normalRangeMin: null,
          normalRangeMax: null,
          normalRangeText: null,
          dropdownOptions: ['A', 'B', 'AB', 'O'],
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const data = { hb: '15.5', blood_group: 'A' }
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty fields array', () => {
      const fields: ReportField[] = []
      const data = {}
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should handle empty data object', () => {
      const fields: ReportField[] = [
        {
          id: '1',
          reportTypeId: 'type1',
          fieldName: 'optional_field',
          fieldLabel: 'Optional Field',
          fieldType: 'text',
          fieldOrder: 1,
          isRequired: false,
          unit: null,
          normalRangeMin: null,
          normalRangeMax: null,
          normalRangeText: null,
          dropdownOptions: null,
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const data = {}
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should handle fields with special characters in labels', () => {
      const fields: ReportField[] = [
        {
          id: '1',
          reportTypeId: 'type1',
          fieldName: 'special',
          fieldLabel: 'Field with "quotes" & symbols',
          fieldType: 'text',
          fieldOrder: 1,
          isRequired: true,
          unit: null,
          normalRangeMin: null,
          normalRangeMax: null,
          normalRangeText: null,
          dropdownOptions: null,
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const data = { special: '' }
      const result = validateReportForm(fields, data)

      expect(result.isValid).toBe(false)
      expect(result.errors[0].message).toContain('Field with "quotes" & symbols')
    })
  })
})

describe('validateReportField', () => {
  it('should return error for invalid required field', () => {
    const field: ReportField = {
      id: '1',
      reportTypeId: 'type1',
      fieldName: 'hb',
      fieldLabel: 'Haemoglobin',
      fieldType: 'number',
      fieldOrder: 1,
      isRequired: true,
      unit: 'gm/dl',
      normalRangeMin: 13.0,
      normalRangeMax: 17.0,
      normalRangeText: '13-17',
      dropdownOptions: null,
      defaultValue: null,
      validationRules: null,
      createdAt: '2024-01-01'
    }

    const error = validateReportField(field, '')

    expect(error).not.toBeNull()
    expect(error?.fieldName).toBe('hb')
    expect(error?.message).toBe('Haemoglobin is required')
  })

  it('should return null for valid field', () => {
    const field: ReportField = {
      id: '1',
      reportTypeId: 'type1',
      fieldName: 'hb',
      fieldLabel: 'Haemoglobin',
      fieldType: 'number',
      fieldOrder: 1,
      isRequired: true,
      unit: 'gm/dl',
      normalRangeMin: 13.0,
      normalRangeMax: 17.0,
      normalRangeText: '13-17',
      dropdownOptions: null,
      defaultValue: null,
      validationRules: null,
      createdAt: '2024-01-01'
    }

    const error = validateReportField(field, '15.5')

    expect(error).toBeNull()
  })
})

describe('validationErrorsToMap', () => {
  it('should convert errors array to map', () => {
    const errors = [
      { fieldName: 'hb', message: 'Haemoglobin is required' },
      { fieldName: 'blood_group', message: 'Blood Group is required' }
    ]

    const errorMap = validationErrorsToMap(errors)

    expect(errorMap).toEqual({
      hb: 'Haemoglobin is required',
      blood_group: 'Blood Group is required'
    })
  })

  it('should return empty map for empty errors array', () => {
    const errors: any[] = []
    const errorMap = validationErrorsToMap(errors)

    expect(errorMap).toEqual({})
  })
})

describe('hasValidationErrors', () => {
  it('should return true when result has errors', () => {
    const result = {
      isValid: false,
      errors: [{ fieldName: 'hb', message: 'Haemoglobin is required' }]
    }

    expect(hasValidationErrors(result)).toBe(true)
  })

  it('should return false when result has no errors', () => {
    const result = {
      isValid: true,
      errors: []
    }

    expect(hasValidationErrors(result)).toBe(false)
  })
})
