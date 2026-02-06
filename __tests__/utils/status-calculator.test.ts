/**
 * Unit Tests for Report Status Calculator
 * 
 * Tests the calculateReportStatus function and related utilities to ensure
 * proper status determination based on field completeness.
 * 
 * Requirements: 9.1, 9.2, 9.3
 */

import { describe, it, expect } from '@jest/globals'
import {
  calculateReportStatus,
  isFieldFilled,
  getReportCompletionSummary
} from '@/lib/utils/status-calculator'
import { ReportField } from '@/types/reports'

describe('calculateReportStatus', () => {
  describe('Pending Status - Requirement 9.1', () => {
    it('should return "pending" when no values are saved', () => {
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
        },
        {
          id: '2',
          reportTypeId: 'type1',
          fieldName: 'rh_factor',
          fieldLabel: 'Rh Factor',
          fieldType: 'dropdown',
          fieldOrder: 2,
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

      const values = {}
      const status = calculateReportStatus(fields, values)

      expect(status).toBe('pending')
    })

    it('should return "pending" when all values are empty strings', () => {
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

      const values = { blood_group: '' }
      const status = calculateReportStatus(fields, values)

      expect(status).toBe('pending')
    })

    it('should return "pending" when all values are null', () => {
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

      const values = { hb: null }
      const status = calculateReportStatus(fields, values)

      expect(status).toBe('pending')
    })

    it('should return "pending" when all values are whitespace', () => {
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

      const values = { notes: '   ' }
      const status = calculateReportStatus(fields, values)

      expect(status).toBe('pending')
    })
  })

  describe('In-Progress Status - Requirement 9.2', () => {
    it('should return "in-progress" when some required fields are filled', () => {
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
        },
        {
          id: '2',
          reportTypeId: 'type1',
          fieldName: 'rh_factor',
          fieldLabel: 'Rh Factor',
          fieldType: 'dropdown',
          fieldOrder: 2,
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

      const values = { blood_group: 'A' }
      const status = calculateReportStatus(fields, values)

      expect(status).toBe('in-progress')
    })

    it('should return "in-progress" when one of multiple required fields is filled', () => {
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
          fieldName: 'rbc',
          fieldLabel: 'RBC',
          fieldType: 'number',
          fieldOrder: 2,
          isRequired: true,
          unit: 'mill/cumm',
          normalRangeMin: 4.5,
          normalRangeMax: 5.5,
          normalRangeText: '4.5-5.5',
          dropdownOptions: null,
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        },
        {
          id: '3',
          reportTypeId: 'type1',
          fieldName: 'wbc',
          fieldLabel: 'WBC',
          fieldType: 'number',
          fieldOrder: 3,
          isRequired: true,
          unit: '/cumm',
          normalRangeMin: 4000,
          normalRangeMax: 11000,
          normalRangeText: '4000-11000',
          dropdownOptions: null,
          defaultValue: null,
          validationRules: null,
          createdAt: '2024-01-01'
        }
      ]

      const values = { hb: '15.5', rbc: '' }
      const status = calculateReportStatus(fields, values)

      expect(status).toBe('in-progress')
    })

    it('should return "in-progress" when optional fields are filled but required fields are not', () => {
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
          fieldName: 'notes',
          fieldLabel: 'Notes',
          fieldType: 'text',
          fieldOrder: 2,
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

      const values = { notes: 'Some notes' }
      const status = calculateReportStatus(fields, values)

      expect(status).toBe('in-progress')
    })
  })

  describe('Completed Status - Requirement 9.3', () => {
    it('should return "completed" when all required fields are filled', () => {
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
        },
        {
          id: '2',
          reportTypeId: 'type1',
          fieldName: 'rh_factor',
          fieldLabel: 'Rh Factor',
          fieldType: 'dropdown',
          fieldOrder: 2,
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

      const values = { blood_group: 'A', rh_factor: 'POSITIVE' }
      const status = calculateReportStatus(fields, values)

      expect(status).toBe('completed')
    })

    it('should return "completed" when all required fields are filled and optional fields are empty', () => {
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
          fieldName: 'notes',
          fieldLabel: 'Notes',
          fieldType: 'text',
          fieldOrder: 2,
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

      const values = { hb: '15.5', notes: '' }
      const status = calculateReportStatus(fields, values)

      expect(status).toBe('completed')
    })

    it('should return "completed" when all required fields are filled including zero values', () => {
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

      const values = { count: 0 }
      const status = calculateReportStatus(fields, values)

      expect(status).toBe('completed')
    })

    it('should return "completed" when there are no required fields and any value exists', () => {
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

      const values = { notes: 'Some notes' }
      const status = calculateReportStatus(fields, values)

      expect(status).toBe('completed')
    })
  })

  describe('Edge Cases', () => {
    it('should return "pending" when there are no required fields and no values', () => {
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

      const values = {}
      const status = calculateReportStatus(fields, values)

      expect(status).toBe('pending')
    })

    it('should handle empty fields array', () => {
      const fields: ReportField[] = []
      const values = {}
      const status = calculateReportStatus(fields, values)

      expect(status).toBe('pending')
    })

    it('should handle empty values object with required fields', () => {
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

      const values = {}
      const status = calculateReportStatus(fields, values)

      expect(status).toBe('pending')
    })

    it('should handle numeric string values', () => {
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

      const values = { hb: '15.5' }
      const status = calculateReportStatus(fields, values)

      expect(status).toBe('completed')
    })
  })
})

describe('isFieldFilled', () => {
  it('should return false for null', () => {
    expect(isFieldFilled(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isFieldFilled(undefined)).toBe(false)
  })

  it('should return false for empty string', () => {
    expect(isFieldFilled('')).toBe(false)
  })

  it('should return false for whitespace-only string', () => {
    expect(isFieldFilled('   ')).toBe(false)
  })

  it('should return true for non-empty string', () => {
    expect(isFieldFilled('test')).toBe(true)
  })

  it('should return true for zero', () => {
    expect(isFieldFilled(0)).toBe(true)
  })

  it('should return true for false', () => {
    expect(isFieldFilled(false)).toBe(true)
  })

  it('should return true for number', () => {
    expect(isFieldFilled(15.5)).toBe(true)
  })

  it('should return true for string with content', () => {
    expect(isFieldFilled('A')).toBe(true)
  })
})

describe('getReportCompletionSummary', () => {
  it('should return correct summary for partially filled report', () => {
    const fields: ReportField[] = [
      {
        id: '1',
        reportTypeId: 'type1',
        fieldName: 'field1',
        fieldLabel: 'Field 1',
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
      },
      {
        id: '2',
        reportTypeId: 'type1',
        fieldName: 'field2',
        fieldLabel: 'Field 2',
        fieldType: 'text',
        fieldOrder: 2,
        isRequired: true,
        unit: null,
        normalRangeMin: null,
        normalRangeMax: null,
        normalRangeText: null,
        dropdownOptions: null,
        defaultValue: null,
        validationRules: null,
        createdAt: '2024-01-01'
      },
      {
        id: '3',
        reportTypeId: 'type1',
        fieldName: 'field3',
        fieldLabel: 'Field 3',
        fieldType: 'text',
        fieldOrder: 3,
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

    const values = { field1: 'value1' }
    const summary = getReportCompletionSummary(fields, values)

    expect(summary.filledCount).toBe(1)
    expect(summary.totalRequired).toBe(2)
    expect(summary.percentComplete).toBe(50)
  })

  it('should return 100% for completed report', () => {
    const fields: ReportField[] = [
      {
        id: '1',
        reportTypeId: 'type1',
        fieldName: 'field1',
        fieldLabel: 'Field 1',
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
      },
      {
        id: '2',
        reportTypeId: 'type1',
        fieldName: 'field2',
        fieldLabel: 'Field 2',
        fieldType: 'text',
        fieldOrder: 2,
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

    const values = { field1: 'value1', field2: 'value2' }
    const summary = getReportCompletionSummary(fields, values)

    expect(summary.filledCount).toBe(2)
    expect(summary.totalRequired).toBe(2)
    expect(summary.percentComplete).toBe(100)
  })

  it('should return 100% when there are no required fields', () => {
    const fields: ReportField[] = [
      {
        id: '1',
        reportTypeId: 'type1',
        fieldName: 'field1',
        fieldLabel: 'Field 1',
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

    const values = {}
    const summary = getReportCompletionSummary(fields, values)

    expect(summary.filledCount).toBe(0)
    expect(summary.totalRequired).toBe(0)
    expect(summary.percentComplete).toBe(100)
  })

  it('should return 0% for empty report', () => {
    const fields: ReportField[] = [
      {
        id: '1',
        reportTypeId: 'type1',
        fieldName: 'field1',
        fieldLabel: 'Field 1',
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

    const values = {}
    const summary = getReportCompletionSummary(fields, values)

    expect(summary.filledCount).toBe(0)
    expect(summary.totalRequired).toBe(1)
    expect(summary.percentComplete).toBe(0)
  })
})
