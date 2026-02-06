/**
 * Manual verification script for form validator
 * 
 * This script manually tests the validateReportForm function
 * to ensure it works correctly with various inputs.
 */

import { validateReportForm } from '../lib/validation/form-validator'
import { ReportField } from '../types/reports'

// Test Case 1: Required field validation
console.log('Test Case 1: Required field validation')
const fields1: ReportField[] = [
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

const data1 = { blood_group: '' }
const result1 = validateReportForm(fields1, data1)
console.log('Empty required field:', result1)
console.log('Expected: isValid=false, 1 error')
console.log('')

// Test Case 2: Numeric field validation
console.log('Test Case 2: Numeric field validation')
const fields2: ReportField[] = [
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

const data2a = { hb: 'invalid' }
const result2a = validateReportForm(fields2, data2a)
console.log('Invalid numeric value:', result2a)
console.log('Expected: isValid=false, 1 error')
console.log('')

const data2b = { hb: '15.5' }
const result2b = validateReportForm(fields2, data2b)
console.log('Valid numeric value:', result2b)
console.log('Expected: isValid=true, 0 errors')
console.log('')

// Test Case 3: Multiple fields
console.log('Test Case 3: Multiple fields validation')
const fields3: ReportField[] = [
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

const data3a = { hb: '15.5', blood_group: 'A' }
const result3a = validateReportForm(fields3, data3a)
console.log('All valid fields:', result3a)
console.log('Expected: isValid=true, 0 errors')
console.log('')

const data3b = { hb: 'invalid', blood_group: '' }
const result3b = validateReportForm(fields3, data3b)
console.log('Multiple invalid fields:', result3b)
console.log('Expected: isValid=false, 2 errors')
console.log('')

// Test Case 4: Optional fields
console.log('Test Case 4: Optional field validation')
const fields4: ReportField[] = [
  {
    id: '1',
    reportTypeId: 'type1',
    fieldName: 'optional_notes',
    fieldLabel: 'Optional Notes',
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

const data4 = { optional_notes: '' }
const result4 = validateReportForm(fields4, data4)
console.log('Empty optional field:', result4)
console.log('Expected: isValid=true, 0 errors')
console.log('')

console.log('All tests completed!')
